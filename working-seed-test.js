import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

// Verify environment variables are loaded
console.log('🔍 Environment check:');
console.log('VITE_DATABASE_URL:', process.env.VITE_DATABASE_URL ? 'SET' : 'NOT SET');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

// Now import modules that depend on environment variables
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ No database URL found');
  process.exit(1);
}

console.log('🔗 Using database URL:', DATABASE_URL.substring(0, 50) + '...');

const sql = neon(DATABASE_URL);

// Sample data for seeding
const sampleVendors = [
  {
    id: `vendor-seed-${Date.now()}-1`,
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    phone: '+91-9876543210',
    company: 'TechCorp Solutions',
    country: 'India',
    address: '123 Tech Street, Bangalore',
    specialization: 'Leading technology solutions provider',
    onboardingDate: new Date('2024-01-15'),
    companyType: 'Private Limited',
    companyName: 'TechCorp Solutions Pvt Ltd',
    city: 'Bangalore',
    state: 'Karnataka',
    username: 'techcorp_admin',
    gstNumber: 'GST29ABCDE1234F1Z5',
    typeOfWork: ['Software Development', 'IT Consulting'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: 'cmc8xw4jy0000ug4w41dehbd2',
    rating: 4.8
  },
  {
    id: `vendor-seed-${Date.now()}-2`,
    name: 'Digital Marketing Pro',
    email: 'hello@digitalmarketingpro.com',
    phone: '+91-9876543211',
    company: 'Digital Marketing Pro',
    country: 'India',
    address: '456 Marketing Avenue, Mumbai',
    specialization: 'Full-service digital marketing agency',
    onboardingDate: new Date('2024-02-10'),
    companyType: 'Partnership',
    companyName: 'Digital Marketing Pro',
    city: 'Mumbai',
    state: 'Maharashtra',
    username: 'dmp_admin',
    gstNumber: 'GST27FGHIJ5678K2L6',
    typeOfWork: ['Digital Marketing', 'SEO'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: 'cmc8xw4jy0000ug4w41dehbd2',
    rating: 4.5
  }
];

const sampleClients = [
  {
    company_name: 'Acme Corporation',
    company_type: 'Startup',
    onboarding_date: new Date('2024-01-10'),
    emails: ['contact@acme.com', 'support@acme.com'],
    phones: ['+1-555-123-4567', '+1-555-123-4568'],
    address: '123 Business St, New York, NY 10001',
    country: 'United States',
    state: 'New York',
    city: 'New York City',
    dpiit_registered: true,
    dpiit_number: 'DPIIT2024001',
    files: {
      registration: 'acme_registration.pdf'
    },
    status: 'Active',
    created_at: new Date(),
    updated_at: new Date()
  }
];

async function performSeeding() {
  try {
    console.log('\n🚀 Starting comprehensive seeding test...');

    // Test connection
    console.log('🔄 Testing database connection...');
    const connectionTest = await sql`SELECT NOW() as current_time`;
    console.log('✅ Connection successful:', connectionTest[0].current_time);

    // Get initial counts
    console.log('\n📊 Initial data counts:');
    const initialVendorCount = await sql`SELECT COUNT(*) as count FROM vendors`;
    const initialClientCount = await sql`SELECT COUNT(*) as count FROM clients`;
    console.log(`Vendors: ${initialVendorCount[0].count}`);
    console.log(`Clients: ${initialClientCount[0].count}`);

    // Seed vendors
    console.log('\n🌱 Seeding vendors...');
    for (const vendor of sampleVendors) {
      try {
        await sql`
          INSERT INTO vendors (
            id, name, email, phone, company, country, address, specialization,
            "onboardingDate", "companyType", "companyName", city, state, username,
            "gstNumber", "typeOfWork", "isActive", "createdAt", "updatedAt", "createdById", rating
          ) VALUES (
            ${vendor.id}, ${vendor.name}, ${vendor.email}, ${vendor.phone}, ${vendor.company},
            ${vendor.country}, ${vendor.address}, ${vendor.specialization}, ${vendor.onboardingDate},
            ${vendor.companyType}, ${vendor.companyName}, ${vendor.city}, ${vendor.state},
            ${vendor.username}, ${vendor.gstNumber}, ${vendor.typeOfWork},
            ${vendor.isActive}, ${vendor.createdAt}, ${vendor.updatedAt}, ${vendor.createdById}, ${vendor.rating}
          )
          ON CONFLICT (id) DO NOTHING
        `;
        console.log(`✅ Seeded vendor: ${vendor.name}`);
      } catch (error) {
        console.log(`⚠️ Vendor ${vendor.name} error:`, error.message);
      }
    }

    // Seed clients
    console.log('\n🌱 Seeding clients...');
    for (const client of sampleClients) {
      try {
        await sql`
          INSERT INTO clients (
            company_name, company_type, onboarding_date, emails, phones, address,
            country, state, city, dpiit_registered, dpiit_number, files, status,
            created_at, updated_at
          ) VALUES (
            ${client.company_name}, ${client.company_type}, ${client.onboarding_date},
            ${JSON.stringify(client.emails)}, ${JSON.stringify(client.phones)}, ${client.address},
            ${client.country}, ${client.state}, ${client.city}, ${client.dpiit_registered},
            ${client.dpiit_number}, ${JSON.stringify(client.files)}, ${client.status},
            ${client.created_at}, ${client.updated_at}
          )
        `;
        console.log(`✅ Seeded client: ${client.company_name}`);
      } catch (error) {
        console.log(`⚠️ Client ${client.company_name} error:`, error.message);
      }
    }

    // Get final counts
    console.log('\n📊 Final data counts:');
    const finalVendorCount = await sql`SELECT COUNT(*) as count FROM vendors`;
    const finalClientCount = await sql`SELECT COUNT(*) as count FROM clients`;
    console.log(`Vendors: ${finalVendorCount[0].count} (was ${initialVendorCount[0].count})`);
    console.log(`Clients: ${finalClientCount[0].count} (was ${initialClientCount[0].count})`);

    console.log('\n✅ Seeding completed successfully!');

    return {
      success: true,
      vendorsAdded: parseInt(finalVendorCount[0].count) - parseInt(initialVendorCount[0].count),
      clientsAdded: parseInt(finalClientCount[0].count) - parseInt(initialClientCount[0].count)
    };

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error('Error details:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the seeding
performSeeding().then(result => {
  console.log('\n📋 SEEDING SUMMARY:');
  console.log('='.repeat(50));
  if (result.success) {
    console.log(`✅ Success: Added ${result.vendorsAdded} vendors and ${result.clientsAdded} clients`);
  } else {
    console.log(`❌ Failed: ${result.error}`);
  }
});
