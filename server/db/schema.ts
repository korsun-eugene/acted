import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const partners = pgTable('partners', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  type: text('type'),
  oblast: text('oblast'),
  eligibilityStatus: text('eligibility_status'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
