import { pgTable, text, uuid } from "drizzle-orm/pg-core"

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  email: text('email').notNull(),
  password: text('password').notNull()
})
