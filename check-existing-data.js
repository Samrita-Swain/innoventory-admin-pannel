import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkExistingData() {
  try {
    console.log('🔍 Checking existing data...\n');

    // Check users
    console.log('👥 Existing users:');
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true }
    });
    users.forEach(user => {
      console.log(`  - ${user.id}: ${user.name} (${user.email}) - ${user.role}`);
    });

    // Check customers
    console.log('\n🏢 Existing customers:');
    const customers = await prisma.customer.findMany({
      select: { id: true, email: true, name: true }
    });
    customers.forEach(customer => {
      console.log(`  - ${customer.id}: ${customer.name} (${customer.email})`);
    });

    // Check vendors
    console.log('\n🔧 Existing vendors:');
    const vendors = await prisma.vendor.findMany({
      select: { id: true, email: true, name: true, createdById: true }
    });
    vendors.forEach(vendor => {
      console.log(`  - ${vendor.id}: ${vendor.name} (${vendor.email}) - created by: ${vendor.createdById}`);
    });

    console.log('\n📊 Summary:');
    console.log(`Users: ${users.length}`);
    console.log(`Customers: ${customers.length}`);
    console.log(`Vendors: ${vendors.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkExistingData();
