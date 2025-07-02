import { useState, useEffect } from 'react';
import {
  UsersIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
// Dynamic imports for better error handling
const loadDashboardService = async () => {
  try {
    return await import('../services/dashboardService');
  } catch (error) {
    console.error('Failed to load dashboard service:', error);
    return null;
  }
};

const Dashboard = () => {
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic data states
  const [dashboardStats, setDashboardStats] = useState(null);
  const [userDistribution, setUserDistribution] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading dashboard data...');

      // Load dashboard service dynamically
      const dashboardService = await loadDashboardService();

      if (!dashboardService) {
        throw new Error('Dashboard service failed to load');
      }

      const {
        getDashboardStats,
        getUserDistribution,
        getOrderStatusDistribution,
        getRecentActivity,
        getMonthlyRevenue
      } = dashboardService;

      // Load data with individual error handling
      let stats = null;
      let userDist = [];
      let orderStatus = [];
      let activity = [];
      let revenue = [];

      try {
        stats = await getDashboardStats();
        console.log('✅ Dashboard stats loaded');
      } catch (err) {
        console.warn('⚠️ Failed to load dashboard stats:', err.message);
        // Provide fallback stats
        stats = {
          totalClients: { value: 0, change: '+0%', changeType: 'neutral' },
          activeVendors: { value: 0, change: '+0%', changeType: 'neutral' },
          totalOrders: { value: 0, change: '+0%', changeType: 'neutral' },
          totalRevenue: { value: 0, change: '+0%', changeType: 'neutral' }
        };
      }

      try {
        userDist = await getUserDistribution();
        console.log('✅ User distribution loaded');
      } catch (err) {
        console.warn('⚠️ Failed to load user distribution:', err.message);
      }

      try {
        orderStatus = await getOrderStatusDistribution();
        console.log('✅ Order status loaded');
      } catch (err) {
        console.warn('⚠️ Failed to load order status:', err.message);
      }

      try {
        activity = await getRecentActivity();
        console.log('✅ Recent activity loaded');
      } catch (err) {
        console.warn('⚠️ Failed to load recent activity:', err.message);
      }

      try {
        revenue = await getMonthlyRevenue();
        console.log('✅ Revenue data loaded');
      } catch (err) {
        console.warn('⚠️ Failed to load revenue data:', err.message);
      }

      setDashboardStats(stats);
      setUserDistribution(userDist);
      setOrderStatusData(orderStatus);
      setRecentActivity(activity);
      setRevenueData(revenue);
      setError(null);

      console.log('✅ Dashboard data loaded successfully');
    } catch (err) {
      console.error('❌ Critical error loading dashboard:', err);
      setError('Failed to load dashboard: ' + err.message);

      // Set fallback data to prevent white screen
      setDashboardStats({
        totalClients: { value: 0, change: '+0%', changeType: 'neutral' },
        activeVendors: { value: 0, change: '+0%', changeType: 'neutral' },
        totalOrders: { value: 0, change: '+0%', changeType: 'neutral' },
        totalRevenue: { value: 0, change: '+0%', changeType: 'neutral' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a small delay to ensure the component is mounted
    const timer = setTimeout(() => {
      loadDashboardData();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Format number with commas
  const formatNumber = (num) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return num.toLocaleString();
    return num.toString();
  };

  // Create stats array from dynamic data
  const stats = dashboardStats ? [
    {
      id: 1,
      name: 'Total Clients',
      value: formatNumber(dashboardStats.totalClients.value),
      change: dashboardStats.totalClients.change,
      changeType: dashboardStats.totalClients.changeType,
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'Active Vendors',
      value: formatNumber(dashboardStats.activeVendors.value),
      change: dashboardStats.activeVendors.change,
      changeType: dashboardStats.activeVendors.changeType,
      icon: UserGroupIcon,
      color: 'bg-green-500',
    },
    {
      id: 3,
      name: 'Total Orders',
      value: formatNumber(dashboardStats.totalOrders.value),
      change: dashboardStats.totalOrders.change,
      changeType: dashboardStats.totalOrders.changeType,
      icon: ShoppingBagIcon,
      color: 'bg-purple-500',
    },
    {
      id: 4,
      name: 'Revenue',
      value: formatNumber(dashboardStats.totalRevenue.value),
      change: dashboardStats.totalRevenue.change,
      changeType: dashboardStats.totalRevenue.changeType,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
    },
  ] : [];

  const handleWidgetClick = (widget) => {
    setSelectedWidget(widget);
    // This would typically navigate to a detailed view
    console.log('Widget clicked:', widget.name);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-red-600">Error loading dashboard data</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to Innoventory Admin Panel</p>
        <button
          onClick={loadDashboardData}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            onClick={() => handleWidgetClick(stat)}
            className="group relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex items-center">
              <div className={`p-3 rounded-xl ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-200">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-200">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'increase' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1 group-hover:scale-110 transition-transform duration-200" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1 group-hover:scale-110 transition-transform duration-200" />
                  )}
                  <span className={`text-sm font-semibold ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
            </div>

            {/* Hover indicator */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">Revenue & Orders Overview</h3>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200"></div>
          </div>
          <div className="h-64 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            {revenueData.length > 0 ? (
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {revenueData.slice(0, 3).map((data, index) => (
                    <div key={index} className="text-center">
                      <p className="text-xs text-gray-500">{data.month}</p>
                      <p className="text-sm font-semibold text-gray-900">₹{(data.revenue / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-blue-600">{data.orders} orders</p>
                    </div>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-500">
                  Last 6 months data available
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">No Revenue Data</p>
                  <p className="text-sm text-gray-500 mt-1">Orders table not available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Distribution Chart */}
        <div className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">User Distribution</h3>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200"></div>
          </div>
          <div className="h-64 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            {userDistribution.length > 0 ? (
              <div className="p-4 space-y-4">
                {userDistribution.map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: user.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{user.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Users</span>
                    <span className="text-sm font-bold text-gray-900">
                      {userDistribution.reduce((sum, user) => sum + user.value, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">No User Data</p>
                  <p className="text-sm text-gray-500 mt-1">Loading user distribution...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Chart */}
        <div className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">Order Status Distribution</h3>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200"></div>
          </div>
          <div className="h-64">
            {orderStatusData.length > 0 ? (
              <div className="p-4 space-y-3">
                {orderStatusData.map((status, index) => {
                  const total = orderStatusData.reduce((sum, s) => sum + s.count, 0);
                  const percentage = total > 0 ? ((status.count / total) * 100).toFixed(1) : 0;
                  const colors = ['bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-red-500'];

                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${colors[index % colors.length]}`}></div>
                        <span className="text-sm font-medium text-gray-700">{status.status}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">{status.count}</span>
                        <span className="text-xs text-gray-500 ml-2">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Orders</span>
                    <span className="text-sm font-bold text-gray-900">
                      {orderStatusData.reduce((sum, s) => sum + s.count, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">No Order Data</p>
                  <p className="text-sm text-gray-500 mt-1">Orders table not available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">Monthly Revenue Trend</h3>
            <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200"></div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Revenue Trend Chart</p>
              <p className="text-sm text-gray-500 mt-1">Area chart showing monthly trends</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
