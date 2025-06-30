import { sql } from '../config/database.js';

// Get all vendors
export const getAllVendors = async () => {
  try {
    const vendors = await sql`
      SELECT
        id,
        company_name,
        company_type,
        onboarding_date,
        emails,
        phones,
        address,
        country,
        state,
        city,
        username,
        gst_number,
        description,
        services,
        website,
        type_of_work,
        status,
        files,
        rating,
        total_orders,
        created_at,
        updated_at
      FROM vendors
      ORDER BY created_at DESC
    `;

    // Transform data to match UI expectations and format dates
    return vendors.map(vendor => ({
      ...vendor,
      // Ensure emails and phones are arrays
      emails: Array.isArray(vendor.emails) ? vendor.emails : (vendor.emails ? [vendor.emails] : []),
      phones: Array.isArray(vendor.phones) ? vendor.phones : (vendor.phones ? [vendor.phones] : []),
      // Add camelCase versions for compatibility
      totalOrders: vendor.total_orders || 0,
      onboardingDate: vendor.onboarding_date ? new Date(vendor.onboarding_date).toISOString().split('T')[0] : '',
      // Format dates to strings to prevent React errors
      createdAt: vendor.created_at ? new Date(vendor.created_at).toISOString().split('T')[0] : '',
      updatedAt: vendor.updated_at ? new Date(vendor.updated_at).toISOString().split('T')[0] : ''
    }));
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

// Demo vendors fallback data
const demoVendors = [
  {
    id: 'demo-1',
    company_name: 'TechCorp Solutions',
    companyName: 'TechCorp Solutions',
    company_type: 'Pvt. Company',
    companyType: 'Pvt. Company',
    onboarding_date: '2024-01-15',
    onboardingDate: '2024-01-15',
    emails: ['contact@techcorp.com'],
    email: 'contact@techcorp.com',
    phones: ['+91-9876543210'],
    phone: '+91-9876543210',
    address: '123 Tech Street, Bangalore',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
    username: 'techcorp_admin',
    gstNumber: 'GST29ABCDE1234F1Z5',
    gst_number: 'GST29ABCDE1234F1Z5',
    specialization: 'Leading technology solutions provider',
    description: 'Leading technology solutions provider',
    typeOfWork: 'Technology Services',
    type_of_work: 'Technology Services',
    website: 'https://techcorp.com',
    isActive: true,
    rating: 4.8,
    totalOrders: 25,
    total_orders: 25,
    services: ['Software Development', 'IT Consulting'],
    files: {},
    status: 'Active',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'demo-2',
    company_name: 'Global Supplies Inc',
    companyName: 'Global Supplies Inc',
    company_type: 'MSME',
    companyType: 'MSME',
    onboarding_date: '2024-02-20',
    onboardingDate: '2024-02-20',
    emails: ['info@globalsupplies.com'],
    email: 'info@globalsupplies.com',
    phones: ['+91-8765432109'],
    phone: '+91-8765432109',
    address: '456 Supply Chain Ave, Mumbai',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    username: 'global_supplies',
    gstNumber: 'GST27FGHIJ5678K2L9',
    gst_number: 'GST27FGHIJ5678K2L9',
    specialization: 'Office supplies and equipment distribution',
    description: 'Office supplies and equipment distribution',
    typeOfWork: 'Office Supplies',
    type_of_work: 'Office Supplies',
    website: 'https://globalsupplies.com',
    isActive: true,
    rating: 4.2,
    totalOrders: 18,
    total_orders: 18,
    services: ['Office Supplies', 'Equipment Distribution'],
    files: {},
    status: 'Active',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z'
  },
  {
    id: 'demo-vendor-1',
    company_name: 'TechCorp Solutions',
    companyName: 'TechCorp Solutions',
    company_type: 'Pvt. Company',
    companyType: 'Pvt. Company',
    onboarding_date: '2024-01-15',
    onboardingDate: '2024-01-15',
    emails: ['contact@techcorp.com'],
    email: 'contact@techcorp.com',
    phones: ['+91-9876543210'],
    phone: '+91-9876543210',
    address: 'Tech Park, Whitefield, Bangalore',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
    username: 'techcorp_admin',
    gstNumber: '29ABCDE1234F1Z5',
    gst_number: '29ABCDE1234F1Z5',
    specialization: 'Software Development and IT Services',
    description: 'Software Development and IT Services',
    typeOfWork: 'Technology Services',
    type_of_work: 'Technology Services',
    website: 'https://techcorp.com',
    isActive: true,
    rating: 4.8,
    totalOrders: 25,
    total_orders: 25,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'demo-vendor-2',
    company_name: 'Global Supplies Inc',
    companyName: 'Global Supplies Inc',
    company_type: 'MSME',
    companyType: 'MSME',
    onboarding_date: '2024-02-20',
    onboardingDate: '2024-02-20',
    emails: ['info@globalsupplies.com'],
    email: 'info@globalsupplies.com',
    phones: ['+91-8765432109'],
    phone: '+91-8765432109',
    address: 'Industrial Area, Andheri, Mumbai',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    username: 'global_supplies',
    gstNumber: '27FGHIJ5678K2L9',
    gst_number: '27FGHIJ5678K2L9',
    specialization: 'Office supplies and equipment distribution',
    description: 'Office supplies and equipment distribution',
    typeOfWork: 'Office Supplies',
    type_of_work: 'Office Supplies',
    website: 'https://globalsupplies.com',
    isActive: true,
    rating: 4.2,
    totalOrders: 18,
    total_orders: 18,
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z'
  }
];

// Get vendor by ID
export const getVendorById = async (id) => {
  try {
    // First try to get from database
    const vendor = await sql`
      SELECT
        id,
        company_name,
        company_type,
        onboarding_date,
        emails,
        phones,
        address,
        country,
        state,
        city,
        username,
        gst_number,
        description,
        services,
        website,
        type_of_work,
        status,
        files,
        rating,
        total_orders,
        created_at,
        updated_at
      FROM vendors
      WHERE id = ${id}
    `;

    const vendorData = vendor[0];

    // If found in database, return it
    if (vendorData) {
      console.log('✅ Vendor found in database:', vendorData);
      return vendorData;
    }

    // If not found in database, check demo data
    const demoVendor = demoVendors.find(v => v.id === id);
    if (demoVendor) {
      console.log('✅ Vendor found in demo data:', demoVendor);
      return demoVendor;
    }

    console.log('❌ Vendor not found:', id);
    return null;
  } catch (error) {
    console.error('Error fetching vendor by ID:', error);

    // Fallback to demo data if database error
    const demoVendor = demoVendors.find(v => v.id === id);
    if (demoVendor) {
      console.log('✅ Using demo vendor as fallback:', demoVendor);
      return demoVendor;
    }

    throw error;
  }
};

// Create new vendor
export const createVendor = async (vendorData) => {
  try {
    const {
      companyName,
      companyType,
      onboardingDate,
      emails,
      phones,
      address,
      country,
      state,
      city,
      username,
      gstNumber,
      description,
      services,
      website,
      typeOfWork,
      status = 'Pending',
      files = {}
    } = vendorData;

    const vendor = await sql`
      INSERT INTO vendors (
        company_name,
        company_type,
        onboarding_date,
        emails,
        phones,
        address,
        country,
        state,
        city,
        username,
        gst_number,
        description,
        services,
        website,
        type_of_work,
        status,
        files,
        rating,
        total_orders
      ) VALUES (
        ${companyName},
        ${companyType},
        ${onboardingDate},
        ${JSON.stringify(emails)},
        ${JSON.stringify(phones)},
        ${address},
        ${country},
        ${state},
        ${city},
        ${username},
        ${gstNumber},
        ${description},
        ${JSON.stringify(services || [])},
        ${website || ''},
        ${typeOfWork || ''},
        ${status || 'Pending'},
        ${JSON.stringify(files || {})},
        ${0.0},
        ${0}
      )
      RETURNING *
    `;
    return vendor[0];
  } catch (error) {
    console.error('Error creating vendor:', error);
    throw error;
  }
};

// Update vendor
export const updateVendor = async (id, vendorData) => {
  try {


    // Build update object with only the fields that exist in the database
    const updateObj = {};

    if (vendorData.companyName !== undefined) {
      updateObj.name = vendorData.companyName;
      updateObj.company = vendorData.companyName;
      updateObj.companyName = vendorData.companyName;
    }

    if (vendorData.companyType !== undefined) {
      updateObj.companyType = vendorData.companyType;
    }

    if (vendorData.onboardingDate !== undefined) {
      updateObj.onboardingDate = vendorData.onboardingDate;
    }

    if (vendorData.emails !== undefined && Array.isArray(vendorData.emails)) {
      updateObj.email = vendorData.emails[0] || '';
    } else if (vendorData.email !== undefined) {
      updateObj.email = vendorData.email;
    }

    if (vendorData.phones !== undefined && Array.isArray(vendorData.phones)) {
      updateObj.phone = vendorData.phones[0] || '';
    } else if (vendorData.phone !== undefined) {
      updateObj.phone = vendorData.phone;
    }

    if (vendorData.address !== undefined) {
      updateObj.address = vendorData.address;
    }

    if (vendorData.country !== undefined) {
      updateObj.country = vendorData.country;
    }

    if (vendorData.state !== undefined) {
      updateObj.state = vendorData.state;
    }

    if (vendorData.city !== undefined) {
      updateObj.city = vendorData.city;
    }

    if (vendorData.username !== undefined) {
      updateObj.username = vendorData.username;
    }

    if (vendorData.gstNumber !== undefined) {
      updateObj.gstNumber = vendorData.gstNumber;
    }

    if (vendorData.rating !== undefined) {
      updateObj.rating = vendorData.rating;
    }

    if (vendorData.typeOfWork !== undefined) {
      updateObj.specialization = vendorData.typeOfWork;
    }

    if (vendorData.status !== undefined) {
      updateObj.isActive = vendorData.status === 'Active';
    } else if (vendorData.isActive !== undefined) {
      updateObj.isActive = vendorData.isActive;
    }

    // Always update the updatedAt field
    updateObj.updatedAt = new Date();

    // Check if we have any fields to update
    if (Object.keys(updateObj).length === 1) { // Only updatedAt
      return await getVendorById(id);
    }

    // Perform the update using a simple approach
    const vendor = await sql`
      UPDATE vendors SET
        company_name = ${updateObj.companyName || sql`company_name`},
        company_type = ${updateObj.companyType || sql`company_type`},
        onboarding_date = ${updateObj.onboardingDate || sql`onboarding_date`},
        emails = ${updateObj.emails ? JSON.stringify(updateObj.emails) : sql`emails`},
        phones = ${updateObj.phones ? JSON.stringify(updateObj.phones) : sql`phones`},
        address = ${updateObj.address || sql`address`},
        country = ${updateObj.country || sql`country`},
        state = ${updateObj.state || sql`state`},
        city = ${updateObj.city || sql`city`},
        username = ${updateObj.username || sql`username`},
        gst_number = ${updateObj.gstNumber || sql`gst_number`},
        description = ${updateObj.description || sql`description`},
        services = ${updateObj.services ? JSON.stringify(updateObj.services) : sql`services`},
        website = ${updateObj.website || sql`website`},
        type_of_work = ${updateObj.typeOfWork || sql`type_of_work`},
        status = ${updateObj.status || sql`status`},
        files = ${updateObj.files ? JSON.stringify(updateObj.files) : sql`files`},
        rating = ${updateObj.rating || sql`rating`},
        total_orders = ${updateObj.totalOrders || sql`total_orders`},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!vendor || vendor.length === 0) {
      return await getVendorById(id);
    }

    return vendor[0];
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw error;
  }
};

// Delete vendor
export const deleteVendor = async (id) => {
  try {
    await sql`DELETE FROM vendors WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Error deleting vendor:', error);
    throw error;
  }
};

// Get vendor statistics
export const getVendorStats = async () => {
  try {
    const stats = await sql`
      SELECT
        COUNT(*) as total_vendors,
        COUNT(CASE WHEN "isActive" = true THEN 1 END) as active_vendors,
        COUNT(CASE WHEN "isActive" = false THEN 1 END) as inactive_vendors,
        AVG(rating) as average_rating
      FROM vendors
    `;
    return stats[0];
  } catch (error) {
    console.error('Error fetching vendor stats:', error);
    throw error;
  }
};

// Search vendors
export const searchVendors = async (searchTerm) => {
  try {
    const vendors = await sql`
      SELECT
        id,
        name,
        company,
        "companyName",
        "companyType",
        "onboardingDate",
        email,
        phone,
        address,
        country,
        state,
        city,
        username,
        "gstNumber",
        specialization,
        "typeOfWork",
        "isActive",
        rating,
        "createdAt",
        "updatedAt"
      FROM vendors
      WHERE
        "companyName" ILIKE ${`%${searchTerm}%`} OR
        username ILIKE ${`%${searchTerm}%`} OR
        "gstNumber" ILIKE ${`%${searchTerm}%`} OR
        specialization ILIKE ${`%${searchTerm}%`}
      ORDER BY "createdAt" DESC
    `;
    return vendors;
  } catch (error) {
    console.error('Error searching vendors:', error);
    throw error;
  }
};
