import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample data for seeding
// Use existing user IDs from the database
const ADMIN_USER_ID = 'cmc8xw4jy0000ug4w41dehbd2';
const SUBADMIN_USER_ID = 'cmc8xwdol000gug4w0rx3mbyb';

const sampleUsers = [
  {
    id: 'new-admin-user-1',
    email: 'admin2@innoventory.com',
    name: 'Admin User 2',
    role: 'ADMIN',
    isActive: true
  },
  {
    id: 'new-subadmin-user-1',
    email: 'subadmin2@innoventory.com',
    name: 'Sub Admin User 2',
    role: 'SUB_ADMIN',
    isActive: true
  }
];

// Use existing customer IDs from the database
const EXISTING_CUSTOMER_IDS = [
  'cmc8xwifa000oug4wzd819iae', // TechCorp Inc.
  'cmc8xwjy4000qug4w6bmk9r6v', // Innovation Labs
  'cmc8xwkvk000sug4wy6fl86oa'  // StartupXYZ
];

const sampleCustomers = [
  {
    id: 'new-customer-1',
    email: 'contact@newtech.com',
    name: 'NewTech Solutions',
    phone: '+91-9876543220',
    company: 'NewTech Solutions',
    country: 'India',
    isActive: true
  },
  {
    id: 'new-customer-2',
    email: 'info@creativestudio.com',
    name: 'Creative Studio',
    phone: '+91-9876543221',
    company: 'Creative Studio',
    country: 'India',
    isActive: true
  },
  {
    id: 'new-customer-3',
    email: 'hello@globalcorp.com',
    name: 'Global Corp',
    phone: '+1-555-123-4570',
    company: 'Global Corp',
    country: 'United States',
    isActive: true
  }
];

const sampleVendors = [
  {
    id: 'vendor-1',
    name: 'TechCorp Solutions',
    email: 'vendor@techcorp.com',
    phone: '+91-9876543210',
    company: 'TechCorp Solutions',
    country: 'India',
    address: '123 Tech Street, Bangalore',
    specialization: 'Leading technology solutions provider specializing in software development',
    onboardingDate: new Date('2024-01-15'),
    companyType: 'Private Limited',
    companyName: 'TechCorp Solutions Pvt Ltd',
    city: 'Bangalore',
    state: 'Karnataka',
    username: 'techcorp_vendor',
    gstNumber: 'GST29ABCDE1234F1Z5',
    typeOfWork: ['Software Development', 'IT Consulting', 'Cloud Services'],
    isActive: true,
    createdById: ADMIN_USER_ID,
    rating: 4.8
  },
  {
    id: 'vendor-2',
    name: 'Digital Marketing Pro',
    email: 'vendor@digitalmarketingpro.com',
    phone: '+91-9876543211',
    company: 'Digital Marketing Pro',
    country: 'India',
    address: '456 Marketing Avenue, Mumbai',
    specialization: 'Full-service digital marketing agency with expertise in SEO and social media',
    onboardingDate: new Date('2024-02-10'),
    companyType: 'Partnership',
    companyName: 'Digital Marketing Pro',
    city: 'Mumbai',
    state: 'Maharashtra',
    username: 'dmp_vendor',
    gstNumber: 'GST27FGHIJ5678K2L6',
    typeOfWork: ['Digital Marketing', 'SEO', 'Social Media Marketing'],
    isActive: true,
    createdById: ADMIN_USER_ID,
    rating: 4.5
  },
  {
    id: 'vendor-3',
    name: 'Creative Design Studio',
    email: 'vendor@creativedesign.com',
    phone: '+91-9876543212',
    company: 'Creative Design Studio',
    country: 'India',
    address: '789 Design Plaza, Pune',
    specialization: 'Award-winning design studio specializing in branding and UI/UX design',
    onboardingDate: new Date('2024-01-20'),
    companyType: 'Private Limited',
    companyName: 'Creative Design Studio Pvt Ltd',
    city: 'Pune',
    state: 'Maharashtra',
    username: 'creative_vendor',
    gstNumber: 'GST27KLMNO9012P3Q7',
    typeOfWork: ['Graphic Design', 'UI/UX Design', 'Branding'],
    isActive: true,
    createdById: ADMIN_USER_ID,
    rating: 4.9
  },
  {
    id: 'vendor-4',
    name: 'Legal Associates',
    email: 'vendor@legalassociates.com',
    phone: '+91-9876543213',
    company: 'Legal Associates',
    country: 'India',
    address: '101 Law Street, Delhi',
    specialization: 'Legal services, patent filing, trademark registration, and compliance',
    onboardingDate: new Date('2024-03-01'),
    companyType: 'Partnership',
    companyName: 'Legal Associates LLP',
    city: 'Delhi',
    state: 'Delhi',
    username: 'legal_vendor',
    gstNumber: 'GST07LEGAL123F1Z5',
    typeOfWork: ['Legal Services', 'Patent Filing', 'Compliance'],
    isActive: true,
    createdById: ADMIN_USER_ID,
    rating: 4.7
  },
  {
    id: 'vendor-5',
    name: 'CloudTech Solutions',
    email: 'vendor@cloudtech.com',
    phone: '+91-9876543214',
    company: 'CloudTech Solutions',
    country: 'India',
    address: '202 Cloud Avenue, Hyderabad',
    specialization: 'Cloud infrastructure, DevOps, and system administration services',
    onboardingDate: new Date('2024-02-20'),
    companyType: 'Private Limited',
    companyName: 'CloudTech Solutions Pvt Ltd',
    city: 'Hyderabad',
    state: 'Telangana',
    username: 'cloudtech_vendor',
    gstNumber: 'GST36CLOUD567F1Z5',
    typeOfWork: ['Cloud Services', 'DevOps', 'System Administration'],
    isActive: true,
    createdById: ADMIN_USER_ID,
    rating: 4.6
  }
];

const sampleClients = [
  {
    companyName: 'Acme Corporation',
    companyType: 'Startup',
    onboardingDate: new Date('2024-01-10'),
    emails: ['contact@acme.com', 'support@acme.com'],
    phones: ['+1-555-123-4567', '+1-555-123-4568'],
    address: '123 Business St, New York, NY 10001',
    country: 'United States',
    state: 'New York',
    city: 'New York City',
    dpiitRegistered: true,
    dpiitNumber: 'DPIIT2024001',
    files: {
      registration: 'acme_registration.pdf',
      dpiitCertificate: 'acme_dpiit.pdf'
    },
    status: 'Active'
  },
  {
    companyName: 'InnovateTech Pvt Ltd',
    companyType: 'Private Limited',
    onboardingDate: new Date('2024-02-15'),
    emails: ['admin@innovatetech.in', 'projects@innovatetech.in'],
    phones: ['+91-9876543210', '+91-9876543211'],
    address: 'Tech Hub, Bandra Kurla Complex, Mumbai',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    dpiitRegistered: true,
    dpiitNumber: 'DPIIT2024002',
    files: {
      registration: 'innovatetech_registration.pdf',
      dpiitCertificate: 'innovatetech_dpiit.pdf'
    },
    status: 'Active'
  },
  {
    companyName: 'Global Solutions Inc',
    companyType: 'Corporation',
    onboardingDate: new Date('2024-03-01'),
    emails: ['contact@globalsolutions.com'],
    phones: ['+44-20-7946-0958'],
    address: '10 Downing Street, London',
    country: 'United Kingdom',
    state: 'England',
    city: 'London',
    dpiitRegistered: false,
    dpiitNumber: '',
    files: {
      registration: 'global_solutions_registration.pdf'
    },
    status: 'Active'
  },
  {
    companyName: 'StartupHub India',
    companyType: 'Startup',
    onboardingDate: new Date('2024-03-15'),
    emails: ['founder@startuphub.in', 'operations@startuphub.in'],
    phones: ['+91-9876543215', '+91-9876543216'],
    address: 'Startup Incubator, Koramangala, Bangalore',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
    dpiitRegistered: true,
    dpiitNumber: 'DPIIT2024003',
    files: {
      registration: 'startuphub_registration.pdf',
      dpiitCertificate: 'startuphub_dpiit.pdf',
      businessPlan: 'startuphub_business_plan.pdf'
    },
    status: 'Active'
  },
  {
    companyName: 'Enterprise Solutions Ltd',
    companyType: 'Private Limited',
    onboardingDate: new Date('2024-04-01'),
    emails: ['contact@enterprisesolutions.com', 'projects@enterprisesolutions.com'],
    phones: ['+44-20-7946-0959', '+44-20-7946-0960'],
    address: '25 Enterprise Street, London',
    country: 'United Kingdom',
    state: 'England',
    city: 'London',
    dpiitRegistered: false,
    dpiitNumber: '',
    files: {
      registration: 'enterprise_solutions_registration.pdf',
      taxCertificate: 'enterprise_solutions_tax.pdf'
    },
    status: 'Active'
  }
];

const sampleOrders = [
  {
    id: 'order-1',
    referenceNumber: 'ORD-2024-001',
    title: 'Website Development Project',
    description: 'Complete website development with modern design and responsive layout',
    type: 'DEVELOPMENT',
    status: 'IN_PROGRESS',
    country: 'India',
    priority: 'HIGH',
    startDate: new Date('2024-06-01'),
    dueDate: new Date('2024-07-15'),
    amount: 50000.00,
    paidAmount: 15000.00,
    currency: 'INR',
    customerId: 'customer-1',
    vendorId: 'vendor-1',
    assignedToId: 'admin-user-1'
  },
  {
    id: 'order-2',
    referenceNumber: 'ORD-2024-002',
    title: 'Digital Marketing Campaign',
    description: 'Comprehensive digital marketing strategy and implementation',
    type: 'MARKETING',
    status: 'PENDING',
    country: 'India',
    priority: 'MEDIUM',
    startDate: new Date('2024-06-15'),
    dueDate: new Date('2024-08-15'),
    amount: 75000.00,
    paidAmount: 0.00,
    currency: 'INR',
    customerId: 'customer-2',
    vendorId: 'vendor-2',
    assignedToId: 'admin-user-1'
  },
  {
    id: 'order-3',
    referenceNumber: 'ORD-2024-003',
    title: 'Mobile App Development',
    description: 'Cross-platform mobile application development for iOS and Android',
    type: 'DEVELOPMENT',
    status: 'COMPLETED',
    country: 'United States',
    priority: 'HIGH',
    startDate: new Date('2024-05-01'),
    dueDate: new Date('2024-06-30'),
    completedDate: new Date('2024-06-25'),
    amount: 120000.00,
    paidAmount: 120000.00,
    currency: 'USD',
    customerId: 'customer-3',
    vendorId: 'vendor-1',
    assignedToId: 'admin-user-1'
  },
  {
    id: 'order-4',
    referenceNumber: 'ORD-2024-004',
    title: 'Brand Identity Design',
    description: 'Complete brand identity design including logo, business cards, and marketing materials',
    type: 'DESIGN',
    status: 'IN_PROGRESS',
    country: 'India',
    priority: 'MEDIUM',
    startDate: new Date('2024-06-10'),
    dueDate: new Date('2024-07-10'),
    amount: 35000.00,
    paidAmount: 10000.00,
    currency: 'INR',
    customerId: 'customer-1',
    vendorId: 'vendor-3',
    assignedToId: 'subadmin-user-1'
  },
  {
    id: 'order-5',
    referenceNumber: 'ORD-2024-005',
    title: 'Patent Filing Services',
    description: 'Patent application filing and legal documentation for new technology',
    type: 'LEGAL',
    status: 'PENDING',
    country: 'India',
    priority: 'HIGH',
    startDate: new Date('2024-06-20'),
    dueDate: new Date('2024-08-20'),
    amount: 85000.00,
    paidAmount: 0.00,
    currency: 'INR',
    customerId: 'customer-2',
    vendorId: 'vendor-4',
    assignedToId: 'admin-user-1'
  }
];

const sampleSubAdmins = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@innoventory.com',
    onboardingDate: new Date('2024-01-15'),
    address: '123 Business Street, Suite 100, New York, NY 10001',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    username: 'sarah.johnson',
    panNumber: 'ABCDE1234F',
    termOfWork: 'Full-time',
    files: {
      tds: 'sarah_tds_2024.pdf',
      nda: 'sarah_nda.pdf',
      employmentAgreement: 'sarah_employment.pdf'
    },
    status: 'Active'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@innoventory.com',
    onboardingDate: new Date('2024-02-01'),
    address: '456 Tech Park, Whitefield, Bangalore',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
    username: 'michael.chen',
    panNumber: 'FGHIJ5678K',
    termOfWork: 'Full-time',
    files: {
      tds: 'michael_tds_2024.pdf',
      nda: 'michael_nda.pdf',
      employmentAgreement: 'michael_employment.pdf'
    },
    status: 'Active'
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@innoventory.com',
    onboardingDate: new Date('2024-03-01'),
    address: '789 Innovation Hub, Gurgaon',
    country: 'India',
    state: 'Haryana',
    city: 'Gurgaon',
    username: 'priya.sharma',
    panNumber: 'KLMNO9012P',
    termOfWork: 'Part-time',
    files: {
      tds: 'priya_tds_2024.pdf',
      nda: 'priya_nda.pdf',
      employmentAgreement: 'priya_employment.pdf'
    },
    status: 'Active'
  }
];

const sampleTypeOfWork = [
  {
    name: 'Software Development',
    description: 'Custom software development, web applications, mobile apps, and programming services',
    isActive: true
  },
  {
    name: 'Digital Marketing',
    description: 'SEO, social media marketing, online advertising, and digital strategy services',
    isActive: true
  },
  {
    name: 'Graphic Design',
    description: 'Logo design, branding, visual identity, and creative design services',
    isActive: true
  },
  {
    name: 'IT Consulting',
    description: 'Technology consulting, system architecture, and IT strategy services',
    isActive: true
  },
  {
    name: 'Content Writing',
    description: 'Blog writing, copywriting, technical documentation, and content strategy',
    isActive: true
  },
  {
    name: 'Legal Services',
    description: 'Patent filing, trademark registration, legal compliance, and contract drafting',
    isActive: true
  },
  {
    name: 'Cloud Services',
    description: 'Cloud infrastructure setup, migration, and management services',
    isActive: true
  },
  {
    name: 'Data Analytics',
    description: 'Business intelligence, data analysis, and reporting services',
    isActive: true
  },
  {
    name: 'Mobile Development',
    description: 'iOS and Android mobile application development',
    isActive: true
  },
  {
    name: 'UI/UX Design',
    description: 'User interface and user experience design services',
    isActive: true
  }
];

// Seeding functions
async function seedUsers() {
  console.log('🔄 Seeding users...');

  for (const user of sampleUsers) {
    try {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: user
      });
      console.log(`✅ Seeded user: ${user.name}`);
    } catch (error) {
      console.log(`⚠️ User ${user.name} error:`, error.message);
    }
  }
}

async function seedCustomers() {
  console.log('🔄 Seeding customers...');

  for (const customer of sampleCustomers) {
    try {
      await prisma.customer.upsert({
        where: { email: customer.email },
        update: {},
        create: customer
      });
      console.log(`✅ Seeded customer: ${customer.name}`);
    } catch (error) {
      console.log(`⚠️ Customer ${customer.name} error:`, error.message);
    }
  }
}

async function seedVendors() {
  console.log('🔄 Seeding vendors...');

  for (const vendor of sampleVendors) {
    try {
      await prisma.vendor.upsert({
        where: { email: vendor.email },
        update: {},
        create: vendor
      });
      console.log(`✅ Seeded vendor: ${vendor.name}`);
    } catch (error) {
      console.log(`⚠️ Vendor ${vendor.name} error:`, error.message);
    }
  }
}

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

async function seedOrders() {
  console.log('🔄 Seeding orders...');

  for (const order of sampleOrders) {
    try {
      await prisma.order.upsert({
        where: { referenceNumber: order.referenceNumber },
        update: {},
        create: order
      });
      console.log(`✅ Seeded order: ${order.title}`);
    } catch (error) {
      console.log(`⚠️ Order ${order.title} error:`, error.message);
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

async function seedTypeOfWork() {
  console.log('🔄 Seeding type of work...');

  for (const work of sampleTypeOfWork) {
    try {
      await prisma.typeOfWork.upsert({
        where: { name: work.name },
        update: {},
        create: work
      });
      console.log(`✅ Seeded type of work: ${work.name}`);
    } catch (error) {
      console.log(`⚠️ Type of work ${work.name} error:`, error.message);
    }
  }
}

// Main seeding function
async function main() {
  console.log('🚀 Starting comprehensive database seeding...\n');

  try {
    // Get initial counts
    const initialCounts = {
      users: await prisma.user.count(),
      customers: await prisma.customer.count(),
      vendors: await prisma.vendor.count(),
      clients: await prisma.client.count(),
      orders: await prisma.order.count(),
      subAdmins: await prisma.subAdmin.count(),
      typeOfWork: await prisma.typeOfWork.count()
    };

    console.log('📊 Initial counts:');
    Object.entries(initialCounts).forEach(([key, count]) => {
      console.log(`  ${key}: ${count}`);
    });
    console.log('');

    // Seed in order (respecting foreign key constraints)
    await seedUsers();
    console.log('');

    await seedCustomers();
    console.log('');

    await seedVendors();
    console.log('');

    await seedClients();
    console.log('');

    await seedOrders();
    console.log('');

    await seedSubAdmins();
    console.log('');

    await seedTypeOfWork();
    console.log('');

    // Get final counts
    const finalCounts = {
      users: await prisma.user.count(),
      customers: await prisma.customer.count(),
      vendors: await prisma.vendor.count(),
      clients: await prisma.client.count(),
      orders: await prisma.order.count(),
      subAdmins: await prisma.subAdmin.count(),
      typeOfWork: await prisma.typeOfWork.count()
    };

    console.log('📊 Final counts:');
    Object.entries(finalCounts).forEach(([key, count]) => {
      console.log(`  ${key}: ${count} (was ${initialCounts[key]})`);
    });

    const totalAdded = Object.entries(finalCounts).reduce((sum, [key, count]) => {
      return sum + (count - initialCounts[key]);
    }, 0);

    console.log(`\n🎉 Seeding completed! Added ${totalAdded} total records.`);

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
