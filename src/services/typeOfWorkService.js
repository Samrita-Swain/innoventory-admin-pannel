import { sql } from '../config/database.js';

// Demo type of work fallback data
const demoTypeOfWork = [
  {
    id: 'demo-work-1',
    name: 'Software Development',
    description: 'Custom software development and programming services',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'demo-work-2',
    name: 'Digital Marketing',
    description: 'SEO, social media marketing, and online advertising',
    isActive: true,
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z'
  },
  {
    id: 'demo-work-3',
    name: 'Graphic Design',
    description: 'Logo design, branding, and visual identity services',
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: 'demo-work-4',
    name: 'Content Writing',
    description: 'Blog posts, articles, and copywriting services',
    isActive: false,
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z'
  },
  {
    id: 'demo-work-5',
    name: 'Data Analysis',
    description: 'Data processing, analysis, and reporting services',
    isActive: true,
    createdAt: '2024-02-28T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z'
  }
];

// Get all type of work entries
export const getAllTypeOfWork = async () => {
  try {
    // First try to get from database
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

    // If found in database, return it
    if (typeOfWork && typeOfWork.length > 0) {
      console.log('✅ Type of work found in database:', typeOfWork);
      return typeOfWork;
    }

    // If database is empty, return demo data
    console.log('✅ Using demo type of work data');
    return demoTypeOfWork;
  } catch (error) {
    console.error('Error fetching type of work:', error);

    // Fallback to demo data if database error
    console.log('✅ Using demo type of work as fallback');
    return demoTypeOfWork;
  }
};

// Get active type of work entries (for dropdowns)
export const getActiveTypeOfWork = async () => {
  try {
    // First try to get from database
    const typeOfWork = await sql`
      SELECT
        id,
        name,
        description
      FROM type_of_work
      WHERE "isActive" = true
      ORDER BY name ASC
    `;

    // If found in database, return it
    if (typeOfWork && typeOfWork.length > 0) {
      console.log('✅ Active type of work found in database:', typeOfWork);
      return typeOfWork;
    }

    // If database is empty, return active demo data
    const activeDemoData = demoTypeOfWork.filter(work => work.isActive);
    console.log('✅ Using active demo type of work data');
    return activeDemoData;
  } catch (error) {
    console.error('Error fetching active type of work:', error);

    // Fallback to demo data if database error
    const activeDemoData = demoTypeOfWork.filter(work => work.isActive);
    console.log('✅ Using active demo type of work as fallback');
    return activeDemoData;
  }
};

// Get type of work by ID
export const getTypeOfWorkById = async (id) => {
  try {
    // First try to get from database
    const typeOfWork = await sql`
      SELECT
        id,
        name,
        description,
        "isActive",
        "createdAt",
        "updatedAt"
      FROM type_of_work
      WHERE id = ${id}
    `;

    const workData = typeOfWork[0];

    // If found in database, return it
    if (workData) {
      console.log('✅ Type of work found in database:', workData);
      return workData;
    }

    // If not found in database, check demo data
    const demoWork = demoTypeOfWork.find(work => work.id === id);
    if (demoWork) {
      console.log('✅ Type of work found in demo data:', demoWork);
      return demoWork;
    }

    console.log('❌ Type of work not found:', id);
    return null;
  } catch (error) {
    console.error('Error fetching type of work by ID:', error);

    // Fallback to demo data if database error
    const demoWork = demoTypeOfWork.find(work => work.id === id);
    if (demoWork) {
      console.log('✅ Using demo type of work as fallback:', demoWork);
      return demoWork;
    }

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
      description,
      isActive
    } = typeOfWorkData;

    // Build update fields dynamically
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = $' + (updateValues.length + 1));
      updateValues.push(name);
    }

    if (description !== undefined) {
      updateFields.push('description = $' + (updateValues.length + 1));
      updateValues.push(description);
    }

    if (isActive !== undefined) {
      updateFields.push('"isActive" = $' + (updateValues.length + 1));
      updateValues.push(isActive);
    }

    // Always update the updatedAt field
    updateFields.push('"updatedAt" = CURRENT_TIMESTAMP');

    if (updateFields.length === 1) { // Only updatedAt
      throw new Error('No fields to update');
    }

    // Build the SQL query
    const query = `
      UPDATE type_of_work SET
        ${updateFields.join(', ')}
      WHERE id = $${updateValues.length + 1}
      RETURNING *
    `;
    updateValues.push(id);

    const typeOfWork = await sql.unsafe(query, updateValues);

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
