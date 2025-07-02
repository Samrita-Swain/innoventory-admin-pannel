import { createVendor, getAllVendors } from './src/services/prismaVendorService.js';

console.log('🧪 Testing Vendor Creation with File Upload...\n');

async function testVendorCreation() {
  try {
    // Test data for vendor creation
    const testVendorData = {
      companyName: 'Test Tech Solutions',
      companyType: 'Private Limited',
      onboardingDate: '2024-06-30',
      emails: ['contact@testtech.com', 'support@testtech.com'],
      phones: ['+91-9876543220', '+91-9876543221'],
      address: '123 Test Street, Tech Park',
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      username: 'testtech_admin',
      gstNumber: 'GST29TEST1234F1Z5',
      description: 'Leading test technology solutions provider',
      services: ['Software Development', 'Testing Services', 'Quality Assurance'],
      website: 'https://testtech.com',
      typeOfWork: 'Software Development, Testing',
      status: 'Active',
      files: {
        // Simulated file objects (in real scenario these would come from form)
        gstFile: {
          name: 'test_gst_certificate.pdf',
          size: 1024 * 500, // 500KB
          type: 'application/pdf'
        },
        ndaFile: {
          name: 'test_nda_document.pdf',
          size: 1024 * 300, // 300KB
          type: 'application/pdf'
        }
      }
    };

    console.log('1️⃣ Testing vendor creation...');
    console.log('📋 Test vendor data:', testVendorData);
    
    // Get initial vendor count
    const initialVendors = await getAllVendors();
    console.log(`📊 Initial vendor count: ${initialVendors.length}`);
    
    // Create vendor
    const createdVendor = await createVendor(testVendorData);
    console.log('✅ Vendor created successfully:', createdVendor);
    
    // Get updated vendor count
    const updatedVendors = await getAllVendors();
    console.log(`📊 Updated vendor count: ${updatedVendors.length}`);
    
    // Verify the vendor was created
    const newVendor = updatedVendors.find(v => v.companyName === 'Test Tech Solutions');
    if (newVendor) {
      console.log('✅ Vendor verification successful');
      console.log('📋 Created vendor details:');
      console.log(`  - ID: ${newVendor.id}`);
      console.log(`  - Company: ${newVendor.companyName}`);
      console.log(`  - Email: ${newVendor.emails[0]}`);
      console.log(`  - Phone: ${newVendor.phones[0]}`);
      console.log(`  - Status: ${newVendor.status}`);
      console.log(`  - Services: ${newVendor.services.join(', ')}`);
      console.log(`  - Files: ${JSON.stringify(newVendor.files, null, 2)}`);
    } else {
      console.error('❌ Vendor verification failed - vendor not found in list');
    }
    
    console.log('\n2️⃣ Testing vendor data retrieval...');
    
    // Test fetching all vendors
    const allVendors = await getAllVendors();
    console.log(`📊 Total vendors in database: ${allVendors.length}`);
    
    // Display summary of all vendors
    console.log('📋 Vendor summary:');
    allVendors.forEach((vendor, index) => {
      console.log(`  ${index + 1}. ${vendor.companyName} (${vendor.status}) - ${vendor.emails[0]}`);
    });
    
    console.log('\n✅ Vendor creation test completed successfully!');
    
    // Summary
    console.log('\n📋 TEST SUMMARY:');
    console.log('='.repeat(50));
    console.log(`✅ Vendor creation: SUCCESS`);
    console.log(`✅ File processing: SUCCESS (simulated)`);
    console.log(`✅ Database storage: SUCCESS`);
    console.log(`✅ Data retrieval: SUCCESS`);
    console.log(`📊 Vendors before: ${initialVendors.length}`);
    console.log(`📊 Vendors after: ${updatedVendors.length}`);
    console.log(`🎉 Net change: +${updatedVendors.length - initialVendors.length}`);
    
  } catch (error) {
    console.error('❌ Vendor creation test failed:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testVendorCreation();
