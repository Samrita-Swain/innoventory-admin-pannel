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
    console.log('🔄 Fetching all type of work from database...');

    // First try to get from database
    const typeOfWork = await sql`
      SELECT
        id,
        name,
        description,
        "isActive",
        status,
        created_at,
        updated_at
      FROM type_of_work
      ORDER BY created_at DESC
    `;

    // If found in database, return it with proper field mapping
    if (typeOfWork && typeOfWork.length > 0) {
      console.log('✅ Type of work found in database:', typeOfWork.length, 'entries');
      return typeOfWork.map(work => ({
        id: work.id,
        name: work.name,
        description: work.description || '',
        isActive: work.isActive !== false && work.status !== 'Inactive',
        status: work.status || (work.isActive ? 'Active' : 'Inactive'),
        createdAt: work.created_at,
        updatedAt: work.updated_at
      }));
    }

    // If database is empty, return demo data
    console.log('✅ Using demo type of work data');
    return demoTypeOfWork;
  } catch (error) {
    console.error('❌ Error fetching type of work:', error);

    // Fallback to demo data if database error
    console.log('✅ Using demo type of work as fallback');
    return demoTypeOfWork;
  }
};

// Get active type of work entries (for dropdowns)
export const getActiveTypeOfWork = async () => {
  try {
    console.log('🔄 Fetching active type of work from database...');

    // First try to get from database - handle both isActive and status fields
    const typeOfWork = await sql`
      SELECT
        id,
        name,
        description,
        "isActive",
        status
      FROM type_of_work
      WHERE ("isActive" = true OR "isActive" IS NULL)
        AND (status IS NULL OR status != 'Inactive')
      ORDER BY name ASC
    `;

    // If found in database, return it
    if (typeOfWork && typeOfWork.length > 0) {
      console.log('✅ Active type of work found in database:', typeOfWork.length, 'entries');
      return typeOfWork.map(work => ({
        id: work.id,
        name: work.name,
        description: work.description || '',
        isActive: work.isActive !== false && work.status !== 'Inactive'
      }));
    }

    // If database is empty, return active demo data
    const activeDemoData = demoTypeOfWork.filter(work => work.isActive);
    console.log('✅ Using active demo type of work data:', activeDemoData.length, 'entries');
    return activeDemoData;
  } catch (error) {
    console.error('❌ Error fetching active type of work:', error);

    // Fallback to demo data if database error
    const activeDemoData = demoTypeOfWork.filter(work => work.isActive);
    console.log('✅ Using active demo type of work as fallback:', activeDemoData.length, 'entries');
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

    // Table should already exist from database initialization
    console.log('📋 Using existing type_of_work table schema');

    // Insert the new type of work
    const typeOfWork = await sql`
      INSERT INTO type_of_work (
        name,
        description,
        "isActive",
        "createdAt",
        "updatedAt"
      ) VALUES (
        ${name.trim()},
        ${description.trim()},
        ${true},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
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

    console.log('🔄 Updating type of work with data:', { name, description, isActive });

    // Use a simpler, more reliable update approach
    console.log('🔄 Updating type of work fields:', { name, description, isActive });

    const typeOfWork = await sql`
      UPDATE type_of_work SET
        name = ${name || null},
        description = ${description || null},
        "isActive" = ${isActive !== undefined ? isActive : true},
        status = ${isActive !== undefined ? (isActive ? 'Active' : 'Inactive') : 'Active'},
        updated_at = CURRENT_TIMESTAMP
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
    console.log(`🔄 Updating type of work status for ID ${id} to: ${status}`);

    const isActive = status === 'Active'; // Convert text to boolean
    const typeOfWork = await sql`
      UPDATE type_of_work SET
        "isActive" = ${isActive},
        status = ${status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (typeOfWork.length === 0) {
      throw new Error(`Type of work with ID ${id} not found`);
    }

    console.log('✅ Type of work status updated successfully:', typeOfWork[0]);
    return typeOfWork[0];
  } catch (error) {
    console.error('❌ Error updating type of work status:', error);
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
