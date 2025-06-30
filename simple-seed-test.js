import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load environment variables first
dotenv.config();

console.log('🧪 Simple Seeding Test...\n');

// Get database URL
const DATABASE_URL = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ No database URL found');
  process.exit(1);
}

console.log('🔗 Database URL found:', DATABASE_URL.substring(0, 50) + '...');

// Create SQL connection
const sql = neon(DATABASE_URL);

async function testBasicSeeding() {
  try {
    // Test connection
    console.log('🔄 Testing database connection...');
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Connection successful:', result[0].current_time);

    // Check current data counts
    console.log('\n📊 Current data counts:');
    const vendorCount = await sql`SELECT COUNT(*) as count FROM vendors`;
    const clientCount = await sql`SELECT COUNT(*) as count FROM clients`;
    console.log(`Vendors: ${vendorCount[0].count}`);
    console.log(`Clients: ${clientCount[0].count}`);

    // Seed one vendor
    console.log('\n🌱 Seeding one test vendor...');
    const vendorId = `test-vendor-${Date.now()}`;
    
    await sql`
      INSERT INTO vendors (
        id, name, email, phone, company, country, address, specialization,
        "onboardingDate", "companyType", "companyName", city, state, username,
        "gstNumber", "typeOfWork", "isActive", "createdAt", "updatedAt", "createdById", rating
      ) VALUES (
        ${vendorId}, 
        'Test Vendor Company', 
        'test@vendor.com', 
        '+91-9876543210', 
        'Test Vendor Company', 
        'India', 
        '123 Test Street', 
        'Testing services',
        ${new Date()}, 
        'Private Limited', 
        'Test Vendor Company Pvt Ltd', 
        'Bangalore', 
        'Karnataka', 
        'test_vendor', 
        'GST29TEST1234F1Z5', 
        ${['Testing', 'Quality Assurance']},
        ${true}, 
        ${new Date()}, 
        ${new Date()}, 
        'cmc8xw4jy0000ug4w41dehbd2',
        4.5
      )
      ON CONFLICT (id) DO NOTHING
    `;

    console.log('✅ Test vendor seeded successfully');

    // Check updated counts
    console.log('\n📊 Updated data counts:');
    const newVendorCount = await sql`SELECT COUNT(*) as count FROM vendors`;
    const newClientCount = await sql`SELECT COUNT(*) as count FROM clients`;
    console.log(`Vendors: ${newVendorCount[0].count}`);
    console.log(`Clients: ${newClientCount[0].count}`);

    console.log('\n✅ Simple seeding test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  }
}

testBasicSeeding();
