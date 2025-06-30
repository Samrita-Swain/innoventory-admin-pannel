import { testConnection, initializeDatabase, insertSampleData, refreshDatabaseData } from '../config/database.js';
import { performHealthCheck } from './dbHealthCheck.js';

// Initialize the database when the app starts
export const initApp = async () => {
  try {
    console.log('🚀 Starting application initialization...');

    // Perform comprehensive health check
    console.log('🔄 Performing database health check...');
    const healthCheck = await performHealthCheck();

    if (!healthCheck.connection) {
      throw new Error('Database connection failed: ' + healthCheck.errors.join(', '));
    }

    // Test database connection (legacy)
    console.log('🔄 Testing database connection (legacy)...');
    const connectionSuccess = await testConnection();

    if (!connectionSuccess) {
      throw new Error('Database connection failed');
    }
    
    // Initialize database schema
    console.log('🔄 Initializing database schema...');
    const schemaSuccess = await initializeDatabase();
    
    if (!schemaSuccess) {
      throw new Error('Database schema initialization failed');
    }
    
    // Insert sample data to database
    console.log('🔄 Inserting sample data to database...');
    try {
      const dataSuccess = await insertSampleData();
      if (!dataSuccess) {
        console.warn('⚠️ Initial sample data insertion failed, trying refresh...');
        await refreshDatabaseData();
      }
    } catch (error) {
      console.warn('⚠️ Sample data insertion failed, trying refresh...', error.message);
      await refreshDatabaseData();
    }
    
    console.log('✅ Application initialization completed successfully!');
    console.log('📊 Database is ready for use');
    
    return true;
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    console.error('🔧 Please check your database configuration and try again');
    return false;
  }
};

// Check database health
export const checkDatabaseHealth = async () => {
  try {
    const isHealthy = await testConnection();
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      message: isHealthy ? 'Database connection is working' : 'Database connection failed'
    };
  } catch (error) {
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      message: error.message
    };
  }
};

// Manual database refresh function (for debugging)
export const manualRefreshDatabase = async () => {
  try {
    console.log('🔄 Manual database refresh triggered...');
    await refreshDatabaseData();
    console.log('✅ Manual database refresh completed');
    return { success: true, message: 'Database refreshed successfully' };
  } catch (error) {
    console.error('❌ Manual database refresh failed:', error);
    return { success: false, message: error.message };
  }
};

// Add global debug function for manual refresh
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.refreshDatabase = manualRefreshDatabase;
  console.log('🔧 Debug function available: window.refreshDatabase()');
}
