import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Use existing user IDs from the database
const ADMIN_USER_ID = 'cmc8xw4jy0000ug4w41dehbd2';
const SUBADMIN_USER_ID = 'cmc8xwdol000gug4w0rx3mbyb';

// Use existing customer IDs from the database
const EXISTING_CUSTOMER_IDS = [
  'cmc8xwifa000oug4wzd819iae', // TechCorp Inc.
  'cmc8xwjy4000qug4w6bmk9r6v', // Innovation Labs
  'cmc8xwkvk000sug4wy6fl86oa'  // StartupXYZ
];

// Simple sample data that works with existing schema
const sampleClients = [
  {
    companyName: 'TechStart Solutions',
    companyType: 'Startup',
    onboardingDate: new Date('2024-01-10'),
    emails: ['contact@techstart.com', 'support@techstart.com'],
    phones: ['+1-555-123-4567', '+1-555-123-4568'],
    address: '123 Tech Street, San Francisco, CA 94105',
    country: 'United States',
    state: 'California',
    city: 'San Francisco',
    dpiitRegistered: true,
    dpiitNumber: 'DPIIT2024010',
    files: {
      registration: 'techstart_registration.pdf',
      dpiitCertificate: 'techstart_dpiit.pdf'
    },
    status: 'Active'
  },
  {
    companyName: 'GreenTech Innovations',
    companyType: 'Private Limited',
    onboardingDate: new Date('2024-02-15'),
    emails: ['admin@greentech.in', 'projects@greentech.in'],
    phones: ['+91-9876543220', '+91-9876543221'],
    address: 'Green Building, Electronic City, Bangalore',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
    dpiitRegistered: true,
    dpiitNumber: 'DPIIT2024011',
    files: {
      registration: 'greentech_registration.pdf',
      dpiitCertificate: 'greentech_dpiit.pdf'
    },
    status: 'Active'
  },
  {
    companyName: 'FinanceFlow Corp',
    companyType: 'Corporation',
    onboardingDate: new Date('2024-03-01'),
    emails: ['contact@financeflow.com'],
    phones: ['+44-20-7946-1000'],
    address: '50 Financial Street, London',
    country: 'United Kingdom',
    state: 'England',
    city: 'London',
    dpiitRegistered: false,
    dpiitNumber: '',
    files: {
      registration: 'financeflow_registration.pdf'
    },
    status: 'Active'
  }
];

const sampleSubAdmins = [
  {
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@innoventory.com',
    onboardingDate: new Date('2024-01-15'),
    address: '123 Admin Street, Suite 200, Mumbai',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    username: 'alex.rodriguez',
    panNumber: 'ABCDE1234G',
    termOfWork: 'Full-time',
    files: {
      tds: 'alex_tds_2024.pdf',
      nda: 'alex_nda.pdf',
      employmentAgreement: 'alex_employment.pdf'
    },
    status: 'Active'
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@innoventory.com',
    onboardingDate: new Date('2024-02-01'),
    address: '456 Business Park, Pune',
    country: 'India',
    state: 'Maharashtra',
    city: 'Pune',
    username: 'priya.patel',
    panNumber: 'FGHIJ5678H',
    termOfWork: 'Full-time',
    files: {
      tds: 'priya_tds_2024.pdf',
      nda: 'priya_nda.pdf',
      employmentAgreement: 'priya_employment.pdf'
    },
    status: 'Active'
  }
];

// Seeding functions
async function seedClients() {
  console.log('🔄 Seeding clients...');
  
  for (const client of sampleClients) {
    try {
      await prisma.client.create({
        data: client
      });
      console.log(`✅ Seeded client: ${client.companyName}`);
    } catch (error) {
      console.log(`⚠️ Client ${client.companyName} error:`, error.message);
    }
  }
}

async function seedSubAdmins() {
  console.log('🔄 Seeding sub-admins...');
  
  for (const subAdmin of sampleSubAdmins) {
    try {
      await prisma.subAdmin.upsert({
        where: { email: subAdmin.email },
        update: {},
        create: subAdmin
      });
      console.log(`✅ Seeded sub-admin: ${subAdmin.name}`);
    } catch (error) {
      console.log(`⚠️ Sub-admin ${subAdmin.name} error:`, error.message);
    }
  }
}

// Main seeding function
async function main() {
  console.log('🚀 Starting simple database seeding...\n');

  try {
    // Get initial counts
    const initialCounts = {
      clients: await prisma.client.count(),
      subAdmins: await prisma.subAdmin.count()
    };

    console.log('📊 Initial counts:');
    Object.entries(initialCounts).forEach(([key, count]) => {
      console.log(`  ${key}: ${count}`);
    });
    console.log('');

    // Seed data
    await seedClients();
    console.log('');
    
    await seedSubAdmins();
    console.log('');

    // Get final counts
    const finalCounts = {
      clients: await prisma.client.count(),
      subAdmins: await prisma.subAdmin.count()
    };

    console.log('📊 Final counts:');
    Object.entries(finalCounts).forEach(([key, count]) => {
      console.log(`  ${key}: ${count} (was ${initialCounts[key]})`);
    });

    const totalAdded = Object.entries(finalCounts).reduce((sum, [key, count]) => {
      return sum + (count - initialCounts[key]);
    }, 0);

    console.log(`\n🎉 Simple seeding completed! Added ${totalAdded} total records.`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Execute seeding
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
