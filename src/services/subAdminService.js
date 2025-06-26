import { sql } from '../config/database.js';

// Get all sub-admins
export const getAllSubAdmins = async () => {
  try {
    const subAdmins = await sql`
      SELECT 
        id,
        name,
        email,
        onboarding_date,
        address,
        country,
        state,
        city,
        username,
        pan_number,
        term_of_work,
        files,
        status,
        created_at,
        updated_at
      FROM sub_admins 
      ORDER BY created_at DESC
    `;

    // Transform dates to strings to prevent React errors
    return subAdmins.map(admin => ({
      ...admin,
      onboarding_date: admin.onboarding_date ? new Date(admin.onboarding_date).toISOString().split('T')[0] : '',
      created_at: admin.created_at ? new Date(admin.created_at).toISOString().split('T')[0] : '',
      updated_at: admin.updated_at ? new Date(admin.updated_at).toISOString().split('T')[0] : ''
    }));
  } catch (error) {
    console.error('Error fetching sub-admins:', error);
    throw error;
  }
};

// Demo sub-admins fallback data
const demoSubAdmins = [
  {
    id: 'demo-sub-1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+91-9876543210',
    onboarding_date: '2024-01-15',
    onboardingDate: '2024-01-15',
    address: 'Tech Park, Whitefield, Bangalore',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
    term_of_work: 'Full-time',
    termOfWork: 'Full-time',
    role: 'Senior Admin',
    department: 'Operations',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'demo-sub-2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+91-8765432109',
    onboarding_date: '2024-02-01',
    onboardingDate: '2024-02-01',
    address: 'Business District, Andheri, Mumbai',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    term_of_work: 'Part-time',
    termOfWork: 'Part-time',
    role: 'Admin Assistant',
    department: 'Support',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'demo-sub-3',
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    phone: '+91-7654321098',
    onboarding_date: '2024-03-10',
    onboardingDate: '2024-03-10',
    address: 'IT Hub, Sector 62, Noida',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Noida',
    term_of_work: 'Contract',
    termOfWork: 'Contract',
    role: 'Project Coordinator',
    department: 'Projects',
    isActive: true,
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z'
  }
];

// Get sub-admin by ID
export const getSubAdminById = async (id) => {
  try {
    // First try to get from database
    const subAdmin = await sql`
      SELECT
        id,
        name,
        email,
        onboarding_date,
        address,
        country,
        state,
        city,
        username,
        pan_number,
        term_of_work,
        files,
        status,
        created_at,
        updated_at
      FROM sub_admins 
      WHERE id = ${id}
    `;

    const adminData = subAdmin[0];

    // If found in database, return it
    if (adminData) {
      console.log('✅ Sub-admin found in database:', adminData);
      return {
        ...adminData,
        onboarding_date: adminData.onboarding_date ? new Date(adminData.onboarding_date).toISOString().split('T')[0] : '',
        created_at: adminData.created_at ? new Date(adminData.created_at).toISOString().split('T')[0] : '',
        updated_at: adminData.updated_at ? new Date(adminData.updated_at).toISOString().split('T')[0] : ''
      };
    }

    // If not found in database, check demo data
    const demoSubAdmin = demoSubAdmins.find(s => s.id === id);
    if (demoSubAdmin) {
      console.log('✅ Sub-admin found in demo data:', demoSubAdmin);
      return demoSubAdmin;
    }

    console.log('❌ Sub-admin not found:', id);
    return null;
  } catch (error) {
    console.error('Error fetching sub-admin by ID:', error);

    // Fallback to demo data if database error
    const demoSubAdmin = demoSubAdmins.find(s => s.id === id);
    if (demoSubAdmin) {
      console.log('✅ Using demo sub-admin as fallback:', demoSubAdmin);
      return demoSubAdmin;
    }

    throw error;
  }
};

// Create new sub-admin
export const createSubAdmin = async (subAdminData) => {
  try {
    const {
      name,
      email,
      onboardingDate,
      address,
      country,
      state,
      city,
      username,
      panNumber,
      termOfWork,
      files = {},
      status = 'Active'
    } = subAdminData;

    const subAdmin = await sql`
      INSERT INTO sub_admins (
        name,
        email,
        onboarding_date,
        address,
        country,
        state,
        city,
        username,
        pan_number,
        term_of_work,
        files,
        status
      ) VALUES (
        ${name},
        ${email},
        ${onboardingDate},
        ${address},
        ${country},
        ${state},
        ${city},
        ${username},
        ${panNumber},
        ${termOfWork},
        ${JSON.stringify(files)},
        ${status}
      )
      RETURNING *
    `;
    return subAdmin[0];
  } catch (error) {
    console.error('Error creating sub-admin:', error);
    throw error;
  }
};

// Update sub-admin
export const updateSubAdmin = async (id, subAdminData) => {
  try {
    const {
      name,
      email,
      onboardingDate,
      address,
      country,
      state,
      city,
      username,
      panNumber,
      termOfWork,
      files,
      status
    } = subAdminData;

    const subAdmin = await sql`
      UPDATE sub_admins SET
        name = ${name},
        email = ${email},
        onboarding_date = ${onboardingDate},
        address = ${address},
        country = ${country},
        state = ${state},
        city = ${city},
        username = ${username},
        pan_number = ${panNumber},
        term_of_work = ${termOfWork},
        files = ${JSON.stringify(files)},
        status = ${status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return subAdmin[0];
  } catch (error) {
    console.error('Error updating sub-admin:', error);
    throw error;
  }
};

// Delete sub-admin
export const deleteSubAdmin = async (id) => {
  try {
    await sql`DELETE FROM sub_admins WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Error deleting sub-admin:', error);
    throw error;
  }
};

// Get sub-admin statistics
export const getSubAdminStats = async () => {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total_sub_admins,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_sub_admins,
        COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive_sub_admins,
        COUNT(CASE WHEN term_of_work = 'Full-time' THEN 1 END) as full_time_admins,
        COUNT(CASE WHEN term_of_work = 'Part-time' THEN 1 END) as part_time_admins,
        COUNT(CASE WHEN term_of_work = 'Contract' THEN 1 END) as contract_admins,
        COUNT(CASE WHEN term_of_work = 'Internship' THEN 1 END) as internship_admins
      FROM sub_admins
    `;
    return stats[0];
  } catch (error) {
    console.error('Error fetching sub-admin stats:', error);
    throw error;
  }
};

// Search sub-admins
export const searchSubAdmins = async (searchTerm) => {
  try {
    const subAdmins = await sql`
      SELECT 
        id,
        name,
        email,
        onboarding_date,
        address,
        country,
        state,
        city,
        username,
        pan_number,
        term_of_work,
        files,
        status,
        created_at,
        updated_at
      FROM sub_admins 
      WHERE 
        name ILIKE ${`%${searchTerm}%`} OR
        email ILIKE ${`%${searchTerm}%`} OR
        username ILIKE ${`%${searchTerm}%`} OR
        pan_number ILIKE ${`%${searchTerm}%`} OR
        term_of_work ILIKE ${`%${searchTerm}%`}
      ORDER BY created_at DESC
    `;
    return subAdmins;
  } catch (error) {
    console.error('Error searching sub-admins:', error);
    throw error;
  }
};

// Check if email exists
export const checkEmailExists = async (email, excludeId = null) => {
  try {
    let query = sql`SELECT id FROM sub_admins WHERE email = ${email}`;
    
    if (excludeId) {
      query = sql`SELECT id FROM sub_admins WHERE email = ${email} AND id != ${excludeId}`;
    }
    
    const result = await query;
    return result.length > 0;
  } catch (error) {
    console.error('Error checking email exists:', error);
    throw error;
  }
};

// Check if username exists
export const checkUsernameExists = async (username, excludeId = null) => {
  try {
    let query = sql`SELECT id FROM sub_admins WHERE username = ${username}`;
    
    if (excludeId) {
      query = sql`SELECT id FROM sub_admins WHERE username = ${username} AND id != ${excludeId}`;
    }
    
    const result = await query;
    return result.length > 0;
  } catch (error) {
    console.error('Error checking username exists:', error);
    throw error;
  }
};
