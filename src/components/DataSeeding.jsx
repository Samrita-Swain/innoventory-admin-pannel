import React, { useState, useEffect } from 'react';
import { SeedingAPI } from '../services/seedingAPI.js';

/**
 * Data Seeding Component - Frontend interface for seeding operations
 */
const DataSeeding = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [seedingNeeded, setSeedingNeeded] = useState(null);

  // Load initial status
  useEffect(() => {
    loadStatus();
    checkSeedingNeeded();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await SeedingAPI.getStatus();
      if (response.success) {
        setStatus(response.data);
      }
    } catch (error) {
      console.error('Error loading status:', error);
    }
  };

  const checkSeedingNeeded = async () => {
    try {
      const response = await SeedingAPI.checkSeedingNeeded();
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
      const result = await SeedingAPI.seedAll();
      addResult(result);
      await loadStatus();
      await checkSeedingNeeded();
    } catch (error) {
      addResult({
        success: false,
        message: `Error: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSmartSeed = async () => {
    setLoading(true);
    try {
      const result = await SeedingAPI.smartSeed();
      addResult(result);
      await loadStatus();
      await checkSeedingNeeded();
    } catch (error) {
      addResult({
        success: false,
        message: `Error: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedCategory = async (category) => {
    setLoading(true);
    try {
      let result;
      switch (category) {
        case 'vendors':
          result = await SeedingAPI.seedVendorsOnly();
          break;
        case 'clients':
          result = await SeedingAPI.seedClientsOnly();
          break;
        case 'typeOfWork':
          result = await SeedingAPI.seedTypeOfWorkOnly();
          break;
        case 'subAdmins':
          result = await SeedingAPI.seedSubAdminsOnly();
          break;
        default:
          throw new Error('Unknown category');
      }
      addResult(result);
      await loadStatus();
      await checkSeedingNeeded();
    } catch (error) {
      addResult({
        success: false,
        message: `Error seeding ${category}: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to clear all seeded data? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await SeedingAPI.clearData();
      addResult(result);
      await loadStatus();
      await checkSeedingNeeded();
    } catch (error) {
      addResult({
        success: false,
        message: `Error: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Database Seeding</h2>
        <p className="text-gray-600">Manage sample data for testing and development</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {status && (
          <>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Vendors</h3>
              <p className="text-2xl font-bold text-blue-600">{status.vendors}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Clients</h3>
              <p className="text-2xl font-bold text-green-600">{status.clients}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Work Types</h3>
              <p className="text-2xl font-bold text-purple-600">{status.typeOfWork}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900">Sub Admins</h3>
              <p className="text-2xl font-bold text-orange-600">{status.subAdmins}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
          {loading ? 'Processing...' : '🧹 Clear Data'}
        </button>
      </div>

      {/* Individual Category Seeding */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Seed Individual Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => handleSeedCategory('vendors')}
            disabled={loading}
            className="bg-blue-100 hover:bg-blue-200 disabled:bg-gray-100 text-blue-800 px-3 py-2 rounded font-medium transition-colors"
          >
            🏢 Vendors
          </button>
          <button
            onClick={() => handleSeedCategory('clients')}
            disabled={loading}
            className="bg-green-100 hover:bg-green-200 disabled:bg-gray-100 text-green-800 px-3 py-2 rounded font-medium transition-colors"
          >
            👥 Clients
          </button>
          <button
            onClick={() => handleSeedCategory('typeOfWork')}
            disabled={loading}
            className="bg-purple-100 hover:bg-purple-200 disabled:bg-gray-100 text-purple-800 px-3 py-2 rounded font-medium transition-colors"
          >
            🔧 Work Types
          </button>
          <button
            onClick={() => handleSeedCategory('subAdmins')}
            disabled={loading}
            className="bg-orange-100 hover:bg-orange-200 disabled:bg-gray-100 text-orange-800 px-3 py-2 rounded font-medium transition-colors"
          >
            👨‍💼 Sub Admins
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
                  <span className="font-medium">{result.message}</span>
                  <span className="text-xs opacity-75">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {result.error && (
                  <div className="text-xs mt-1 opacity-75">{result.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSeeding;
