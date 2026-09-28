import { and, asc, count, ilike } from 'drizzle-orm'
import { z } from 'zod'
import { useDb } from '../db/client'
import { partners } from '../db/schema'

const querySchema = z.object({
  search: z.string().trim().max(200).default(''),
  page: z.coerce.number().int().min(1).default(1),
})

export default defineEventHandler(async (event) => {
  const parsed = querySchema.safeParse(getQuery(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid search or page parameter' })
  }
  const { search, page } = parsed.data
  const pageSize = 10
  const db = useDb()
  const where = search ? ilike(partners.name, `%${search}%`) : undefined
  const [items, totalRows] = await Promise.all([
    db.select({
      id: partners.id,
      code: partners.code,
      name: partners.name,
      type: partners.type,
      oblast: partners.oblast,
      eligibilityStatus: partners.eligibilityStatus,
    }).from(partners).where(where).orderBy(asc(partners.name), asc(partners.code))
      .limit(pageSize).offset((page - 1) * pageSize),
    db.select({ total: count() }).from(partners).where(where),
  ])
  const total = totalRows[0]?.total ?? 0
  return { items, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } }
})
