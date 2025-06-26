import { sql } from '../config/database.js';

// Get all type of work entries
export const getAllTypeOfWork = async () => {
  try {
    const typeOfWork = await sql`
      SELECT
        id,
        name,
        description,
        "isActive",
        "createdAt",
        "updatedAt"
      FROM type_of_work
      ORDER BY "createdAt" DESC
    `;
    return typeOfWork;
  } catch (error) {
    console.error('Error fetching type of work:', error);
    throw error;
  }
};

// Get active type of work entries (for dropdowns)
export const getActiveTypeOfWork = async () => {
  try {
    const typeOfWork = await sql`
      SELECT
        id,
        name,
        description
      FROM type_of_work
      WHERE "isActive" = true
      ORDER BY name ASC
    `;
    return typeOfWork;
  } catch (error) {
    console.error('Error fetching active type of work:', error);
    throw error;
  }
};

// Get type of work by ID
export const getTypeOfWorkById = async (id) => {
  try {
    const typeOfWork = await sql`
      SELECT
        id,
        name,
        description,
        "createdAt",
        "updatedAt"
      FROM type_of_work
      WHERE id = ${id}
    `;
    return typeOfWork[0] || null;
  } catch (error) {
    console.error('Error fetching type of work by ID:', error);
    throw error;
  }
};

// Create new type of work
export const createTypeOfWork = async (typeOfWorkData) => {
  try {
    const {
      name,
      description
    } = typeOfWorkData;

    // Validate required fields
    if (!name || !description) {
      throw new Error('Name and description are required fields');
    }

    // First ensure the table exists with correct structure
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS type_of_work (
          id TEXT PRIMARY KEY DEFAULT ('work-' || lower(hex(randomblob(8)))),
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          "isActive" BOOLEAN DEFAULT TRUE,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "createdById" TEXT DEFAULT 'admin'
        )
      `;
    } catch (tableError) {
      console.log('⚠️ Table creation issue (may already exist):', tableError.message);
    }

    // Insert the new type of work
    const typeOfWork = await sql`
      INSERT INTO type_of_work (
        name,
        description,
        "isActive",
        "createdAt",
        "updatedAt",
        "createdById"
      ) VALUES (
        ${name},
        ${description},
        ${true},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        ${'admin'}
      )
      RETURNING *
    `;

    console.log('✅ Type of work created successfully:', typeOfWork[0]);
    return typeOfWork[0];
  } catch (error) {
    console.error('❌ Error creating type of work:', error);
    console.error('Error details:', error.message);
    throw error;
  }
};

// Update type of work
export const updateTypeOfWork = async (id, typeOfWorkData) => {
  try {
    const {
      name,
      description
    } = typeOfWorkData;

    // Validate required fields
    if (!name || !description) {
      throw new Error('Name and description are required fields');
    }

    const typeOfWork = await sql`
      UPDATE type_of_work SET
        name = ${name},
        description = ${description},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (typeOfWork.length === 0) {
      throw new Error(`Type of work with id ${id} not found`);
    }

    console.log('✅ Type of work updated successfully:', typeOfWork[0]);
    return typeOfWork[0];
  } catch (error) {
    console.error('❌ Error updating type of work:', error);
    console.error('Error details:', error.message);
    throw error;
  }
};

// Update type of work status
export const updateTypeOfWorkStatus = async (id, status) => {
  try {
    const isActive = status === 'Active'; // Convert text to boolean
    const typeOfWork = await sql`
      UPDATE type_of_work SET
        "isActive" = ${isActive},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return typeOfWork[0];
  } catch (error) {
    console.error('Error updating type of work status:', error);
    throw error;
  }
};

// Delete type of work
export const deleteTypeOfWork = async (id) => {
  try {
    await sql`DELETE FROM type_of_work WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Error deleting type of work:', error);
    throw error;
  }
};

// Get type of work statistics
export const getTypeOfWorkStats = async () => {
  try {
    const stats = await sql`
      SELECT
        COUNT(*) as total_types,
        COUNT(*) as active_types,
        0 as inactive_types
      FROM type_of_work
    `;
    return stats[0];
  } catch (error) {
    console.error('Error fetching type of work stats:', error);
    throw error;
  }
};

// Search type of work
export const searchTypeOfWork = async (searchTerm) => {
  try {
    const typeOfWork = await sql`
      SELECT
        id,
        name,
        description,
        "createdAt",
        "updatedAt"
      FROM type_of_work
      WHERE
        name ILIKE ${`%${searchTerm}%`} OR
        description ILIKE ${`%${searchTerm}%`}
      ORDER BY "createdAt" DESC
    `;
    return typeOfWork;
  } catch (error) {
    console.error('Error searching type of work:', error);
    throw error;
  }
};

// Check if name exists
export const checkNameExists = async (name, excludeId = null) => {
  try {
    let query = sql`SELECT id FROM type_of_work WHERE name = ${name}`;
    
    if (excludeId) {
      query = sql`SELECT id FROM type_of_work WHERE name = ${name} AND id != ${excludeId}`;
    }
    
    const result = await query;
    return result.length > 0;
  } catch (error) {
    console.error('Error checking name exists:', error);
    throw error;
  }
};
