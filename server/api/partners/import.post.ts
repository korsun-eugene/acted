
import { read, utils } from 'xlsx'
import { eq } from 'drizzle-orm'
import { useDb } from '../../db/client'
import { partners } from '../../db/schema'

type ExcelRow = Record<string, unknown>

function getCell(row: ExcelRow, prefix: string): string {
  const key = Object.keys(row).find(
    key => key.trim().toLowerCase().startsWith(prefix.toLowerCase())
  )

  return key ? String(row[key] ?? '').trim() : ''
}

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event)
  const file = files?.find(item => item.name === 'file')
  
  if (!file || !file.filename?.toLowerCase().endsWith('.xlsx')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please upload an .xlsx file',
    })
  }

  if (file.data.length > 10 * 1024 * 1024) {
    throw createError({
      statusCode: 413,
      statusMessage: 'Maximum file size is 10 MB',
    })
  }

  let rows: ExcelRow[]
  const db = useDb();

  try {
    const workbook = read(file.data, { type: 'buffer' })
    const sheet = workbook.Sheets['DataList (v6)']

    if (!sheet) {
      throw new Error('Worksheet DataList (v6) not found')
    }

    rows = utils.sheet_to_json<ExcelRow>(sheet, {
      defval: '',
      raw: false,
    })
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Excel file or worksheet',
    })
  }

  let imported = 0
  let updated = 0
  let skipped = 0

  for (const row of rows) {
    const code = getCell(row, 'Partner Code')
    const name = getCell(row, 'Partner Name')

    if (!code || !name) {
      skipped++
      continue
    }

    const data = {
      code,
      name,
      type: getCell(row, 'Partner Type'),
      oblast: getCell(row, 'Operational Footprint - by Oblast'),
      eligibilityStatus: getCell(
        row,
        'Partnership Eligibility Status',
      ),
    }

    const existing = await db
      .select({ id: partners.id })
      .from(partners)
      .where(eq(partners.code, code))
      .limit(1)

    await db
      .insert(partners)
      .values(data)
      .onConflictDoUpdate({
        target: partners.code,
        set: {
          name: data.name,
          type: data.type,
          oblast: data.oblast,
          eligibilityStatus: data.eligibilityStatus,
        },
      })

    if (existing.length) {
      updated++
    } else {
      imported++
    }
  }

  return { imported, updated, skipped }
})