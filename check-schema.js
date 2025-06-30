import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();
const sql = neon(process.env.VITE_DATABASE_URL);

async function checkSchema() {
  try {
    console.log('🔍 Checking existing database schema...\n');
    
    // Check vendors table
    console.log('📋 VENDORS table schema:');
    const vendorsSchema = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'vendors' 
      ORDER BY ordinal_position
    `;
    
    vendorsSchema.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check clients table
    console.log('\n📋 CLIENTS table schema:');
    const clientsSchema = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'clients' 
      ORDER BY ordinal_position
    `;
    
    clientsSchema.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check orders table
    console.log('\n📋 ORDERS table schema:');
    const ordersSchema = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      ORDER BY ordinal_position
    `;
    
    ordersSchema.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check row counts
    console.log('\n📊 Table row counts:');
    const vendorCount = await sql`SELECT COUNT(*) as count FROM vendors`;
    const clientCount = await sql`SELECT COUNT(*) as count FROM clients`;
    const orderCount = await sql`SELECT COUNT(*) as count FROM orders`;
    
    console.log(`  - vendors: ${vendorCount[0].count} rows`);
    console.log(`  - clients: ${clientCount[0].count} rows`);
    console.log(`  - orders: ${orderCount[0].count} rows`);
    
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
  }
}

checkSchema();
