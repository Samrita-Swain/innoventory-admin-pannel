import { neon } from '@neondatabase/serverless';

// Database connection
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || 'postgresql://neondb_owner:npg_Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8@ep-rough-forest-a5ixqhqr.us-east-2.aws.neon.tech/neondb?sslmode=require';

export const sql = neon(DATABASE_URL);

// Test database connection
export const testConnection = async () => {
  try {
    console.log('🔄 Testing database connection...');
    await sql`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
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

// Insert sample data
export const insertSampleData = async () => {
  try {
    console.log('🔄 Inserting sample data...');
    console.log('⚠️ Skipping sample data insertion to avoid schema conflicts');
    console.log('✅ Sample data insertion completed (skipped for compatibility)');
    return true;
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    return false;
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
