/**
 * Seeding API Service - Frontend interface for data seeding operations
 */

import {
  seedAllData,
  seedVendors,
  seedClients,
  seedTypeOfWork,
  seedSubAdmins,
  seedOrders,
  getSeedingStatus,
  clearSeededData
} from './seedService.js';

/**
 * Seeding API class for frontend consumption
 */
export class SeedingAPI {
  
  /**
   * Seed all data categories
   */
  static async seedAll() {
    try {
      console.log('🚀 API: Starting comprehensive data seeding...');
      const result = await seedAllData();
      
      return {
        success: result.success,
        message: result.summary,
        data: result.results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ API: Error seeding all data:', error);
      return {
        success: false,
        message: `Seeding failed: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Seed vendors only
   */
  static async seedVendorsOnly() {
    try {
      console.log('🏢 API: Seeding vendors...');
      const success = await seedVendors();
      
      return {
        success,
        message: success ? 'Vendors seeded successfully' : 'Failed to seed vendors',
        category: 'vendors',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ API: Error seeding vendors:', error);
      return {
        success: false,
        message: `Vendor seeding failed: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Seed clients only
   */
  static async seedClientsOnly() {
    try {
      console.log('👥 API: Seeding clients...');
      const success = await seedClients();
      
      return {
        success,
        message: success ? 'Clients seeded successfully' : 'Failed to seed clients',
        category: 'clients',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ API: Error seeding clients:', error);
      return {
        success: false,
        message: `Client seeding failed: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Seed type of work only
   */
  static async seedTypeOfWorkOnly() {
    try {
      console.log('🔧 API: Seeding type of work...');
      const success = await seedTypeOfWork();
      
      return {
        success,
        message: success ? 'Type of work seeded successfully' : 'Failed to seed type of work',
        category: 'typeOfWork',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ API: Error seeding type of work:', error);
      return {
        success: false,
        message: `Type of work seeding failed: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Seed sub-admins only
   */
  static async seedSubAdminsOnly() {
    try {
      console.log('👨‍💼 API: Seeding sub-admins...');
      const success = await seedSubAdmins();

      return {
        success,
        message: success ? 'Sub-admins seeded successfully' : 'Failed to seed sub-admins',
        category: 'subAdmins',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ API: Error seeding sub-admins:', error);
      return {
        success: false,
        message: `Sub-admin seeding failed: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Seed orders only
   */
  static async seedOrdersOnly() {
    try {
      console.log('📋 API: Seeding orders...');
      const success = await seedOrders();

      return {
        success,
        message: success ? 'Orders seeded successfully' : 'Failed to seed orders',
        category: 'orders',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ API: Error seeding orders:', error);
      return {
        success: false,
        message: `Order seeding failed: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get current seeding status
   */
  static async getStatus() {
    try {
      console.log('📊 API: Getting seeding status...');
      const status = await getSeedingStatus();
      
      if (status) {
        return {
          success: true,
          message: 'Status retrieved successfully',
          data: status,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          message: 'Failed to retrieve status',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('❌ API: Error getting status:', error);
      return {
        success: false,
        message: `Status retrieval failed: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Clear all seeded data
   */
  static async clearData() {
    try {
      console.log('🧹 API: Clearing seeded data...');
      const success = await clearSeededData();
      
      return {
        success,
        message: success ? 'Seeded data cleared successfully' : 'Failed to clear seeded data',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ API: Error clearing data:', error);
      return {
        success: false,
        message: `Data clearing failed: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Check if seeding is needed (based on data counts)
   */
  static async checkSeedingNeeded() {
    try {
      const status = await getSeedingStatus();
      
      if (!status) {
        return {
          success: false,
          message: 'Could not determine seeding status',
          needsSeeding: true
        };
      }

      // Consider seeding needed if any category has less than recommended records
      const needsSeeding = status.vendors < 3 || status.clients < 3 ||
                          status.typeOfWork < 5 || status.subAdmins < 2 || status.orders < 2;

      return {
        success: true,
        needsSeeding,
        message: needsSeeding ? 'Database needs seeding' : 'Database has sufficient data',
        currentCounts: status,
        recommendations: needsSeeding ? [
          status.vendors < 3 ? 'Add more vendors' : null,
          status.clients < 3 ? 'Add more clients' : null,
          status.typeOfWork < 5 ? 'Add more work types' : null,
          status.subAdmins < 2 ? 'Add sub-admins' : null,
          status.orders < 2 ? 'Add sample orders' : null
        ].filter(Boolean) : [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ API: Error checking seeding needs:', error);
      return {
        success: false,
        message: `Seeding check failed: ${error.message}`,
        needsSeeding: true,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Smart seeding - only seed categories that need data
   */
  static async smartSeed() {
    try {
      console.log('🧠 API: Starting smart seeding...');
      
      const check = await this.checkSeedingNeeded();
      
      if (!check.needsSeeding) {
        return {
          success: true,
          message: 'No seeding needed - database has sufficient data',
          skipped: true,
          currentCounts: check.currentCounts,
          timestamp: new Date().toISOString()
        };
      }

      // Perform targeted seeding based on what's needed
      const results = {};

      if (check.currentCounts.vendors < 3) {
        results.vendors = await seedVendors();
      }

      if (check.currentCounts.clients < 3) {
        results.clients = await seedClients();
      }

      if (check.currentCounts.typeOfWork < 5) {
        results.typeOfWork = await seedTypeOfWork();
      }

      if (check.currentCounts.subAdmins < 2) {
        results.subAdmins = await seedSubAdmins();
      }

      if (check.currentCounts.orders < 2) {
        results.orders = await seedOrders();
      }

      const successCount = Object.values(results).filter(Boolean).length;
      const totalCount = Object.keys(results).length;

      return {
        success: successCount === totalCount,
        message: `Smart seeding completed: ${successCount}/${totalCount} categories seeded`,
        results,
        seededCategories: Object.keys(results),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ API: Error in smart seeding:', error);
      return {
        success: false,
        message: `Smart seeding failed: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Export individual functions for direct use
export {
  seedAllData,
  seedVendors,
  seedClients,
  seedTypeOfWork,
  seedSubAdmins,
  getSeedingStatus,
  clearSeededData
};
