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

// Get sub-admin by ID
export const getSubAdminById = async (id) => {
  try {
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
    if (!adminData) return null;

    // Transform dates to strings to prevent React errors
    return {
      ...adminData,
      onboarding_date: adminData.onboarding_date ? new Date(adminData.onboarding_date).toISOString().split('T')[0] : '',
      created_at: adminData.created_at ? new Date(adminData.created_at).toISOString().split('T')[0] : '',
      updated_at: adminData.updated_at ? new Date(adminData.updated_at).toISOString().split('T')[0] : ''
    };
  } catch (error) {
    console.error('Error fetching sub-admin by ID:', error);
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
