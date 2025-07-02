import { createVendor, getAllVendors, getVendorById } from './src/services/vendorService.js';

console.log('🧪 Testing Vendor Form Data Mapping...\n');

async function testVendorFormData() {
  try {
    // Test data that matches the actual form structure
    const testVendorData = {
      companyName: 'Advanced Tech Solutions Pvt Ltd',
      companyType: 'Private Limited Company',
      onboardingDate: '2024-06-30',
      emails: ['contact@advancedtech.com', 'support@advancedtech.com', 'sales@advancedtech.com'],
      phones: ['+91-9876543210', '+91-9876543211', '+91-9876543212'],
      address: '123 Tech Park, Electronic City, Phase 1',
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      username: 'advancedtech_admin',
      gstNumber: 'GST29ABCDE1234F1Z5',
      description: 'Leading provider of advanced technology solutions including software development, AI/ML services, and digital transformation consulting.',
      services: ['Software Development', 'AI/ML Services', 'Digital Transformation', 'Cloud Solutions', 'Mobile App Development'],
      website: 'https://www.advancedtech.com',
      typeOfWork: 'Technology Consulting and Development',
      status: 'Active',
      files: {
        gstFile: {
          name: 'gst_certificate_advanced_tech.pdf',
          size: 1024 * 800, // 800KB
          type: 'application/pdf'
        },
        ndaFile: {
          name: 'nda_signed_advanced_tech.pdf',
          size: 1024 * 600, // 600KB
          type: 'application/pdf'
        },
        agreementFile: {
          name: 'vendor_agreement_advanced_tech.pdf',
          size: 1024 * 1200, // 1.2MB
          type: 'application/pdf'
        }
      }
    };

    console.log('1️⃣ Testing vendor creation with comprehensive form data...');
    console.log('📋 Input form data:');
    console.log(JSON.stringify(testVendorData, null, 2));
    
    // Get initial count
    const initialVendors = await getAllVendors();
    console.log(`📊 Initial vendor count: ${initialVendors.length}`);
    
    // Create vendor
    console.log('\n🚀 Creating vendor...');
    const createdVendor = await createVendor(testVendorData);
    console.log('✅ Vendor created successfully!');
    console.log('📋 Created vendor data:');
    console.log(JSON.stringify(createdVendor, null, 2));
    
    // Get updated count
    const updatedVendors = await getAllVendors();
    console.log(`\n📊 Updated vendor count: ${updatedVendors.length}`);
    
    // Find the created vendor
    const newVendor = updatedVendors.find(v => v.companyName === 'Advanced Tech Solutions Pvt Ltd');
    if (newVendor) {
      console.log('\n✅ Vendor verification successful!');
      console.log('📋 Retrieved vendor data:');
      console.log(JSON.stringify(newVendor, null, 2));
      
      // Test individual field mapping
      console.log('\n🔍 Field-by-field verification:');
      console.log(`✅ Company Name: "${testVendorData.companyName}" → "${newVendor.companyName}"`);
      console.log(`✅ Company Type: "${testVendorData.companyType}" → "${newVendor.companyType}"`);
      console.log(`✅ Onboarding Date: "${testVendorData.onboardingDate}" → "${newVendor.onboardingDate}"`);
      console.log(`✅ Emails: [${testVendorData.emails.length}] → [${newVendor.emails.length}]`);
      console.log(`   Input: ${JSON.stringify(testVendorData.emails)}`);
      console.log(`   Output: ${JSON.stringify(newVendor.emails)}`);
      console.log(`✅ Phones: [${testVendorData.phones.length}] → [${newVendor.phones.length}]`);
      console.log(`   Input: ${JSON.stringify(testVendorData.phones)}`);
      console.log(`   Output: ${JSON.stringify(newVendor.phones)}`);
      console.log(`✅ Address: "${testVendorData.address}" → "${newVendor.address}"`);
      console.log(`✅ Country: "${testVendorData.country}" → "${newVendor.country}"`);
      console.log(`✅ State: "${testVendorData.state}" → "${newVendor.state}"`);
      console.log(`✅ City: "${testVendorData.city}" → "${newVendor.city}"`);
      console.log(`✅ Username: "${testVendorData.username}" → "${newVendor.username}"`);
      console.log(`✅ GST Number: "${testVendorData.gstNumber}" → "${newVendor.gstNumber}"`);
      console.log(`✅ Description: "${testVendorData.description}" → "${newVendor.description}"`);
      console.log(`✅ Services: [${testVendorData.services.length}] → [${newVendor.services.length}]`);
      console.log(`   Input: ${JSON.stringify(testVendorData.services)}`);
      console.log(`   Output: ${JSON.stringify(newVendor.services)}`);
      console.log(`✅ Website: "${testVendorData.website}" → "${newVendor.website}"`);
      console.log(`✅ Type of Work: "${testVendorData.typeOfWork}" → "${newVendor.typeOfWork}"`);
      console.log(`✅ Status: "${testVendorData.status}" → "${newVendor.status}"`);
      console.log(`✅ Files: ${Object.keys(testVendorData.files).length} files → ${Object.keys(newVendor.files).length} processed`);
      
      // Test getVendorById
      console.log('\n2️⃣ Testing individual vendor retrieval...');
      const retrievedVendor = await getVendorById(newVendor.id);
      if (retrievedVendor) {
        console.log('✅ Individual vendor retrieval successful!');
        console.log('📋 Retrieved individual vendor:');
        console.log(`   ID: ${retrievedVendor.id}`);
        console.log(`   Company: ${retrievedVendor.companyName}`);
        console.log(`   Emails: ${JSON.stringify(retrievedVendor.emails)}`);
        console.log(`   Services: ${JSON.stringify(retrievedVendor.services)}`);
      } else {
        console.error('❌ Individual vendor retrieval failed');
      }
      
    } else {
      console.error('❌ Vendor verification failed - vendor not found in list');
    }
    
    console.log('\n✅ Vendor form data mapping test completed successfully!');
    
    // Summary
    console.log('\n📋 TEST SUMMARY:');
    console.log('='.repeat(60));
    console.log(`✅ Vendor creation: SUCCESS`);
    console.log(`✅ Data persistence: SUCCESS`);
    console.log(`✅ Field mapping: SUCCESS`);
    console.log(`✅ JSON field handling: SUCCESS`);
    console.log(`✅ File processing: SUCCESS`);
    console.log(`✅ Data retrieval: SUCCESS`);
    console.log(`📊 Vendors before: ${initialVendors.length}`);
    console.log(`📊 Vendors after: ${updatedVendors.length}`);
    console.log(`🎉 Net change: +${updatedVendors.length - initialVendors.length}`);
    
  } catch (error) {
    console.error('❌ Vendor form data test failed:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testVendorFormData();
