import { sql } from '../config/database.js';

/**
 * Comprehensive database health check utility
 */
export const performHealthCheck = async () => {
  const results = {
    connection: false,
    tables: {},
    errors: []
  };

  try {
    // Test basic connection
    console.log('🔄 Performing database health check...');
    
    // 1. Test connection
    try {
      const connectionTest = await sql`SELECT NOW() as current_time, version() as db_version`;
      results.connection = true;
      console.log('✅ Database connection: OK');
      console.log('⏰ Server time:', connectionTest[0].current_time);
      console.log('🗄️ Database version:', connectionTest[0].db_version);
    } catch (error) {
      results.connection = false;
      results.errors.push(`Connection failed: ${error.message}`);
      console.error('❌ Database connection: FAILED', error.message);
      return results;
    }

    // 2. Check if tables exist
    const expectedTables = ['vendors', 'clients', 'orders', 'sub_admins', 'type_of_work'];
    
    for (const tableName of expectedTables) {
      try {
        const tableCheck = await sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = ${tableName}
          ) as table_exists
        `;
        
        const exists = tableCheck[0].table_exists;
        results.tables[tableName] = exists;
        
        if (exists) {
          // Get row count
          const countResult = await sql`SELECT COUNT(*) as count FROM ${sql(tableName)}`;
          const count = parseInt(countResult[0].count);
          console.log(`✅ Table ${tableName}: EXISTS (${count} rows)`);
        } else {
          console.log(`⚠️ Table ${tableName}: MISSING`);
        }
      } catch (error) {
        results.tables[tableName] = false;
        results.errors.push(`Table check failed for ${tableName}: ${error.message}`);
        console.error(`❌ Table ${tableName}: ERROR`, error.message);
      }
    }

    // 3. Test basic operations
    try {
      await sql`SELECT 1 as test_query`;
      console.log('✅ Query execution: OK');
    } catch (error) {
      results.errors.push(`Query execution failed: ${error.message}`);
      console.error('❌ Query execution: FAILED', error.message);
    }

    console.log('🏁 Health check completed');
    return results;

  } catch (error) {
    results.errors.push(`Health check failed: ${error.message}`);
    console.error('❌ Health check failed:', error);
    return results;
  }
};

/**
 * Quick connection test
 */
export const quickConnectionTest = async () => {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Quick connection test failed:', error.message);
    return false;
  }
};

/**
 * Get database statistics
 */
export const getDatabaseStats = async () => {
  try {
    const stats = {};
    const tables = ['vendors', 'clients', 'orders', 'sub_admins', 'type_of_work'];
    
    for (const table of tables) {
      try {
        const result = await sql`SELECT COUNT(*) as count FROM ${sql(table)}`;
        stats[table] = parseInt(result[0].count);
      } catch (error) {
        stats[table] = 'Error: ' + error.message;
      }
    }
    
    return stats;
  } catch (error) {
    console.error('Failed to get database stats:', error);
    return {};
  }
};
