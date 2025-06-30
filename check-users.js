import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();
const sql = neon(process.env.VITE_DATABASE_URL);

async function checkUsers() {
  try {
    console.log('🔍 Checking users table...');
    const users = await sql`SELECT id, email FROM users LIMIT 5`;
    console.log('Available users:', users);
    
    if (users.length === 0) {
      console.log('⚠️ No users found. Creating a system user...');
      await sql`
        INSERT INTO users (id, email, name, role, "isActive", "createdAt", "updatedAt")
        VALUES ('system', 'system@innoventory.com', 'System User', 'ADMIN', true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `;
      console.log('✅ System user created');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Details:', error);
  }
}

checkUsers();
