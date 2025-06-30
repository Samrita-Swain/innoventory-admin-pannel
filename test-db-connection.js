import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.VITE_DATABASE_URL;

console.log('🔗 Testing NeonDB Connection...');
console.log('📍 Database URL:', DATABASE_URL ? DATABASE_URL.replace(/:[^:@]*@/, ':****@') : 'NOT SET');

if (!DATABASE_URL) {
  console.error('❌ VITE_DATABASE_URL is not set in environment variables');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function testConnection() {
  try {
    console.log('\n🔄 Testing basic connection...');
    const result = await sql`SELECT NOW() as current_time, version() as db_version`;
    console.log('✅ Connection successful!');
    console.log('⏰ Server time:', result[0].current_time);
    console.log('🗄️ Database version:', result[0].db_version);

    console.log('\n🔄 Testing table existence...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📋 Existing tables:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

    if (tables.length === 0) {
      console.log('⚠️ No tables found. Database schema needs to be initialized.');
    }

    console.log('\n✅ Database connection test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error detail:', error.detail);
    
    // Provide helpful debugging information
    if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('\n🔍 Debugging tip: Network connectivity issue. Check your internet connection.');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n🔍 Debugging tip: Authentication failed. Check your database credentials.');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.error('\n🔍 Debugging tip: Database does not exist. Check your database name.');
    } else if (error.message.includes('SSL')) {
      console.error('\n🔍 Debugging tip: SSL connection issue. Check your connection string.');
    }
    
    process.exit(1);
  }
}

testConnection();
