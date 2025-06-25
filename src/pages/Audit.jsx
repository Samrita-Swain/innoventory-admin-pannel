import { useState } from 'react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const Audit = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  // Sample audit data
  const usageStats = {
    clients: {
      totalUsers: 2847,
      activeUsers: 1923,
      sessionsToday: 456,
      avgSessionTime: '12m 34s',
    },
    vendors: {
      totalUsers: 1234,
      activeUsers: 892,
      sessionsToday: 234,
      avgSessionTime: '8m 45s',
    },
    subAdmins: {
      totalUsers: 15,
      activeUsers: 12,
      sessionsToday: 45,
      avgSessionTime: '45m 12s',
    },
  };

  const mostUsedFeatures = [
    { feature: 'Dashboard', usage: 2456, percentage: 35 },
    { feature: 'Order Management', usage: 1890, percentage: 27 },
    { feature: 'Client Directory', usage: 1234, percentage: 18 },
    { feature: 'Vendor Management', usage: 987, percentage: 14 },
    { feature: 'Reports', usage: 432, percentage: 6 },
  ];

  const recentActivity = [
    { user: 'John Doe (Client)', action: 'Viewed Dashboard', timestamp: '2 minutes ago', ip: '192.168.1.100' },
    { user: 'ABC Supplies (Vendor)', action: 'Updated Profile', timestamp: '5 minutes ago', ip: '192.168.1.101' },
    { user: 'Admin User (Sub-admin)', action: 'Generated Report', timestamp: '10 minutes ago', ip: '192.168.1.102' },
    { user: 'Global Tech (Client)', action: 'Created Order', timestamp: '15 minutes ago', ip: '192.168.1.103' },
    { user: 'XYZ Manufacturing (Vendor)', action: 'Uploaded Documents', timestamp: '20 minutes ago', ip: '192.168.1.104' },
  ];

  const handleViewDetails = (userType) => {
    console.log(`Viewing detailed analytics for ${userType}`);
    // This would typically open a detailed view or navigate to a specific page
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Audit & Analytics</h1>
        <p className="mt-2 text-gray-600">Monitor portal usage and user activity</p>
      </div>

      {/* Time Period Selector */}
      <div className="flex space-x-4">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="24hours">Last 24 Hours</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      {/* Usage Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clients Usage */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Client Usage</h3>
            <UsersIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Users:</span>
              <span className="font-medium">{usageStats.clients.totalUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Users:</span>
              <span className="font-medium text-green-600">{usageStats.clients.activeUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sessions Today:</span>
              <span className="font-medium">{usageStats.clients.sessionsToday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Session Time:</span>
              <span className="font-medium">{usageStats.clients.avgSessionTime}</span>
            </div>
          </div>
          <button
            onClick={() => handleViewDetails('clients')}
            className="mt-4 w-full btn-secondary flex items-center justify-center"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            View Details
          </button>
        </div>

        {/* Vendors Usage */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vendor Usage</h3>
            <UserGroupIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Users:</span>
              <span className="font-medium">{usageStats.vendors.totalUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Users:</span>
              <span className="font-medium text-green-600">{usageStats.vendors.activeUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sessions Today:</span>
              <span className="font-medium">{usageStats.vendors.sessionsToday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Session Time:</span>
              <span className="font-medium">{usageStats.vendors.avgSessionTime}</span>
            </div>
          </div>
          <button
            onClick={() => handleViewDetails('vendors')}
            className="mt-4 w-full btn-secondary flex items-center justify-center"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            View Details
          </button>
        </div>

        {/* Sub-admins Usage */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sub-admin Usage</h3>
            <DocumentTextIcon className="h-8 w-8 text-purple-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Users:</span>
              <span className="font-medium">{usageStats.subAdmins.totalUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Users:</span>
              <span className="font-medium text-green-600">{usageStats.subAdmins.activeUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sessions Today:</span>
              <span className="font-medium">{usageStats.subAdmins.sessionsToday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Session Time:</span>
              <span className="font-medium">{usageStats.subAdmins.avgSessionTime}</span>
            </div>
          </div>
          <button
            onClick={() => handleViewDetails('sub-admins')}
            className="mt-4 w-full btn-secondary flex items-center justify-center"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            View Details
          </button>
        </div>
      </div>

      {/* Most Used Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Features</h3>
          <div className="space-y-4">
            {mostUsedFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{feature.feature}</span>
                    <span className="text-sm text-gray-500">{feature.usage.toLocaleString()} uses</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${feature.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>{activity.timestamp}</span>
                    <span className="mx-2">•</span>
                    <span>{activity.ip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audit;
