/**
 * Schema Adapter - Handles differences between existing database schema and application expectations
 */

/**
 * Transform vendor data from database format to application format
 */
export const transformVendorFromDB = (vendor) => {
  if (!vendor) return null;
  
  return {
    id: vendor.id,
    company_name: vendor.companyName || vendor.company || vendor.name || '',
    company_type: vendor.companyType || 'Company',
    onboarding_date: vendor.onboardingDate ? new Date(vendor.onboardingDate).toISOString().split('T')[0] : 
                     (vendor.createdAt ? new Date(vendor.createdAt).toISOString().split('T')[0] : ''),
    emails: vendor.email ? [vendor.email] : [],
    phones: vendor.phone ? [vendor.phone] : [],
    address: vendor.address || '',
    country: vendor.country || '',
    state: vendor.state || '',
    city: vendor.city || '',
    username: vendor.username || '',
    gst_number: vendor.gstNumber || '',
    description: vendor.specialization || '',
    services: Array.isArray(vendor.typeOfWork) ? vendor.typeOfWork : 
              (vendor.typeOfWork ? [vendor.typeOfWork] : []),
    website: vendor.website || '',
    type_of_work: Array.isArray(vendor.typeOfWork) ? vendor.typeOfWork.join(', ') : 
                  (vendor.typeOfWork || ''),
    status: vendor.isActive ? 'Active' : 'Inactive',
    files: {
      gst: vendor.gstFileUrl || '',
      nda: vendor.ndaFileUrl || '',
      agreement: vendor.agreementFileUrl || '',
      logo: vendor.companyLogoUrl || '',
      others: vendor.otherDocsUrls || []
    },
    rating: vendor.rating || 0,
    total_orders: 0 // Will need to calculate from orders table
  };
};

/**
 * Transform vendor data from application format to database format
 */
export const transformVendorToDB = (vendorData) => {
  const vendorId = vendorData.id || `vendor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: vendorId,
    name: vendorData.company_name || vendorData.name || '',
    email: vendorData.emails && vendorData.emails[0] ? vendorData.emails[0] : '',
    phone: vendorData.phones && vendorData.phones[0] ? vendorData.phones[0] : '',
    company: vendorData.company_name || '',
    companyType: vendorData.company_type || 'Company',
    companyName: vendorData.company_name || '',
    onboardingDate: vendorData.onboarding_date ? new Date(vendorData.onboarding_date) : new Date(),
    address: vendorData.address || '',
    country: vendorData.country || '',
    state: vendorData.state || '',
    city: vendorData.city || '',
    username: vendorData.username || '',
    gstNumber: vendorData.gst_number || '',
    specialization: vendorData.description || '',
    typeOfWork: vendorData.services || [],
    isActive: vendorData.status === 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: 'system'
  };
};

/**
 * Transform client data from database format to application format
 */
export const transformClientFromDB = (client) => {
  if (!client) return null;
  
  return {
    id: client.id,
    company_name: client.company_name || '',
    company_type: client.company_type || 'Company',
    onboarding_date: client.onboarding_date ? new Date(client.onboarding_date).toISOString().split('T')[0] : 
                     (client.created_at ? new Date(client.created_at).toISOString().split('T')[0] : ''),
    emails: client.emails || [],
    phones: client.phones || [],
    address: client.address || '',
    country: client.country || '',
    state: client.state || '',
    city: client.city || '',
    dpiit_registered: client.dpiit_registered || false,
    dpiit_number: client.dpiit_number || '',
    files: client.files || {},
    status: client.status || 'Active'
  };
};

/**
 * Transform client data from application format to database format
 */
export const transformClientToDB = (clientData) => {
  return {
    company_name: clientData.company_name || '',
    company_type: clientData.company_type || 'Company',
    onboarding_date: clientData.onboarding_date ? new Date(clientData.onboarding_date) : null,
    emails: clientData.emails || [],
    phones: clientData.phones || [],
    address: clientData.address || '',
    country: clientData.country || '',
    state: clientData.state || '',
    city: clientData.city || '',
    dpiit_registered: clientData.dpiit_registered || false,
    dpiit_number: clientData.dpiit_number || '',
    files: clientData.files || {},
    status: clientData.status || 'Active',
    created_at: new Date(),
    updated_at: new Date()
  };
};

/**
 * Transform order data from database format to application format
 */
export const transformOrderFromDB = (order) => {
  if (!order) return null;
  
  return {
    id: order.id,
    reference_number: order.referenceNumber || '',
    title: order.title || '',
    description: order.description || '',
    type: order.type || '',
    status: order.status || 'Pending',
    priority: order.priority || 'Medium',
    start_date: order.startDate ? new Date(order.startDate).toISOString().split('T')[0] : '',
    due_date: order.dueDate ? new Date(order.dueDate).toISOString().split('T')[0] : '',
    completed_date: order.completedDate ? new Date(order.completedDate).toISOString().split('T')[0] : '',
    amount: order.amount || 0,
    paid_amount: order.paidAmount || 0,
    currency: order.currency || 'USD',
    customer_id: order.customerId || '',
    vendor_id: order.vendorId || '',
    assigned_to_id: order.assignedToId || '',
    created_at: order.createdAt || new Date(),
    updated_at: order.updatedAt || new Date()
  };
};

/**
 * Check if database schema matches expected application schema
 */
export const validateSchema = async (sql) => {
  try {
    const issues = [];
    
    // Check vendors table structure
    const vendorsColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'vendors'
    `;
    
    const vendorColumnNames = vendorsColumns.map(col => col.column_name);
    const expectedVendorColumns = ['id', 'name', 'email', 'company', 'isActive'];
    
    for (const col of expectedVendorColumns) {
      if (!vendorColumnNames.includes(col)) {
        issues.push(`Missing column in vendors table: ${col}`);
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  } catch (error) {
    return {
      isValid: false,
      issues: [`Schema validation failed: ${error.message}`]
    };
  }
};
