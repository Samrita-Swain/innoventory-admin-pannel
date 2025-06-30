import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

// Now import the seeding API after env vars are loaded
import { SeedingAPI } from './src/services/seedingAPI.js';

console.log('🧪 Testing Data Seeding System...\n');

async function testSeeding() {
  try {
    // 1. Check initial status
    console.log('1️⃣ Checking initial database status...');
    const initialStatus = await SeedingAPI.getStatus();
    console.log('📊 Initial status:', initialStatus);
    console.log('');

    // 2. Check if seeding is needed
    console.log('2️⃣ Checking if seeding is needed...');
    const seedingCheck = await SeedingAPI.checkSeedingNeeded();
    console.log('🔍 Seeding check:', seedingCheck);
    console.log('');

    // 3. Perform smart seeding
    console.log('3️⃣ Performing smart seeding...');
    const smartSeedResult = await SeedingAPI.smartSeed();
    console.log('🧠 Smart seed result:', smartSeedResult);
    console.log('');

    // 4. Check status after seeding
    console.log('4️⃣ Checking status after seeding...');
    const finalStatus = await SeedingAPI.getStatus();
    console.log('📊 Final status:', finalStatus);
    console.log('');

    // 5. Test individual category seeding (vendors)
    console.log('5️⃣ Testing individual vendor seeding...');
    const vendorSeedResult = await SeedingAPI.seedVendorsOnly();
    console.log('🏢 Vendor seed result:', vendorSeedResult);
    console.log('');

    // 6. Final status check
    console.log('6️⃣ Final comprehensive status...');
    const comprehensiveStatus = await SeedingAPI.getStatus();
    console.log('📈 Comprehensive status:', comprehensiveStatus);

    console.log('\n✅ Seeding test completed successfully!');
    
    // Summary
    console.log('\n📋 SUMMARY:');
    console.log('='.repeat(50));
    if (initialStatus.success && finalStatus.success) {
      console.log(`📊 Vendors: ${initialStatus.data.vendors} → ${finalStatus.data.vendors}`);
      console.log(`👥 Clients: ${initialStatus.data.clients} → ${finalStatus.data.clients}`);
      console.log(`🔧 Work Types: ${initialStatus.data.typeOfWork} → ${finalStatus.data.typeOfWork}`);
      console.log(`👨‍💼 Sub Admins: ${initialStatus.data.subAdmins} → ${finalStatus.data.subAdmins}`);
      console.log(`📈 Total Records: ${initialStatus.data.total} → ${finalStatus.data.total}`);
    }
    
  } catch (error) {
    console.error('❌ Seeding test failed:', error);
    console.error('Error details:', error.message);
  }
}

// Run the test
testSeeding();
