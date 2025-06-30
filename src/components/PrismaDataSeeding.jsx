import React, { useState, useEffect } from 'react';
import { 
  seedAllData, 
  seedClients, 
  seedSubAdmins, 
  getDataCounts, 
  checkSeedingNeeded, 
  smartSeed, 
  clearRecentData 
} from '../services/prismaSeeding.js';

/**
 * Prisma Data Seeding Component - Clean, reliable seeding interface
 */
const PrismaDataSeeding = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [seedingNeeded, setSeedingNeeded] = useState(null);

  // Load initial status
  useEffect(() => {
    loadStatus();
    checkSeedingNeeds();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await getDataCounts();
      if (response.success) {
        setStatus(response.data);
      }
    } catch (error) {
      console.error('Error loading status:', error);
    }
  };

  const checkSeedingNeeds = async () => {
    try {
      const response = await checkSeedingNeeded();
      setSeedingNeeded(response);
    } catch (error) {
      console.error('Error checking seeding needs:', error);
    }
  };

  const addResult = (result) => {
    setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const handleSeedAll = async () => {
    setLoading(true);
    try {
      const result = await seedAllData();
      addResult({
        success: result.success,
        message: result.success ? `Added ${result.totalAdded} records` : `Error: ${result.error}`,
        timestamp: new Date().toISOString(),
        category: 'all'
      });
      await loadStatus();
      await checkSeedingNeeds();
    } catch (error) {
      addResult({
        success: false,
        message: `Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        category: 'all'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSmartSeed = async () => {
    setLoading(true);
    try {
      const result = await smartSeed();
      addResult({
        success: result.success,
        message: result.message,
        timestamp: new Date().toISOString(),
        category: 'smart',
        skipped: result.skipped
      });
      await loadStatus();
      await checkSeedingNeeds();
    } catch (error) {
      addResult({
        success: false,
        message: `Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        category: 'smart'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedCategory = async (category, count = 5) => {
    setLoading(true);
    try {
      let result;
      switch (category) {
        case 'clients':
          result = await seedClients(count);
          break;
        case 'subAdmins':
          result = await seedSubAdmins(count);
          break;
        default:
          throw new Error('Unknown category');
      }
      
      addResult({
        success: result.success,
        message: result.success ? 
          `Seeded ${result.seeded}/${result.total} ${category}` : 
          `Error seeding ${category}: ${result.error}`,
        timestamp: new Date().toISOString(),
        category
      });
      await loadStatus();
      await checkSeedingNeeds();
    } catch (error) {
      addResult({
        success: false,
        message: `Error seeding ${category}: ${error.message}`,
        timestamp: new Date().toISOString(),
        category
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to clear recent seeded data? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await clearRecentData();
      addResult({
        success: result.success,
        message: result.success ? 
          `Cleared ${result.deleted.clients} clients and ${result.deleted.subAdmins} sub-admins` : 
          `Error: ${result.error}`,
        timestamp: new Date().toISOString(),
        category: 'clear'
      });
      await loadStatus();
      await checkSeedingNeeds();
    } catch (error) {
      addResult({
        success: false,
        message: `Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        category: 'clear'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Prisma Database Seeding</h2>
        <p className="text-gray-600">Clean, reliable data seeding using Prisma ORM</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {status && (
          <>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Users</h3>
              <p className="text-2xl font-bold text-blue-600">{status.users}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Customers</h3>
              <p className="text-2xl font-bold text-green-600">{status.customers}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Vendors</h3>
              <p className="text-2xl font-bold text-purple-600">{status.vendors}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900">Clients</h3>
              <p className="text-2xl font-bold text-orange-600">{status.clients}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-indigo-900">Sub Admins</h3>
              <p className="text-2xl font-bold text-indigo-600">{status.subAdmins}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">Orders</h3>
              <p className="text-2xl font-bold text-gray-600">{status.orders}</p>
            </div>
          </>
        )}
      </div>

      {/* Seeding Recommendations */}
      {seedingNeeded && seedingNeeded.needsSeeding && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">🌱 Seeding Recommended</h3>
          <p className="text-yellow-700 mb-2">{seedingNeeded.message}</p>
          {seedingNeeded.recommendations && seedingNeeded.recommendations.length > 0 && (
            <ul className="list-disc list-inside text-yellow-700 text-sm">
              {seedingNeeded.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={handleSmartSeed}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Processing...' : '🧠 Smart Seed'}
        </button>
        
        <button
          onClick={handleSeedAll}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Processing...' : '🌱 Seed All Data'}
        </button>
        
        <button
          onClick={handleClearData}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Processing...' : '🧹 Clear Recent'}
        </button>

        <button
          onClick={() => { loadStatus(); checkSeedingNeeds(); }}
          disabled={loading}
          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Individual Category Seeding */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Seed Individual Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => handleSeedCategory('clients', 5)}
            disabled={loading}
            className="bg-orange-100 hover:bg-orange-200 disabled:bg-gray-100 text-orange-800 px-3 py-2 rounded font-medium transition-colors"
          >
            👥 Clients (5)
          </button>
          <button
            onClick={() => handleSeedCategory('subAdmins', 3)}
            disabled={loading}
            className="bg-indigo-100 hover:bg-indigo-200 disabled:bg-gray-100 text-indigo-800 px-3 py-2 rounded font-medium transition-colors"
          >
            👨‍💼 Sub Admins (3)
          </button>
          <button
            onClick={() => handleSeedCategory('clients', 10)}
            disabled={loading}
            className="bg-orange-200 hover:bg-orange-300 disabled:bg-gray-100 text-orange-800 px-3 py-2 rounded font-medium transition-colors"
          >
            👥 Clients (10)
          </button>
          <button
            onClick={() => handleSeedCategory('subAdmins', 5)}
            disabled={loading}
            className="bg-indigo-200 hover:bg-indigo-300 disabled:bg-gray-100 text-indigo-800 px-3 py-2 rounded font-medium transition-colors"
          >
            👨‍💼 Sub Admins (5)
          </button>
        </div>
      </div>

      {/* Results Log */}
      {results.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Operations</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-sm ${
                  result.success
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{result.message}</span>
                    {result.skipped && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        SKIPPED
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs opacity-75">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                    <div className="text-xs opacity-75 capitalize">
                      {result.category}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrismaDataSeeding;
