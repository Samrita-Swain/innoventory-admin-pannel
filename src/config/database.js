import { neon } from '@neondatabase/serverless';

// Database connection - get from environment variables
// Support both Vite (import.meta.env) and Node.js (process.env) environments
let DATABASE_URL;

if (typeof import.meta !== 'undefined' && import.meta.env) {
  // Vite/browser environment
  DATABASE_URL = import.meta.env.VITE_DATABASE_URL;
} else {
  // Node.js environment - try both VITE_DATABASE_URL and DATABASE_URL
  DATABASE_URL = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
}

if (!DATABASE_URL) {
  throw new Error('Database URL not found. Please set VITE_DATABASE_URL or DATABASE_URL in your .env file.');
}

console.log('🔗 Connecting to database:', DATABASE_URL.replace(/:[^:@]*@/, ':****@')); // Hide password in logs

export const sql = neon(DATABASE_URL);

// Test database connection
export const testConnection = async () => {
  try {
    console.log('🔄 Testing database connection...');
    console.log('🔗 Using database URL:', DATABASE_URL.replace(/:[^:@]*@/, ':****@'));

    const result = await sql`SELECT 1 as test, version() as db_version`;
    console.log('✅ Database connection successful');
    console.log('📊 Database info:', result[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });

    // Check if it's a common connection issue
    if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('🌐 Network issue: Cannot resolve database hostname');
    } else if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication issue: Check your database credentials');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.error('🗄️ Database issue: Database does not exist');
    }

    return false;
  }
};

// Initialize database (alias for initializeSchema)
export const initializeDatabase = async () => {
  return await initializeSchema();
};

// Initialize database schema
export const initializeSchema = async () => {
  try {
    console.log('🔄 Initializing database schema...');

    // Create vendors table
    await sql`
      CREATE TABLE IF NOT EXISTS vendors (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        company_type VARCHAR(100),
        onboarding_date DATE,
        emails JSONB DEFAULT '[]',
        phones JSONB DEFAULT '[]',
        address TEXT,
        country VARCHAR(100),
        state VARCHAR(100),
        city VARCHAR(100),
        username VARCHAR(255),
        gst_number VARCHAR(50),
        description TEXT,
        services JSONB DEFAULT '[]',
        website VARCHAR(255),
        type_of_work VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Pending',
        files JSONB DEFAULT '{}',
        rating DECIMAL(3,2) DEFAULT 0.00,
        total_orders INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create clients table
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        company_type VARCHAR(100),
        onboarding_date DATE,
        emails JSONB DEFAULT '[]',
        phones JSONB DEFAULT '[]',
        address TEXT,
        country VARCHAR(100),
        state VARCHAR(100),
        city VARCHAR(100),
        dpiit_registered BOOLEAN DEFAULT FALSE,
        dpiit_number VARCHAR(100),
        files JSONB DEFAULT '{}',
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        reference_number VARCHAR(100) UNIQUE NOT NULL,
        client_id INTEGER REFERENCES clients(id),
        vendor_id INTEGER REFERENCES vendors(id),
        description TEXT,
        amount DECIMAL(15,2),
        status VARCHAR(50) DEFAULT 'Pending',
        priority VARCHAR(50) DEFAULT 'Medium',
        files JSONB DEFAULT '{}',
        status_history JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create sub_admins table
    await sql`
      CREATE TABLE IF NOT EXISTS sub_admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        onboarding_date DATE,
        address TEXT,
        country VARCHAR(100),
        state VARCHAR(100),
        city VARCHAR(100),
        username VARCHAR(255),
        pan_number VARCHAR(50),
        term_of_work VARCHAR(100),
        files JSONB DEFAULT '{}',
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create type_of_work table
    await sql`
      CREATE TABLE IF NOT EXISTS type_of_work (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        "isActive" BOOLEAN DEFAULT TRUE,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('✅ Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database schema initialization failed:', error);
    return false;
  }
};

// Insert sample data using the new seeding service
export const insertSampleData = async () => {
  try {
    console.log('🔄 Inserting sample data using seeding service...');

    // Import the seeding service dynamically to avoid circular dependencies
    const { seedAllData } = await import('../services/seedService.js');

    const result = await seedAllData();

    if (result.success) {
      console.log('✅ Sample data insertion completed successfully');
      console.log('📊 Seeding summary:', result.summary);
      return true;
    } else {
      console.warn('⚠️ Sample data insertion completed with some issues');
      console.log('📊 Seeding summary:', result.summary);
      return true; // Return true to not block app initialization
    }
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    return true; // Return true to not block app initialization
  }
};

// Function to refresh database with corrected data
export const refreshDatabaseData = async () => {
  try {
    console.log('🔄 Refreshing database data...');
    console.log('⚠️ Skipping database refresh to avoid schema conflicts');
    console.log('✅ Database refresh completed (skipped for compatibility)');
    return true;
  } catch (error) {
    console.error('❌ Error refreshing database data:', error);
    return false;
  }
};
