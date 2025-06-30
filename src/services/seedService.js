import { sql } from '../config/database.js';

/**
 * Comprehensive Data Seeding Service
 * Seeds data that matches the existing database schema
 */

// Sample vendors data matching the existing schema
const sampleVendors = [
  {
    id: `vendor-${Date.now()}-1`,
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    phone: '+91-9876543210',
    company: 'TechCorp Solutions',
    country: 'India',
    address: '123 Tech Street, Bangalore',
    specialization: 'Leading technology solutions provider specializing in software development and IT consulting',
    onboardingDate: new Date('2024-01-15'),
    companyType: 'Private Limited',
    companyName: 'TechCorp Solutions Pvt Ltd',
    city: 'Bangalore',
    state: 'Karnataka',
    username: 'techcorp_admin',
    gstNumber: 'GST29ABCDE1234F1Z5',
    typeOfWork: ['Software Development', 'IT Consulting', 'Cloud Services'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: 'cmc8xw4jy0000ug4w41dehbd2', // Use existing admin user
    rating: 4.8
  },
  {
    id: `vendor-${Date.now()}-2`,
    name: 'Digital Marketing Pro',
    email: 'hello@digitalmarketingpro.com',
    phone: '+91-9876543211',
    company: 'Digital Marketing Pro',
    country: 'India',
    address: '456 Marketing Avenue, Mumbai',
    specialization: 'Full-service digital marketing agency with expertise in SEO, social media, and online advertising',
    onboardingDate: new Date('2024-02-10'),
    companyType: 'Partnership',
    companyName: 'Digital Marketing Pro',
    city: 'Mumbai',
    state: 'Maharashtra',
    username: 'dmp_admin',
    gstNumber: 'GST27FGHIJ5678K2L6',
    typeOfWork: ['Digital Marketing', 'SEO', 'Social Media Marketing'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: 'cmc8xw4jy0000ug4w41dehbd2', // Use existing admin user
    rating: 4.5
  },
  {
    id: `vendor-${Date.now()}-3`,
    name: 'Creative Design Studio',
    email: 'info@creativedesign.com',
    phone: '+91-9876543212',
    company: 'Creative Design Studio',
    country: 'India',
    address: '789 Design Plaza, Pune',
    specialization: 'Award-winning design studio specializing in branding, UI/UX design, and creative solutions',
    onboardingDate: new Date('2024-01-20'),
    companyType: 'Private Limited',
    companyName: 'Creative Design Studio Pvt Ltd',
    city: 'Pune',
    state: 'Maharashtra',
    username: 'creative_admin',
    gstNumber: 'GST27KLMNO9012P3Q7',
    typeOfWork: ['Graphic Design', 'UI/UX Design', 'Branding'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: 'cmc8xw4jy0000ug4w41dehbd2', // Use existing admin user
    rating: 4.9
  }
];

// Sample clients data matching the existing schema
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
      registration: 'acme_registration.pdf',
      dpiit_certificate: 'acme_dpiit.pdf'
    },
    status: 'Active',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    company_name: 'InnovateTech Pvt Ltd',
    company_type: 'Private Limited',
    onboarding_date: new Date('2024-02-15'),
    emails: ['admin@innovatetech.in', 'projects@innovatetech.in'],
    phones: ['+91-9876543210', '+91-9876543211'],
    address: 'Tech Hub, Bandra Kurla Complex, Mumbai',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    dpiit_registered: true,
    dpiit_number: 'DPIIT2024002',
    files: {
      registration: 'innovatetech_registration.pdf',
      dpiit_certificate: 'innovatetech_dpiit.pdf'
    },
    status: 'Active',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    company_name: 'Global Solutions Inc',
    company_type: 'Corporation',
    onboarding_date: new Date('2024-03-01'),
    emails: ['contact@globalsolutions.com'],
    phones: ['+44-20-7946-0958'],
    address: '10 Downing Street, London',
    country: 'United Kingdom',
    state: 'England',
    city: 'London',
    dpiit_registered: false,
    dpiit_number: '',
    files: {
      registration: 'global_solutions_registration.pdf'
    },
    status: 'Active',
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Sample type of work data
const sampleTypeOfWork = [
  {
    name: 'Software Development',
    description: 'Custom software development, web applications, mobile apps, and programming services',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Digital Marketing',
    description: 'SEO, social media marketing, online advertising, and digital strategy services',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Graphic Design',
    description: 'Logo design, branding, visual identity, and creative design services',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'IT Consulting',
    description: 'Technology consulting, system architecture, and IT strategy services',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Content Writing',
    description: 'Blog writing, copywriting, technical documentation, and content strategy',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample sub-admins data
const sampleSubAdmins = [
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
    files: {
      tds: 'sarah_tds_2024.pdf',
      nda: 'sarah_nda.pdf',
      employment_agreement: 'sarah_employment.pdf'
    },
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
    files: {
      tds: 'michael_tds_2024.pdf',
      nda: 'michael_nda.pdf',
      employment_agreement: 'michael_employment.pdf'
    },
    status: 'Active',
    created_at: new Date(),
    updated_at: new Date()
  }
];

/**
 * Seed vendors data
 */
export const seedVendors = async () => {
  try {
    console.log('🌱 Seeding vendors data...');
    
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
        console.log(`⚠️ Vendor ${vendor.name} already exists or error:`, error.message);
      }
    }
    
    console.log('✅ Vendors seeding completed');
    return true;
  } catch (error) {
    console.error('❌ Error seeding vendors:', error);
    return false;
  }
};

/**
 * Seed clients data
 */
export const seedClients = async () => {
  try {
    console.log('🌱 Seeding clients data...');
    
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
        console.log(`⚠️ Client ${client.company_name} already exists or error:`, error.message);
      }
    }
    
    console.log('✅ Clients seeding completed');
    return true;
  } catch (error) {
    console.error('❌ Error seeding clients:', error);
    return false;
  }
};

/**
 * Seed type of work data
 */
export const seedTypeOfWork = async () => {
  try {
    console.log('🌱 Seeding type of work data...');

    for (const work of sampleTypeOfWork) {
      try {
        await sql`
          INSERT INTO type_of_work (name, description, "isActive", "createdAt", "updatedAt")
          VALUES (${work.name}, ${work.description}, ${work.isActive}, ${work.createdAt}, ${work.updatedAt})
          ON CONFLICT (name) DO NOTHING
        `;
        console.log(`✅ Seeded type of work: ${work.name}`);
      } catch (error) {
        console.log(`⚠️ Type of work ${work.name} already exists or error:`, error.message);
      }
    }

    console.log('✅ Type of work seeding completed');
    return true;
  } catch (error) {
    console.error('❌ Error seeding type of work:', error);
    return false;
  }
};

/**
 * Seed sub-admins data
 */
export const seedSubAdmins = async () => {
  try {
    console.log('🌱 Seeding sub-admins data...');

    for (const admin of sampleSubAdmins) {
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
        console.log(`⚠️ Sub-admin ${admin.name} already exists or error:`, error.message);
      }
    }

    console.log('✅ Sub-admins seeding completed');
    return true;
  } catch (error) {
    console.error('❌ Error seeding sub-admins:', error);
    return false;
  }
};

/**
 * Seed all data
 */
export const seedAllData = async () => {
  try {
    console.log('🚀 Starting comprehensive data seeding...');

    const results = {
      vendors: await seedVendors(),
      clients: await seedClients(),
      typeOfWork: await seedTypeOfWork(),
      subAdmins: await seedSubAdmins()
    };

    const successCount = Object.values(results).filter(Boolean).length;
    const totalCount = Object.keys(results).length;

    console.log(`✅ Data seeding completed: ${successCount}/${totalCount} successful`);
    console.log('📊 Seeding results:', results);

    return {
      success: successCount === totalCount,
      results,
      summary: `${successCount}/${totalCount} categories seeded successfully`
    };
  } catch (error) {
    console.error('❌ Error in comprehensive seeding:', error);
    return {
      success: false,
      error: error.message,
      summary: 'Seeding failed'
    };
  }
};

/**
 * Clear all seeded data (for testing purposes)
 */
export const clearSeededData = async () => {
  try {
    console.log('🧹 Clearing seeded data...');

    // Clear in reverse order to handle foreign key constraints
    await sql`DELETE FROM sub_admins WHERE created_at >= CURRENT_DATE`;
    await sql`DELETE FROM type_of_work WHERE "createdAt" >= CURRENT_DATE`;
    await sql`DELETE FROM clients WHERE created_at >= CURRENT_DATE`;
    await sql`DELETE FROM vendors WHERE "createdAt" >= CURRENT_DATE`;

    console.log('✅ Seeded data cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing seeded data:', error);
    return false;
  }
};

/**
 * Get seeding status
 */
export const getSeedingStatus = async () => {
  try {
    const vendorCount = await sql`SELECT COUNT(*) as count FROM vendors`;
    const clientCount = await sql`SELECT COUNT(*) as count FROM clients`;
    const typeOfWorkCount = await sql`SELECT COUNT(*) as count FROM type_of_work`;
    const subAdminCount = await sql`SELECT COUNT(*) as count FROM sub_admins`;

    return {
      vendors: parseInt(vendorCount[0].count),
      clients: parseInt(clientCount[0].count),
      typeOfWork: parseInt(typeOfWorkCount[0].count),
      subAdmins: parseInt(subAdminCount[0].count),
      total: parseInt(vendorCount[0].count) + parseInt(clientCount[0].count) +
             parseInt(typeOfWorkCount[0].count) + parseInt(subAdminCount[0].count)
    };
  } catch (error) {
    console.error('❌ Error getting seeding status:', error);
    return null;
  }
};
