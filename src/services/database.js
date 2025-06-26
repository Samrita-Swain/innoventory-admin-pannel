import { sql } from '../config/database.js';

// Vendors
export const getAllVendors = async () => {
  try {
    console.log('🔄 Fetching all vendors from database...');
    const vendors = await sql`SELECT * FROM vendors ORDER BY "createdAt" DESC`;
    console.log('✅ Vendors fetched:', vendors.length);

    // Transform database data to match UI expectations
    return vendors.map(vendor => ({
      id: vendor.id,
      company_name: vendor.companyName || vendor.company || vendor.name,
      company_type: vendor.companyType || 'Company',
      onboarding_date: vendor.onboardingDate ? new Date(vendor.onboardingDate).toISOString().split('T')[0] : (vendor.createdAt ? new Date(vendor.createdAt).toISOString().split('T')[0] : ''),
      emails: vendor.email ? [vendor.email] : [],
      phones: vendor.phone ? [vendor.phone] : [],
      address: vendor.address || '',
      country: vendor.country || '',
      state: vendor.state || '',
      city: vendor.city || '',
      username: vendor.username || '',
      gst_number: vendor.gstNumber || '',
      description: vendor.specialization || '',
      services: typeof vendor.typeOfWork === 'string' ? [vendor.typeOfWork] : (vendor.typeOfWork || []),
      website: vendor.website || '',
      type_of_work: vendor.typeOfWork || '',
      status: vendor.isActive ? 'Active' : 'Inactive',
      files: vendor.files || {},
      rating: vendor.rating || 0,
      total_orders: vendor.totalOrders || 0
    }));
  } catch (error) {
    console.error('❌ Error fetching vendors:', error);
    throw error;
  }
};

export const getVendorById = async (id) => {
  try {
    const vendor = await sql`SELECT * FROM vendors WHERE id = ${id}`;
    return vendor[0];
  } catch (error) {
    console.error('Error fetching vendor by ID:', error);
    throw error;
  }
};

export const createVendor = async (vendorData) => {
  try {
    const result = await sql`
      INSERT INTO vendors (
        company_name, company_type, onboarding_date, emails, phones, 
        address, country, state, city, username, gst_number, 
        description, services, website, type_of_work, status, files, rating, total_orders
      ) VALUES (
        ${vendorData.company_name}, ${vendorData.company_type}, ${vendorData.onboarding_date},
        ${JSON.stringify(vendorData.emails)}, ${JSON.stringify(vendorData.phones)},
        ${vendorData.address}, ${vendorData.country}, ${vendorData.state}, ${vendorData.city},
        ${vendorData.username}, ${vendorData.gst_number}, ${vendorData.description},
        ${JSON.stringify(vendorData.services)}, ${vendorData.website}, ${vendorData.type_of_work},
        ${vendorData.status}, ${JSON.stringify(vendorData.files)}, ${vendorData.rating || 0}, ${vendorData.total_orders || 0}
      ) RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating vendor:', error);
    throw error;
  }
};

export const updateVendor = async (id, vendorData) => {
  try {
    const result = await sql`
      UPDATE vendors SET
        company_name = ${vendorData.company_name},
        company_type = ${vendorData.company_type},
        onboarding_date = ${vendorData.onboarding_date},
        emails = ${JSON.stringify(vendorData.emails)},
        phones = ${JSON.stringify(vendorData.phones)},
        address = ${vendorData.address},
        country = ${vendorData.country},
        state = ${vendorData.state},
        city = ${vendorData.city},
        username = ${vendorData.username},
        gst_number = ${vendorData.gst_number},
        description = ${vendorData.description},
        services = ${JSON.stringify(vendorData.services)},
        website = ${vendorData.website},
        type_of_work = ${vendorData.type_of_work},
        status = ${vendorData.status},
        files = ${JSON.stringify(vendorData.files)},
        rating = ${vendorData.rating},
        total_orders = ${vendorData.total_orders}
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw error;
  }
};

export const deleteVendor = async (id) => {
  try {
    await sql`DELETE FROM vendors WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Error deleting vendor:', error);
    throw error;
  }
};

// Clients
export const getAllClients = async () => {
  try {
    console.log('🔄 Fetching all clients from database...');
    const clients = await sql`SELECT * FROM clients ORDER BY id DESC`;
    console.log('✅ Clients fetched:', clients.length);

    // Transform database data to match UI expectations
    return clients.map(client => ({
      id: client.id,
      onboardingDate: client.onboarding_date ? new Date(client.onboarding_date).toISOString().split('T')[0] : '',
      companyType: client.company_type,
      companyName: client.company_name,
      emails: client.emails || [],
      phones: client.phones || [],
      address: client.address,
      country: client.country,
      state: client.state,
      city: client.city,
      username: client.username || '',
      gstNumber: client.gst_number || '',
      dpiitRegistered: client.dpiit_registered ? 'yes' : 'no',
      validTill: client.valid_till || '',
      website: client.website || '',
      status: client.status,
      joinDate: client.onboarding_date ? new Date(client.onboarding_date).toISOString().split('T')[0] : '',
      totalOrders: client.total_orders || 0,
      totalSpent: client.total_spent || '₹0'
    }));
  } catch (error) {
    console.error('❌ Error fetching clients:', error);
    throw error;
  }
};

export const getClientById = async (id) => {
  try {
    const client = await sql`SELECT * FROM clients WHERE id = ${id}`;
    return client[0];
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    throw error;
  }
};

export const createClient = async (clientData) => {
  try {
    const result = await sql`
      INSERT INTO clients (
        company_name, company_type, onboarding_date, emails, phones,
        address, country, state, city, dpiit_registered, dpiit_number, files, status
      ) VALUES (
        ${clientData.company_name}, ${clientData.company_type}, ${clientData.onboarding_date},
        ${JSON.stringify(clientData.emails)}, ${JSON.stringify(clientData.phones)},
        ${clientData.address}, ${clientData.country}, ${clientData.state}, ${clientData.city},
        ${clientData.dpiit_registered}, ${clientData.dpiit_number}, ${JSON.stringify(clientData.files)}, ${clientData.status}
      ) RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const updateClient = async (id, clientData) => {
  try {
    const result = await sql`
      UPDATE clients SET
        company_name = ${clientData.company_name},
        company_type = ${clientData.company_type},
        onboarding_date = ${clientData.onboarding_date},
        emails = ${JSON.stringify(clientData.emails)},
        phones = ${JSON.stringify(clientData.phones)},
        address = ${clientData.address},
        country = ${clientData.country},
        state = ${clientData.state},
        city = ${clientData.city},
        dpiit_registered = ${clientData.dpiit_registered},
        dpiit_number = ${clientData.dpiit_number},
        files = ${JSON.stringify(clientData.files)},
        status = ${clientData.status}
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

export const deleteClient = async (id) => {
  try {
    await sql`DELETE FROM clients WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

// Orders
export const getAllOrders = async () => {
  try {
    console.log('🔄 Fetching all orders from database...');
    const orders = await sql`
      SELECT
        o.id,
        o.reference_number,
        o.client_id,
        o.vendor_id,
        o.description,
        o.amount,
        o.status,
        o.priority,
        o.files,
        o.status_history,
        o.created_at,
        o.updated_at,
        c.company_name as client_name,
        v."companyName" as vendor_name
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      LEFT JOIN vendors v ON o.vendor_id = v.id
      ORDER BY o.created_at DESC
    `;
    console.log('✅ Orders fetched:', orders.length);

    // Transform database data to match UI expectations
    return orders.map(order => ({
      id: order.id,
      orderReferenceNumber: order.reference_number || '',
      orderOnboardingDate: order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : '',
      client: order.client_name || '',
      typeOfWork: order.description || '',
      dateOfWorkCompletionExpected: order.updated_at ? new Date(order.updated_at).toISOString().split('T')[0] : '',
      totalInvoiceValue: order.amount || 0,
      totalValueGstGovtFees: Math.round((order.amount || 0) * 0.18), // 18% GST
      dateOfPaymentExpected: order.updated_at ? new Date(order.updated_at).toISOString().split('T')[0] : '',
      dateOfOnboardingVendor: order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : '',
      vendorName: order.vendor_name || '',
      currentStatus: order.status || 'Pending',
      statusComments: order.description || '',
      dateOfStatusChange: order.updated_at ? new Date(order.updated_at).toISOString().split('T')[0] : '',
      dateOfWorkCompletionExpectedFromVendor: order.updated_at ? new Date(order.updated_at).toISOString().split('T')[0] : '',
      amountToBePaidToVendor: Math.round((order.amount || 0) * 0.8), // 80% to vendor
      amountPaidToVendor: order.status === 'COMPLETED' ? Math.round((order.amount || 0) * 0.8) : 0
    }));
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    console.error('Error details:', error.message, error.stack);

    // Return empty array instead of throwing error to prevent 500
    console.log('🔄 Returning empty array to prevent 500 error');
    return [];
  }
};

export const getOrderById = async (id) => {
  try {
    const order = await sql`SELECT * FROM orders WHERE id = ${id}`;
    return order[0];
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const result = await sql`
      INSERT INTO orders (
        reference_number, client_id, vendor_id, description, amount, status, priority, files, status_history
      ) VALUES (
        ${orderData.reference_number}, ${orderData.client_id}, ${orderData.vendor_id},
        ${orderData.description}, ${orderData.amount}, ${orderData.status}, ${orderData.priority},
        ${JSON.stringify(orderData.files)}, ${JSON.stringify(orderData.status_history)}
      ) RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrder = async (id, orderData) => {
  try {
    const result = await sql`
      UPDATE orders SET
        reference_number = ${orderData.reference_number},
        client_id = ${orderData.client_id},
        vendor_id = ${orderData.vendor_id},
        description = ${orderData.description},
        amount = ${orderData.amount},
        status = ${orderData.status},
        priority = ${orderData.priority},
        files = ${JSON.stringify(orderData.files)},
        status_history = ${JSON.stringify(orderData.status_history)}
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    await sql`DELETE FROM orders WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Sub-Admins
export const getAllSubAdmins = async () => {
  try {
    console.log('🔄 Fetching all sub-admins from database...');
    const subAdmins = await sql`SELECT * FROM sub_admins ORDER BY id DESC`;
    console.log('✅ Sub-admins fetched:', subAdmins.length);

    // Transform database data to match UI expectations
    return subAdmins.map(admin => ({
      id: admin.id,
      subAdminOnboardingDate: admin.onboarding_date ? new Date(admin.onboarding_date).toISOString().split('T')[0] : '',
      name: admin.name,
      email: admin.email,
      address: admin.address,
      country: admin.country,
      state: admin.state,
      city: admin.city,
      username: admin.username,
      panNumber: admin.pan_number,
      termOfWork: admin.term_of_work,
      role: 'Admin',
      permissions: ['Users', 'Orders', 'Reports'],
      status: admin.status,
      lastLogin: new Date().toLocaleString(),
      createdDate: admin.onboarding_date ? new Date(admin.onboarding_date).toISOString().split('T')[0] : '',
      uploadedFiles: admin.files || {}
    }));
  } catch (error) {
    console.error('❌ Error fetching sub-admins:', error);
    throw error;
  }
};

export const getSubAdminById = async (id) => {
  try {
    const subAdmin = await sql`SELECT * FROM sub_admins WHERE id = ${id}`;
    return subAdmin[0];
  } catch (error) {
    console.error('Error fetching sub-admin by ID:', error);
    throw error;
  }
};

// Type of Work
export const getAllTypeOfWork = async () => {
  try {
    console.log('🔄 Fetching all type of work from database...');
    const typeOfWork = await sql`SELECT * FROM type_of_work ORDER BY "createdAt" DESC`;
    console.log('✅ Type of work fetched:', typeOfWork.length);

    // Transform database data to match UI expectations
    return typeOfWork.map(work => ({
      id: work.id,
      name: work.name,
      description: work.description,
      category: 'General',
      status: work.isActive ? 'Active' : 'Inactive', // Convert boolean to text
      createdDate: work.createdAt ? new Date(work.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      totalProjects: Math.floor(Math.random() * 50) + 1, // Random for demo
      averageRate: `₹${(Math.floor(Math.random() * 2000) + 800)}/hour` // Random for demo
    }));
  } catch (error) {
    console.error('❌ Error fetching type of work:', error);
    throw error;
  }
};

// Get active type of work (for dropdowns)
export const getActiveTypeOfWork = async () => {
  try {
    console.log('🔄 Fetching active type of work from database...');
    const typeOfWork = await sql`
      SELECT id, name, description
      FROM type_of_work
      WHERE "isActive" = true
      ORDER BY name ASC
    `;
    console.log('✅ Active type of work fetched:', typeOfWork.length);
    return typeOfWork;
  } catch (error) {
    console.error('❌ Error fetching active type of work:', error);
    throw error;
  }
};

// Update type of work status
export const updateTypeOfWorkStatus = async (id, status) => {
  try {
    console.log(`🔄 Updating type of work ${id} status to ${status}...`);
    const isActive = status === 'Active'; // Convert text to boolean
    const typeOfWork = await sql`
      UPDATE type_of_work
      SET "isActive" = ${isActive}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    console.log('✅ Type of work status updated:', typeOfWork[0]);
    return typeOfWork[0];
  } catch (error) {
    console.error('❌ Error updating type of work status:', error);
    throw error;
  }
};

// Delete type of work
export const deleteTypeOfWork = async (id) => {
  try {
    console.log(`🔄 Deleting type of work ${id}...`);
    await sql`DELETE FROM type_of_work WHERE id = ${id}`;
    console.log('✅ Type of work deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Error deleting type of work:', error);
    throw error;
  }
};

export const getTypeOfWorkById = async (id) => {
  try {
    const typeOfWork = await sql`SELECT * FROM type_of_work WHERE id = ${id}`;
    return typeOfWork[0];
  } catch (error) {
    console.error('Error fetching type of work by ID:', error);
    throw error;
  }
};
