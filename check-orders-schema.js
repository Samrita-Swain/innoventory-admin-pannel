import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();
const sql = neon(process.env.VITE_DATABASE_URL);

async function checkOrdersSchema() {
  try {
    console.log('🔍 Checking orders table schema...');
    const ordersSchema = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      ORDER BY ordinal_position
    `;
    
    console.log('📋 ORDERS table schema:');
    ordersSchema.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });

    // Also check what customers exist for foreign key reference
    console.log('\n🔍 Checking customers for foreign key reference...');
    const customers = await sql`SELECT id, email FROM customers LIMIT 5`;
    console.log('Available customers:', customers);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkOrdersSchema();
