import { sql } from '../config/database.js';

// Use existing user IDs from the database
const ADMIN_USER_ID = 'cmc8xw4jy0000ug4w41dehbd2';
const SUBADMIN_USER_ID = 'cmc8xwdol000gug4w0rx3mbyb';

/**
 * Prisma-based Seeding Service
 * Clean, reliable seeding using Prisma ORM
 */

// Sample data generators
const generateClients = (count = 3) => {
  const companies = [
    'TechStart Solutions', 'GreenTech Innovations', 'FinanceFlow Corp',
    'DataDriven Analytics', 'CloudFirst Systems', 'AI Innovations Lab',
    'CyberSecure Solutions', 'MobileFirst Apps', 'BlockChain Ventures',
    'IoT Smart Solutions'
  ];
  
  const countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia'];
  const states = ['Maharashtra', 'Karnataka', 'California', 'Texas', 'London'];
  const cities = ['Mumbai', 'Bangalore', 'San Francisco', 'Austin', 'London'];
  
  return Array.from({ length: count }, (_, i) => ({
    companyName: companies[i % companies.length] + ` ${i + 1}`,
    companyType: ['Startup', 'Private Limited', 'Corporation'][i % 3],
    onboardingDate: new Date(2024, i % 12, (i % 28) + 1),
    emails: [`contact@${companies[i % companies.length].toLowerCase().replace(/\s+/g, '')}.com`],
    phones: [`+91-987654${3210 + i}`],
    address: `${100 + i} Business Street, ${cities[i % cities.length]}`,
    country: countries[i % countries.length],
    state: states[i % states.length],
    city: cities[i % cities.length],
    dpiitRegistered: i % 2 === 0,
    dpiitNumber: i % 2 === 0 ? `DPIIT2024${String(i).padStart(3, '0')}` : '',
    files: {
      registration: `${companies[i % companies.length].toLowerCase().replace(/\s+/g, '')}_registration.pdf`
    },
    status: 'Active'
  }));
};

const generateSubAdmins = (count = 2) => {
  const names = [
    'Alex Rodriguez', 'Priya Patel', 'David Kim', 'Sarah Wilson',
    'Raj Sharma', 'Emily Chen', 'Michael Brown', 'Anita Singh'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    name: names[i % names.length],
    email: `${names[i % names.length].toLowerCase().replace(/\s+/g, '.')}@innoventory.com`,
    onboardingDate: new Date(2024, i % 12, (i % 28) + 1),
    address: `${200 + i} Admin Street, Suite ${100 + i}, Mumbai`,
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    username: names[i % names.length].toLowerCase().replace(/\s+/g, '.'),
    panNumber: `ABCDE${1234 + i}${String.fromCharCode(65 + i)}`,
    termOfWork: i % 2 === 0 ? 'Full-time' : 'Part-time',
    files: {
      tds: `${names[i % names.length].toLowerCase().replace(/\s+/g, '_')}_tds_2024.pdf`,
      nda: `${names[i % names.length].toLowerCase().replace(/\s+/g, '_')}_nda.pdf`
    },
    status: 'Active'
  }));
};

/**
 * Seeding functions
 */
export const seedClients = async (count = 5) => {
  try {
    console.log(`🔄 Seeding ${count} clients...`);
    const clients = generateClients(count);
    let seeded = 0;

    for (const client of clients) {
      try {
        await sql`
          INSERT INTO clients (
            "companyName", "companyType", "onboardingDate", emails, phones,
            address, country, state, city, "isDpiitRegistered", "dpiitNumber",
            "dpiitCertificate", "isActive", "totalProjects", "createdAt", "updatedAt"
          ) VALUES (
            ${client.companyName}, ${client.companyType}, ${client.onboardingDate},
            ${JSON.stringify(client.emails)}, ${JSON.stringify(client.phones)},
            ${client.address}, ${client.country}, ${client.state}, ${client.city},
            ${client.isDpiitRegistered}, ${client.dpiitNumber || ''},
            ${client.dpiitCertificate || ''}, ${client.isActive}, ${client.totalProjects || 0},
            ${new Date().toISOString()}, ${new Date().toISOString()}
          )
        `;
        console.log(`✅ Seeded client: ${client.companyName}`);
        seeded++;
      } catch (error) {
        console.log(`⚠️ Client ${client.companyName} error:`, error.message);
      }
    }

    console.log(`✅ Clients seeding completed: ${seeded}/${count} successful`);
    return { success: true, seeded, total: count };
  } catch (error) {
    console.error('❌ Error seeding clients:', error);
    return { success: false, error: error.message };
  }
};

export const seedSubAdmins = async (count = 3) => {
  try {
    console.log(`🔄 Seeding ${count} sub-admins...`);
    const subAdmins = generateSubAdmins(count);
    let seeded = 0;

    for (const subAdmin of subAdmins) {
      try {
        // Check if sub-admin already exists
        const existing = await sql`
          SELECT id FROM "subAdmins" WHERE email = ${subAdmin.email}
        `;

        if (existing.length === 0) {
          await sql`
            INSERT INTO "subAdmins" (
              name, email, phone, role, permissions, "isActive", "createdAt", "updatedAt"
            ) VALUES (
              ${subAdmin.name}, ${subAdmin.email}, ${subAdmin.phone},
              ${subAdmin.role}, ${JSON.stringify(subAdmin.permissions)}, ${subAdmin.isActive},
              ${new Date().toISOString()}, ${new Date().toISOString()}
            )
          `;
          console.log(`✅ Seeded sub-admin: ${subAdmin.name}`);
          seeded++;
        } else {
          console.log(`⚠️ Sub-admin ${subAdmin.name} already exists`);
        }
      } catch (error) {
        console.log(`⚠️ Sub-admin ${subAdmin.name} error:`, error.message);
      }
    }

    console.log(`✅ Sub-admins seeding completed: ${seeded}/${count} successful`);
    return { success: true, seeded, total: count };
  } catch (error) {
    console.error('❌ Error seeding sub-admins:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get current data counts
 */
export const getDataCounts = async () => {
  try {
    const counts = {};

    // Get counts from each table
    try {
      const usersResult = await sql`SELECT COUNT(*) as count FROM users`;
      counts.users = parseInt(usersResult[0].count);
    } catch (e) { counts.users = 0; }

    try {
      const customersResult = await sql`SELECT COUNT(*) as count FROM customers`;
      counts.customers = parseInt(customersResult[0].count);
    } catch (e) { counts.customers = 0; }

    try {
      const vendorsResult = await sql`SELECT COUNT(*) as count FROM vendors`;
      counts.vendors = parseInt(vendorsResult[0].count);
    } catch (e) { counts.vendors = 0; }

    try {
      const clientsResult = await sql`SELECT COUNT(*) as count FROM clients`;
      counts.clients = parseInt(clientsResult[0].count);
    } catch (e) { counts.clients = 0; }

    try {
      const subAdminsResult = await sql`SELECT COUNT(*) as count FROM "subAdmins"`;
      counts.subAdmins = parseInt(subAdminsResult[0].count);
    } catch (e) { counts.subAdmins = 0; }

    try {
      const ordersResult = await sql`SELECT COUNT(*) as count FROM orders`;
      counts.orders = parseInt(ordersResult[0].count);
    } catch (e) { counts.orders = 0; }

    counts.total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    return { success: true, data: counts };
  } catch (error) {
    console.error('❌ Error getting data counts:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Comprehensive seeding
 */
export const seedAllData = async () => {
  try {
    console.log('🚀 Starting comprehensive Prisma seeding...\n');
    
    const initialCounts = await getDataCounts();
    console.log('📊 Initial counts:', initialCounts.data);
    
    const results = {
      clients: await seedClients(5),
      subAdmins: await seedSubAdmins(3)
    };
    
    const finalCounts = await getDataCounts();
    console.log('\n📊 Final counts:', finalCounts.data);
    
    const totalAdded = finalCounts.data.total - initialCounts.data.total;
    console.log(`\n🎉 Comprehensive seeding completed! Added ${totalAdded} total records.`);
    
    return {
      success: true,
      results,
      initialCounts: initialCounts.data,
      finalCounts: finalCounts.data,
      totalAdded
    };
  } catch (error) {
    console.error('❌ Comprehensive seeding failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if seeding is needed
 */
export const checkSeedingNeeded = async () => {
  try {
    const counts = await getDataCounts();
    if (!counts.success) {
      return { success: false, error: counts.error };
    }
    
    const { data } = counts;
    const needsSeeding = data.clients < 10 || data.subAdmins < 5;
    
    const recommendations = [];
    if (data.clients < 10) recommendations.push('Add more clients');
    if (data.subAdmins < 5) recommendations.push('Add more sub-admins');
    
    return {
      success: true,
      needsSeeding,
      currentCounts: data,
      recommendations,
      message: needsSeeding ? 'Database needs more sample data' : 'Database has sufficient data'
    };
  } catch (error) {
    console.error('❌ Error checking seeding needs:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Smart seeding - only seed what's needed
 */
export const smartSeed = async () => {
  try {
    console.log('🧠 Starting smart seeding...');
    
    const check = await checkSeedingNeeded();
    if (!check.success) {
      return { success: false, error: check.error };
    }
    
    if (!check.needsSeeding) {
      return {
        success: true,
        message: 'No seeding needed - database has sufficient data',
        skipped: true,
        currentCounts: check.currentCounts
      };
    }
    
    const results = {};
    
    if (check.currentCounts.clients < 10) {
      results.clients = await seedClients(5);
    }
    
    if (check.currentCounts.subAdmins < 5) {
      results.subAdmins = await seedSubAdmins(3);
    }
    
    const successCount = Object.values(results).filter(r => r.success).length;
    const totalCount = Object.keys(results).length;
    
    return {
      success: successCount === totalCount,
      message: `Smart seeding completed: ${successCount}/${totalCount} categories seeded`,
      results,
      seededCategories: Object.keys(results)
    };
  } catch (error) {
    console.error('❌ Smart seeding failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Clear recent seeded data (for testing)
 */
export const clearRecentData = async () => {
  try {
    console.log('🧹 Clearing recent seeded data...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const deletedClientsResult = await sql`
      DELETE FROM clients
      WHERE "createdAt" >= ${todayISO}
    `;

    const deletedSubAdminsResult = await sql`
      DELETE FROM "subAdmins"
      WHERE "createdAt" >= ${todayISO}
    `;

    console.log(`✅ Cleared recent data from today`);

    return {
      success: true,
      deleted: {
        clients: 'cleared',
        subAdmins: 'cleared'
      }
    };
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    return { success: false, error: error.message };
  }
};
