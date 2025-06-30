import { 
  seedAllData, 
  seedClients, 
  seedSubAdmins, 
  getDataCounts, 
  checkSeedingNeeded, 
  smartSeed, 
  clearRecentData 
} from './src/services/prismaSeeding.js';

console.log('🧪 Testing Prisma Seeding Service...\n');

async function testPrismaSeeding() {
  try {
    // 1. Check initial status
    console.log('1️⃣ Checking initial database status...');
    const initialStatus = await getDataCounts();
    console.log('📊 Initial status:', initialStatus.data);
    console.log('');

    // 2. Check if seeding is needed
    console.log('2️⃣ Checking if seeding is needed...');
    const seedingCheck = await checkSeedingNeeded();
    console.log('🔍 Seeding needed:', seedingCheck.needsSeeding);
    if (seedingCheck.recommendations && seedingCheck.recommendations.length > 0) {
      console.log('📝 Recommendations:');
      seedingCheck.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
    console.log('');

    // 3. Test individual category seeding
    console.log('3️⃣ Testing individual category seeding...');
    
    console.log('👥 Testing client seeding...');
    const clientResult = await seedClients(3);
    console.log(`Clients: ${clientResult.success ? '✅' : '❌'} ${clientResult.seeded || 0}/${clientResult.total || 0} seeded`);

    console.log('👨‍💼 Testing sub-admin seeding...');
    const adminResult = await seedSubAdmins(2);
    console.log(`Sub Admins: ${adminResult.success ? '✅' : '❌'} ${adminResult.seeded || 0}/${adminResult.total || 0} seeded`);
    console.log('');

    // 4. Test smart seeding
    console.log('4️⃣ Testing smart seeding...');
    const smartSeedResult = await smartSeed();
    console.log('🧠 Smart seed result:', smartSeedResult.success ? '✅ Success' : '❌ Failed');
    console.log('📋 Message:', smartSeedResult.message);
    if (smartSeedResult.seededCategories) {
      console.log('🌱 Seeded categories:', smartSeedResult.seededCategories);
    }
    console.log('');

    // 5. Test comprehensive seeding
    console.log('5️⃣ Testing comprehensive seeding...');
    const comprehensiveResult = await seedAllData();
    console.log('🌱 Comprehensive seed result:', comprehensiveResult.success ? '✅ Success' : '❌ Failed');
    if (comprehensiveResult.success) {
      console.log('📋 Total added:', comprehensiveResult.totalAdded);
    }
    console.log('');

    // 6. Check final status
    console.log('6️⃣ Checking final status...');
    const finalStatus = await getDataCounts();
    console.log('📊 Final status:', finalStatus.data);
    console.log('');

    // 7. Test data clearing
    console.log('7️⃣ Testing data clearing...');
    const clearResult = await clearRecentData();
    console.log('🧹 Clear result:', clearResult.success ? '✅ Success' : '❌ Failed');
    if (clearResult.success) {
      console.log('📋 Deleted:', clearResult.deleted);
    }
    console.log('');

    // 8. Final status after clearing
    console.log('8️⃣ Final status after clearing...');
    const ultimateStatus = await getDataCounts();
    console.log('📈 Ultimate status:', ultimateStatus.data);

    console.log('\n✅ Prisma seeding test completed successfully!');
    
    // Summary
    console.log('\n📋 PRISMA SEEDING SUMMARY:');
    console.log('='.repeat(60));
    if (initialStatus.success && ultimateStatus.success) {
      console.log(`👥 Users: ${initialStatus.data.users} → ${ultimateStatus.data.users}`);
      console.log(`🏢 Customers: ${initialStatus.data.customers} → ${ultimateStatus.data.customers}`);
      console.log(`🔧 Vendors: ${initialStatus.data.vendors} → ${ultimateStatus.data.vendors}`);
      console.log(`👥 Clients: ${initialStatus.data.clients} → ${ultimateStatus.data.clients}`);
      console.log(`👨‍💼 Sub Admins: ${initialStatus.data.subAdmins} → ${ultimateStatus.data.subAdmins}`);
      console.log(`📋 Orders: ${initialStatus.data.orders} → ${ultimateStatus.data.orders}`);
      console.log(`📈 Total Records: ${initialStatus.data.total} → ${ultimateStatus.data.total}`);
      
      const netChange = ultimateStatus.data.total - initialStatus.data.total;
      console.log(`🎉 Net change: ${netChange > 0 ? '+' : ''}${netChange} records`);
    }
    
  } catch (error) {
    console.error('❌ Prisma seeding test failed:', error);
    console.error('Error details:', error.message);
  }
}

// Run the test
testPrismaSeeding();
