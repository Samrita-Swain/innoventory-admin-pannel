import { useState } from 'react';
import {
  UsersIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [selectedWidget, setSelectedWidget] = useState(null);

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 140 },
    { month: 'Mar', revenue: 48000, orders: 130 },
    { month: 'Apr', revenue: 61000, orders: 165 },
    { month: 'May', revenue: 55000, orders: 150 },
    { month: 'Jun', revenue: 67000, orders: 180 },
  ];

  const userActivityData = [
    { name: 'Clients', value: 2847, color: '#3B82F6' },
    { name: 'Vendors', value: 1234, color: '#10B981' },
    { name: 'Sub-admins', value: 15, color: '#8B5CF6' },
  ];

  const orderStatusData = [
    { status: 'Completed', count: 450 },
    { status: 'Processing', count: 230 },
    { status: 'Pending', count: 120 },
    { status: 'Cancelled', count: 45 },
  ];

  // Sample data for dashboard widgets
  const stats = [
    {
      id: 1,
      name: 'Total Clients',
      value: '2,847',
      change: '+12%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'Active Vendors',
      value: '1,234',
      change: '+8%',
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'bg-green-500',
    },
    {
      id: 3,
      name: 'Total Orders',
      value: '15,678',
      change: '+23%',
      changeType: 'increase',
      icon: ShoppingBagIcon,
      color: 'bg-purple-500',
    },
    {
      id: 4,
      name: 'Revenue',
      value: '₹2.4Cr',
      change: '-2%',
      changeType: 'decrease',
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
    },
  ];

  const handleWidgetClick = (widget) => {
    setSelectedWidget(widget);
    // This would typically navigate to a detailed view
    console.log('Widget clicked:', widget.name);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to Innoventory Admin Panel</p>
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
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Revenue & Orders Chart</p>
                <p className="text-sm text-gray-500 mt-1">Interactive chart will be displayed here</p>
              </div>
            </div>
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
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">User Distribution Chart</p>
                <p className="text-sm text-gray-500 mt-1">Pie chart showing user breakdown</p>
              </div>
            </div>
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
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Order Status Chart</p>
              <p className="text-sm text-gray-500 mt-1">Bar chart showing order distribution</p>
            </div>
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
          {[
            { action: 'New client registered', user: 'John Doe', time: '2 minutes ago' },
            { action: 'Order completed', user: 'ABC Corp', time: '15 minutes ago' },
            { action: 'Vendor approved', user: 'XYZ Supplies', time: '1 hour ago' },
            { action: 'Payment received', user: 'Tech Solutions', time: '2 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.user}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
