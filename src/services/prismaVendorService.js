import { sql } from '../config/database.js';
import { processVendorFiles } from './fileUploadService.js';

/**
 * Prisma-based Vendor Service
 * Handles all vendor operations with proper file management
 */

// Transform vendor data from form to database format
const transformVendorData = async (formData, files = {}) => {
  try {
    console.log('🔄 Transforming vendor data...');
    
    // Generate unique vendor ID
    const vendorId = `vendor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Process uploaded files
    let processedFiles = {
      gstFileUrl: null,
      ndaFileUrl: null,
      agreementFileUrl: null,
      companyLogoUrl: null,
      otherDocsUrls: []
    };
    
    if (files && Object.keys(files).length > 0) {
      console.log('📁 Processing vendor files...');
      processedFiles = await processVendorFiles(files, vendorId);
      console.log('✅ Files processed:', processedFiles);
    }

    // Transform form data to match actual database schema
    const transformedData = {
      company_name: formData.companyName || '',
      company_type: formData.companyType || null,
      onboarding_date: formData.onboardingDate ? new Date(formData.onboardingDate) : null,
      emails: formData.emails || [],
      phones: formData.phones || [],
      address: formData.address || null,
      country: formData.country || null,
      state: formData.state || null,
      city: formData.city || null,
      username: formData.username || null,
      gst_number: formData.gstNumber || null,
      description: formData.description || null,
      services: Array.isArray(formData.services) ? formData.services :
                (formData.services ? [formData.services] : []),
      website: formData.website || null,
      type_of_work: Array.isArray(formData.services) ? formData.services.join(', ') :
                    (formData.services || null),
      status: formData.status || 'Pending',
      files: {
        gstFileUrl: processedFiles.gstFileUrl,
        ndaFileUrl: processedFiles.ndaFileUrl,
        agreementFileUrl: processedFiles.agreementFileUrl,
        companyLogoUrl: processedFiles.companyLogoUrl,
        otherDocsUrls: processedFiles.otherDocsUrls
      },
      rating: 0,
      total_orders: 0
    };

    console.log('✅ Vendor data transformed:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('❌ Error transforming vendor data:', error);
    throw error;
  }
};

// Transform vendor data from database to display format
const transformVendorForDisplay = (vendor) => {
  if (!vendor) return null;

  return {
    id: vendor.id,
    companyName: vendor.company_name || '',
    companyType: vendor.company_type || 'Company',
    onboardingDate: vendor.onboarding_date ? vendor.onboarding_date.toISOString().split('T')[0] : '',
    emails: Array.isArray(vendor.emails) ? vendor.emails : [],
    phones: Array.isArray(vendor.phones) ? vendor.phones : [],
    address: vendor.address || '',
    country: vendor.country || '',
    state: vendor.state || '',
    city: vendor.city || '',
    username: vendor.username || '',
    gstNumber: vendor.gst_number || '',
    description: vendor.description || '',
    services: Array.isArray(vendor.services) ? vendor.services : [],
    website: vendor.website || '',
    typeOfWork: vendor.type_of_work || '',
    status: vendor.status || 'Pending',
    files: vendor.files || {},
    rating: parseFloat(vendor.rating) || 0,
    totalOrders: vendor.total_orders || 0,
    createdAt: vendor.created_at,
    updatedAt: vendor.updated_at
  };
};

/**
 * Create new vendor
 */
export const createVendor = async (vendorData) => {
  try {
    console.log('🚀 Creating vendor with SQL...');
    console.log('📋 Input data:', vendorData);

    // Transform data
    const transformedData = await transformVendorData(vendorData, vendorData.files);

    // Create vendor in database
    const vendor = await sql`
      INSERT INTO vendors (
        company_name, company_type, onboarding_date, emails, phones,
        address, country, state, city, username, gst_number, description,
        services, website, type_of_work, status, gst_file_url, nda_file_url,
        agreement_file_url, company_logo_url, other_docs_urls, "createdAt", "updatedAt"
      ) VALUES (
        ${transformedData.company_name}, ${transformedData.company_type}, ${transformedData.onboarding_date},
        ${JSON.stringify(transformedData.emails)}, ${JSON.stringify(transformedData.phones)},
        ${transformedData.address}, ${transformedData.country}, ${transformedData.state}, ${transformedData.city},
        ${transformedData.username}, ${transformedData.gst_number}, ${transformedData.description},
        ${JSON.stringify(transformedData.services)}, ${transformedData.website}, ${transformedData.type_of_work},
        ${transformedData.status}, ${transformedData.gst_file_url}, ${transformedData.nda_file_url},
        ${transformedData.agreement_file_url}, ${transformedData.company_logo_url},
        ${JSON.stringify(transformedData.other_docs_urls)}, ${new Date().toISOString()}, ${new Date().toISOString()}
      ) RETURNING *
    `;

    console.log('✅ Vendor created successfully:', vendor[0]);
    return transformVendorForDisplay(vendor[0]);
  } catch (error) {
    console.error('❌ Error creating vendor:', error);

    // Handle specific database errors
    if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
      throw new Error('A vendor with this email already exists');
    }

    throw new Error(`Failed to create vendor: ${error.message}`);
  }
};

/**
 * Get all vendors
 */
export const getAllVendors = async () => {
  try {
    console.log('🔄 Fetching all vendors...');

    const vendors = await sql`
      SELECT * FROM vendors
      ORDER BY "createdAt" DESC
    `;

    console.log(`✅ Fetched ${vendors.length} vendors`);
    return vendors.map(transformVendorForDisplay);
  } catch (error) {
    console.error('❌ Error fetching vendors:', error);
    throw new Error(`Failed to fetch vendors: ${error.message}`);
  }
};

/**
 * Get vendor by ID
 */
export const getVendorById = async (id) => {
  try {
    console.log('🔄 Fetching vendor by ID:', id);

    const vendors = await sql`
      SELECT * FROM vendors WHERE id = ${id}
    `;

    if (vendors.length === 0) {
      throw new Error('Vendor not found');
    }

    const vendor = vendors[0];
    console.log('✅ Vendor fetched:', vendor);
    return transformVendorForDisplay(vendor);
  } catch (error) {
    console.error('❌ Error fetching vendor:', error);
    throw new Error(`Failed to fetch vendor: ${error.message}`);
  }
};

/**
 * Update vendor
 */
export const updateVendor = async (id, vendorData) => {
  try {
    console.log('🔄 Updating vendor:', id);
    console.log('📋 Update data:', vendorData);

    // Transform data (excluding ID since it's for update)
    const transformedData = await transformVendorData(vendorData, vendorData.files);
    delete transformedData.id; // Remove ID for update
    delete transformedData.createdById; // Don't update creator

    const vendor = await sql`
      UPDATE vendors SET
        company_name = ${transformedData.company_name},
        company_type = ${transformedData.company_type},
        onboarding_date = ${transformedData.onboarding_date},
        emails = ${JSON.stringify(transformedData.emails)},
        phones = ${JSON.stringify(transformedData.phones)},
        address = ${transformedData.address},
        country = ${transformedData.country},
        state = ${transformedData.state},
        city = ${transformedData.city},
        username = ${transformedData.username},
        gst_number = ${transformedData.gst_number},
        description = ${transformedData.description},
        services = ${JSON.stringify(transformedData.services)},
        website = ${transformedData.website},
        type_of_work = ${transformedData.type_of_work},
        status = ${transformedData.status},
        gst_file_url = ${transformedData.gst_file_url},
        nda_file_url = ${transformedData.nda_file_url},
        agreement_file_url = ${transformedData.agreement_file_url},
        company_logo_url = ${transformedData.company_logo_url},
        other_docs_urls = ${JSON.stringify(transformedData.other_docs_urls)},
        "updatedAt" = ${new Date().toISOString()}
      WHERE id = ${id}
      RETURNING *
    `;

    if (vendor.length === 0) {
      throw new Error('Vendor not found');
    }

    console.log('✅ Vendor updated successfully:', vendor[0]);
    return transformVendorForDisplay(vendor[0]);
  } catch (error) {
    console.error('❌ Error updating vendor:', error);

    if (error.message.includes('not found')) {
      throw new Error('Vendor not found');
    }

    if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
      throw new Error('A vendor with this email already exists');
    }

    throw new Error(`Failed to update vendor: ${error.message}`);
  }
};

/**
 * Delete vendor
 */
export const deleteVendor = async (id) => {
  try {
    console.log('🗑️ Deleting vendor:', id);

    const result = await sql`
      DELETE FROM vendors WHERE id = ${id}
    `;

    console.log('✅ Vendor deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Error deleting vendor:', error);

    if (error.message.includes('not found')) {
      throw new Error('Vendor not found');
    }

    throw new Error(`Failed to delete vendor: ${error.message}`);
  }
};

/**
 * Get vendor statistics
 */
export const getVendorStats = async () => {
  try {
    console.log('📊 Fetching vendor statistics...');

    const [totalResult, activeResult, inactiveResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM vendors`,
      sql`SELECT COUNT(*) as count FROM vendors WHERE status = 'active'`,
      sql`SELECT COUNT(*) as count FROM vendors WHERE status = 'inactive'`
    ]);

    const stats = {
      total: parseInt(totalResult[0].count),
      active: parseInt(activeResult[0].count),
      inactive: parseInt(inactiveResult[0].count),
      pendingApproval: 0 // Could be calculated based on status field if added
    };

    console.log('✅ Vendor stats:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error fetching vendor stats:', error);
    throw new Error(`Failed to fetch vendor statistics: ${error.message}`);
  }
};
