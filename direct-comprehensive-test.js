import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load environment variables first
dotenv.config();

console.log('🚀 Direct Comprehensive Seeding Test...\n');

// Get database URL
const DATABASE_URL = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ No database URL found');
  process.exit(1);
}

console.log('🔗 Database URL found:', DATABASE_URL.substring(0, 50) + '...');

// Create SQL connection
const sql = neon(DATABASE_URL);

// Comprehensive sample data
const comprehensiveVendors = [
  {
    id: `vendor-comp-${Date.now()}-1`,
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
    id: `vendor-comp-${Date.now()}-2`,
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
  },
  {
    id: `vendor-comp-${Date.now()}-3`,
    name: 'Legal Associates',
    email: 'contact@legalassociates.com',
    phone: '+91-9876543213',
    company: 'Legal Associates',
    country: 'India',
    address: '101 Law Street, Delhi',
    specialization: 'Legal services and compliance',
    onboardingDate: new Date('2024-03-01'),
    companyType: 'Partnership',
    companyName: 'Legal Associates LLP',
    city: 'Delhi',
    state: 'Delhi',
    username: 'legal_admin',
    gstNumber: 'GST07LEGAL123F1Z5',
    typeOfWork: ['Legal Services', 'Patent Filing'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: 'cmc8xw4jy0000ug4w41dehbd2',
    rating: 4.7
  }
];

const comprehensiveClients = [
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
    files: { registration: 'acme_registration.pdf' },
    status: 'Active',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    company_name: 'StartupHub India',
    company_type: 'Startup',
    onboarding_date: new Date('2024-03-15'),
    emails: ['founder@startuphub.in', 'operations@startuphub.in'],
    phones: ['+91-9876543215', '+91-9876543216'],
    address: 'Startup Incubator, Koramangala, Bangalore',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
    dpiit_registered: true,
    dpiit_number: 'DPIIT2024003',
    files: { registration: 'startuphub_registration.pdf' },
    status: 'Active',
    created_at: new Date(),
    updated_at: new Date()
  }
];

const comprehensiveTypeOfWork = [
  { name: 'Software Development', description: 'Custom software development services', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Digital Marketing', description: 'SEO and online marketing services', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Legal Services', description: 'Patent filing and legal compliance', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Graphic Design', description: 'Logo and branding design services', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { name: 'Cloud Services', description: 'Cloud infrastructure and DevOps', isActive: true, createdAt: new Date(), updatedAt: new Date() }
];

const comprehensiveSubAdmins = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@innoventory.com',
    onboarding_date: new Date('2024-01-15'),
    address: '123 Business Street, Suite 100, New York, NY 10001',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    username: 'sarah.johnson',
    pan_number: 'ABCDE1234F',
    term_of_work: 'Full-time',
    files: { tds: 'sarah_tds_2024.pdf' },
    status: 'Active',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@innoventory.com',
    onboarding_date: new Date('2024-02-01'),
    address: '456 Tech Park, Whitefield, Bangalore',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
    username: 'michael.chen',
    pan_number: 'FGHIJ5678K',
    term_of_work: 'Full-time',
    files: { tds: 'michael_tds_2024.pdf' },
    status: 'Active',
    created_at: new Date(),
    updated_at: new Date()
  }
];

async function performComprehensiveSeeding() {
  try {
    console.log('🔄 Testing database connection...');
    const connectionTest = await sql`SELECT NOW() as current_time`;
    console.log('✅ Connection successful:', connectionTest[0].current_time);

    // Get initial counts
    console.log('\n📊 Initial data counts:');
    const initialCounts = {
      vendors: parseInt((await sql`SELECT COUNT(*) as count FROM vendors`)[0].count),
      clients: parseInt((await sql`SELECT COUNT(*) as count FROM clients`)[0].count),
      typeOfWork: parseInt((await sql`SELECT COUNT(*) as count FROM type_of_work`)[0].count),
      subAdmins: parseInt((await sql`SELECT COUNT(*) as count FROM sub_admins`)[0].count),
      orders: parseInt((await sql`SELECT COUNT(*) as count FROM orders`)[0].count)
    };
    
    console.log(`Vendors: ${initialCounts.vendors}`);
    console.log(`Clients: ${initialCounts.clients}`);
    console.log(`Type of Work: ${initialCounts.typeOfWork}`);
    console.log(`Sub Admins: ${initialCounts.subAdmins}`);
    console.log(`Orders: ${initialCounts.orders}`);

    // Seed all data types
    console.log('\n🌱 Comprehensive seeding...');

    // Seed vendors
    console.log('🏢 Seeding vendors...');
    for (const vendor of comprehensiveVendors) {
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
    console.log('👥 Seeding clients...');
    for (const client of comprehensiveClients) {
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

    // Seed type of work
    console.log('🔧 Seeding type of work...');
    for (const work of comprehensiveTypeOfWork) {
      try {
        await sql`
          INSERT INTO type_of_work (name, description, "isActive", "createdAt", "updatedAt")
          VALUES (${work.name}, ${work.description}, ${work.isActive}, ${work.createdAt}, ${work.updatedAt})
        `;
        console.log(`✅ Seeded work type: ${work.name}`);
      } catch (error) {
        console.log(`⚠️ Work type ${work.name} error:`, error.message);
      }
    }

    // Seed sub-admins
    console.log('👨‍💼 Seeding sub-admins...');
    for (const admin of comprehensiveSubAdmins) {
      try {
        await sql`
          INSERT INTO sub_admins (
            name, email, onboarding_date, address, country, state, city,
            username, pan_number, term_of_work, files, status, created_at, updated_at
          ) VALUES (
            ${admin.name}, ${admin.email}, ${admin.onboarding_date}, ${admin.address},
            ${admin.country}, ${admin.state}, ${admin.city}, ${admin.username},
            ${admin.pan_number}, ${admin.term_of_work}, ${JSON.stringify(admin.files)},
            ${admin.status}, ${admin.created_at}, ${admin.updated_at}
          )
          ON CONFLICT (email) DO NOTHING
        `;
        console.log(`✅ Seeded sub-admin: ${admin.name}`);
      } catch (error) {
        console.log(`⚠️ Sub-admin ${admin.name} error:`, error.message);
      }
    }

    // Get final counts
    console.log('\n📊 Final data counts:');
    const finalCounts = {
      vendors: parseInt((await sql`SELECT COUNT(*) as count FROM vendors`)[0].count),
      clients: parseInt((await sql`SELECT COUNT(*) as count FROM clients`)[0].count),
      typeOfWork: parseInt((await sql`SELECT COUNT(*) as count FROM type_of_work`)[0].count),
      subAdmins: parseInt((await sql`SELECT COUNT(*) as count FROM sub_admins`)[0].count),
      orders: parseInt((await sql`SELECT COUNT(*) as count FROM orders`)[0].count)
    };
    
    console.log(`Vendors: ${finalCounts.vendors} (was ${initialCounts.vendors})`);
    console.log(`Clients: ${finalCounts.clients} (was ${initialCounts.clients})`);
    console.log(`Type of Work: ${finalCounts.typeOfWork} (was ${initialCounts.typeOfWork})`);
    console.log(`Sub Admins: ${finalCounts.subAdmins} (was ${initialCounts.subAdmins})`);
    console.log(`Orders: ${finalCounts.orders} (was ${initialCounts.orders})`);

    console.log('\n✅ Comprehensive seeding completed successfully!');

    return {
      success: true,
      initialCounts,
      finalCounts,
      added: {
        vendors: finalCounts.vendors - initialCounts.vendors,
        clients: finalCounts.clients - initialCounts.clients,
        typeOfWork: finalCounts.typeOfWork - initialCounts.typeOfWork,
        subAdmins: finalCounts.subAdmins - initialCounts.subAdmins,
        orders: finalCounts.orders - initialCounts.orders
      }
    };

  } catch (error) {
    console.error('\n❌ Comprehensive seeding failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the comprehensive seeding
performComprehensiveSeeding().then(result => {
  console.log('\n📋 COMPREHENSIVE SEEDING SUMMARY:');
  console.log('='.repeat(60));
  if (result.success) {
    console.log('✅ Status: SUCCESS');
    console.log(`🏢 Vendors added: ${result.added.vendors}`);
    console.log(`👥 Clients added: ${result.added.clients}`);
    console.log(`🔧 Work types added: ${result.added.typeOfWork}`);
    console.log(`👨‍💼 Sub-admins added: ${result.added.subAdmins}`);
    console.log(`📋 Orders added: ${result.added.orders}`);
    
    const totalAdded = Object.values(result.added).reduce((sum, count) => sum + count, 0);
    console.log(`🎉 Total records added: ${totalAdded}`);
  } else {
    console.log('❌ Status: FAILED');
    console.log(`Error: ${result.error}`);
  }
});
