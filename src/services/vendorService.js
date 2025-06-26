import { sql } from '../config/database.js';

// Get all vendors
export const getAllVendors = async () => {
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
      ORDER BY "createdAt" DESC
    `;

    // Transform data to match UI expectations and format dates
    return vendors.map(vendor => ({
      ...vendor,
      // Map database fields to UI expected fields
      company_name: vendor.companyName || vendor.company || vendor.name || 'N/A',
      emails: vendor.email ? [vendor.email] : [],
      phones: vendor.phone ? [vendor.phone] : [],
      company_type: vendor.companyType || 'N/A',
      type_of_work: Array.isArray(vendor.typeOfWork) ? vendor.typeOfWork.join(', ') : (vendor.specialization || 'N/A'),
      status: vendor.isActive ? 'Active' : 'Inactive',
      totalOrders: vendor.totalOrders || 0,
      // Format dates to strings to prevent React errors
      onboardingDate: vendor.onboardingDate ? new Date(vendor.onboardingDate).toISOString().split('T')[0] : '',
      createdAt: vendor.createdAt ? new Date(vendor.createdAt).toISOString().split('T')[0] : '',
      updatedAt: vendor.updatedAt ? new Date(vendor.updatedAt).toISOString().split('T')[0] : ''
    }));
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

// Get vendor by ID
export const getVendorById = async (id) => {
  try {
    const vendor = await sql`
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
      WHERE id = ${id}
    `;

    const vendorData = vendor[0];
    if (!vendorData) return null;

    // Transform data to match UI expectations and format dates
    return {
      ...vendorData,
      // Map database fields to UI expected fields
      company_name: vendorData.companyName || vendorData.company || vendorData.name || 'N/A',
      emails: vendorData.email ? [vendorData.email] : [],
      phones: vendorData.phone ? [vendorData.phone] : [],
      company_type: vendorData.companyType || 'N/A',
      type_of_work: Array.isArray(vendorData.typeOfWork) ? vendorData.typeOfWork.join(', ') : (vendorData.specialization || 'N/A'),
      status: vendorData.isActive ? 'Active' : 'Inactive',
      totalOrders: vendorData.totalOrders || 0,
      // Format dates to strings to prevent React errors
      onboardingDate: vendorData.onboardingDate ? new Date(vendorData.onboardingDate).toISOString().split('T')[0] : '',
      createdAt: vendorData.createdAt ? new Date(vendorData.createdAt).toISOString().split('T')[0] : '',
      updatedAt: vendorData.updatedAt ? new Date(vendorData.updatedAt).toISOString().split('T')[0] : ''
    };
  } catch (error) {
    console.error('Error fetching vendor by ID:', error);
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
        "updatedAt",
        "createdById"
      ) VALUES (
        ${companyName},
        ${companyName},
        ${companyName},
        ${companyType},
        ${onboardingDate},
        ${emails[0] || ''},
        ${phones[0] || ''},
        ${address},
        ${country},
        ${state},
        ${city},
        ${username},
        ${gstNumber},
        ${description},
        ${JSON.stringify(services)},
        ${status === 'Active'},
        NOW(),
        'admin'
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
        name = ${updateObj.name || sql`name`},
        company = ${updateObj.company || sql`company`},
        "companyName" = ${updateObj.companyName || sql`"companyName"`},
        "companyType" = ${updateObj.companyType || sql`"companyType"`},
        "onboardingDate" = ${updateObj.onboardingDate || sql`"onboardingDate"`},
        email = ${updateObj.email || sql`email`},
        phone = ${updateObj.phone || sql`phone`},
        address = ${updateObj.address || sql`address`},
        country = ${updateObj.country || sql`country`},
        state = ${updateObj.state || sql`state`},
        city = ${updateObj.city || sql`city`},
        username = ${updateObj.username || sql`username`},
        "gstNumber" = ${updateObj.gstNumber || sql`"gstNumber"`},
        rating = ${updateObj.rating || sql`rating`},
        specialization = ${updateObj.specialization || sql`specialization`},
        "isActive" = ${updateObj.isActive !== undefined ? updateObj.isActive : sql`"isActive"`},
        "updatedAt" = NOW()
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
