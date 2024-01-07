import { drizzle } from "drizzle-orm/postgres-js"
import postgres from 'postgres'
import * as schema from '../../../migrations/schema'
import * as dotenv from 'dotenv'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
dotenv.config({ path: '.env' })
if (!process.env.SUPABASE_URL) {
  console.log("no database url")
}

const client = postgres(process.env.SUPABASE_URL as string)
const db = drizzle(client, { schema })
const migrateDB = async () => {
  try {
    console.log("Migrating client")
    await migrate(db, { migrationsFolder: 'migrations' })
    console.log("Successfully migrated")
  } catch (error) {
    console.log("Error Migration")
  }
}

migrateDB()
export default db
