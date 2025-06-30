import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

// Now import the seeding API after env vars are loaded
import { SeedingAPI } from './src/services/seedingAPI.js';

console.log('🚀 Comprehensive Seeding Test...\n');

async function testComprehensiveSeeding() {
  try {
    // 1. Check initial status
    console.log('1️⃣ Checking initial database status...');
    const initialStatus = await SeedingAPI.getStatus();
    console.log('📊 Initial status:', initialStatus.data);
    console.log('');

    // 2. Check if seeding is needed
    console.log('2️⃣ Checking if seeding is needed...');
    const seedingCheck = await SeedingAPI.checkSeedingNeeded();
    console.log('🔍 Seeding needed:', seedingCheck.needsSeeding);
    if (seedingCheck.recommendations && seedingCheck.recommendations.length > 0) {
      console.log('📝 Recommendations:');
      seedingCheck.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
    console.log('');

    // 3. Perform smart seeding
    console.log('3️⃣ Performing smart seeding...');
    const smartSeedResult = await SeedingAPI.smartSeed();
    console.log('🧠 Smart seed result:', smartSeedResult.success ? '✅ Success' : '❌ Failed');
    console.log('📋 Message:', smartSeedResult.message);
    if (smartSeedResult.seededCategories) {
      console.log('🌱 Seeded categories:', smartSeedResult.seededCategories);
    }
    console.log('');

    // 4. Test individual category seeding
    console.log('4️⃣ Testing individual category seeding...');
    
    console.log('🏢 Testing vendor seeding...');
    const vendorResult = await SeedingAPI.seedVendorsOnly();
    console.log(`Vendors: ${vendorResult.success ? '✅' : '❌'} ${vendorResult.message}`);

    console.log('👥 Testing client seeding...');
    const clientResult = await SeedingAPI.seedClientsOnly();
    console.log(`Clients: ${clientResult.success ? '✅' : '❌'} ${clientResult.message}`);

    console.log('🔧 Testing type of work seeding...');
    const workResult = await SeedingAPI.seedTypeOfWorkOnly();
    console.log(`Work Types: ${workResult.success ? '✅' : '❌'} ${workResult.message}`);

    console.log('👨‍💼 Testing sub-admin seeding...');
    const adminResult = await SeedingAPI.seedSubAdminsOnly();
    console.log(`Sub Admins: ${adminResult.success ? '✅' : '❌'} ${adminResult.message}`);

    console.log('📋 Testing order seeding...');
    const orderResult = await SeedingAPI.seedOrdersOnly();
    console.log(`Orders: ${orderResult.success ? '✅' : '❌'} ${orderResult.message}`);
    console.log('');

    // 5. Check final status
    console.log('5️⃣ Checking final status...');
    const finalStatus = await SeedingAPI.getStatus();
    console.log('📊 Final status:', finalStatus.data);
    console.log('');

    // 6. Test comprehensive seeding
    console.log('6️⃣ Testing comprehensive seeding...');
    const comprehensiveResult = await SeedingAPI.seedAll();
    console.log('🌱 Comprehensive seed result:', comprehensiveResult.success ? '✅ Success' : '❌ Failed');
    console.log('📋 Message:', comprehensiveResult.message);
    console.log('');

    // 7. Final status after comprehensive seeding
    console.log('7️⃣ Final comprehensive status...');
    const ultimateStatus = await SeedingAPI.getStatus();
    console.log('📈 Ultimate status:', ultimateStatus.data);

    console.log('\n✅ Comprehensive seeding test completed successfully!');
    
    // Summary
    console.log('\n📋 COMPREHENSIVE SUMMARY:');
    console.log('='.repeat(60));
    if (initialStatus.success && ultimateStatus.success) {
      console.log(`📊 Vendors: ${initialStatus.data.vendors} → ${ultimateStatus.data.vendors}`);
      console.log(`👥 Clients: ${initialStatus.data.clients} → ${ultimateStatus.data.clients}`);
      console.log(`🔧 Work Types: ${initialStatus.data.typeOfWork} → ${ultimateStatus.data.typeOfWork}`);
      console.log(`👨‍💼 Sub Admins: ${initialStatus.data.subAdmins} → ${ultimateStatus.data.subAdmins}`);
      console.log(`📋 Orders: ${initialStatus.data.orders} → ${ultimateStatus.data.orders}`);
      console.log(`📈 Total Records: ${initialStatus.data.total} → ${ultimateStatus.data.total}`);
      
      const totalAdded = ultimateStatus.data.total - initialStatus.data.total;
      console.log(`🎉 Total records added: ${totalAdded}`);
    }
    
  } catch (error) {
    console.error('❌ Comprehensive seeding test failed:', error);
    console.error('Error details:', error.message);
  }
}

// Run the comprehensive test
testComprehensiveSeeding();
