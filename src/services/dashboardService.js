import { neon } from '@neondatabase/serverless';

// Get database URL from environment variables
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;
const sql = neon(DATABASE_URL);

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    console.log('🔄 Fetching dashboard statistics...');

    // Get counts from all tables
    const [clientsCount, vendorsCount, ordersCount, typeOfWorkCount] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM clients`,
      sql`SELECT COUNT(*) as count FROM vendors WHERE status = 'Active'`,
      sql`SELECT COUNT(*) as count FROM orders`,
      sql`SELECT COUNT(*) as count FROM type_of_work WHERE "isActive" = true`
    ]);

    // Get revenue data (if orders table has revenue/amount field)
    let totalRevenue = 0;
    try {
      const revenueResult = await sql`
        SELECT SUM(CAST(total_amount AS DECIMAL)) as total_revenue 
        FROM orders 
        WHERE status = 'Completed'
      `;
      totalRevenue = revenueResult[0]?.total_revenue || 0;
    } catch (error) {
      console.warn('Revenue calculation failed, using 0:', error.message);
    }

    // Calculate growth percentages (comparing with previous month)
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const [lastMonthClients, lastMonthVendors, lastMonthOrders] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM clients WHERE created_at < ${currentMonth}`,
      sql`SELECT COUNT(*) as count FROM vendors WHERE created_at < ${currentMonth} AND status = 'Active'`,
      sql`SELECT COUNT(*) as count FROM orders WHERE created_at < ${currentMonth}`
    ]);

    // Calculate growth percentages
    const clientsGrowth = calculateGrowth(clientsCount[0].count, lastMonthClients[0].count);
    const vendorsGrowth = calculateGrowth(vendorsCount[0].count, lastMonthVendors[0].count);
    const ordersGrowth = calculateGrowth(ordersCount[0].count, lastMonthOrders[0].count);

    const stats = {
      totalClients: {
        value: clientsCount[0].count,
        change: clientsGrowth.percentage,
        changeType: clientsGrowth.type
      },
      activeVendors: {
        value: vendorsCount[0].count,
        change: vendorsGrowth.percentage,
        changeType: vendorsGrowth.type
      },
      totalOrders: {
        value: ordersCount[0].count,
        change: ordersGrowth.percentage,
        changeType: ordersGrowth.type
      },
      totalRevenue: {
        value: totalRevenue,
        change: '+0%', // Would need historical data for accurate calculation
        changeType: 'increase'
      },
      activeTypeOfWork: typeOfWorkCount[0].count
    };

    console.log('✅ Dashboard statistics fetched:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error fetching dashboard statistics:', error);
    throw error;
  }
};

// Get user distribution data
export const getUserDistribution = async () => {
  try {
    console.log('🔄 Fetching user distribution...');

    const [clients, vendors, subAdmins] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM clients`,
      sql`SELECT COUNT(*) as count FROM vendors`,
      sql`SELECT COUNT(*) as count FROM users WHERE role = 'sub_admin'`
    ]);

    const distribution = [
      { name: 'Clients', value: clients[0].count, color: '#3B82F6' },
      { name: 'Vendors', value: vendors[0].count, color: '#10B981' },
      { name: 'Sub-admins', value: subAdmins[0].count, color: '#8B5CF6' }
    ];

    console.log('✅ User distribution fetched:', distribution);
    return distribution;
  } catch (error) {
    console.error('❌ Error fetching user distribution:', error);
    throw error;
  }
};

// Get order status distribution
export const getOrderStatusDistribution = async () => {
  try {
    console.log('🔄 Fetching order status distribution...');

    const orderStatuses = await sql`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status 
      ORDER BY count DESC
    `;

    const distribution = orderStatuses.map(status => ({
      status: status.status || 'Unknown',
      count: status.count
    }));

    console.log('✅ Order status distribution fetched:', distribution);
    return distribution;
  } catch (error) {
    console.error('❌ Error fetching order status distribution:', error);
    // Return empty array if orders table doesn't exist
    return [];
  }
};

// Get recent activity
export const getRecentActivity = async () => {
  try {
    console.log('🔄 Fetching recent activity...');

    // Get recent clients, vendors, and orders
    const [recentClients, recentVendors, recentOrders] = await Promise.all([
      sql`
        SELECT company_name, created_at, 'client' as type 
        FROM clients 
        ORDER BY created_at DESC 
        LIMIT 5
      `,
      sql`
        SELECT company_name, created_at, 'vendor' as type 
        FROM vendors 
        ORDER BY created_at DESC 
        LIMIT 5
      `,
      sql`
        SELECT id, created_at, status, 'order' as type 
        FROM orders 
        ORDER BY created_at DESC 
        LIMIT 5
      `.catch(() => []) // Handle case where orders table doesn't exist
    ]);

    // Combine and sort all activities
    const allActivities = [
      ...recentClients.map(client => ({
        action: 'New client registered',
        user: client.company_name,
        time: formatTimeAgo(client.created_at),
        type: 'client'
      })),
      ...recentVendors.map(vendor => ({
        action: 'New vendor registered',
        user: vendor.company_name,
        time: formatTimeAgo(vendor.created_at),
        type: 'vendor'
      })),
      ...(recentOrders || []).map(order => ({
        action: `Order ${order.status.toLowerCase()}`,
        user: `Order #${order.id}`,
        time: formatTimeAgo(order.created_at),
        type: 'order'
      }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);

    console.log('✅ Recent activity fetched:', allActivities.length, 'items');
    return allActivities;
  } catch (error) {
    console.error('❌ Error fetching recent activity:', error);
    return [];
  }
};

// Get monthly revenue data
export const getMonthlyRevenue = async () => {
  try {
    console.log('🔄 Fetching monthly revenue data...');

    const monthlyData = await sql`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as orders,
        COALESCE(SUM(CAST(total_amount AS DECIMAL)), 0) as revenue
      FROM orders 
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 6
    `;

    const formattedData = monthlyData.map(data => ({
      month: new Date(data.month).toLocaleDateString('en-US', { month: 'short' }),
      revenue: parseFloat(data.revenue) || 0,
      orders: data.orders
    })).reverse();

    console.log('✅ Monthly revenue data fetched:', formattedData);
    return formattedData;
  } catch (error) {
    console.error('❌ Error fetching monthly revenue data:', error);
    // Return empty array if orders table doesn't exist or has issues
    return [];
  }
};

// Helper function to calculate growth percentage
const calculateGrowth = (current, previous) => {
  if (previous === 0) {
    return { percentage: current > 0 ? '+100%' : '0%', type: current > 0 ? 'increase' : 'neutral' };
  }
  
  const growth = ((current - previous) / previous) * 100;
  const percentage = growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
  const type = growth > 0 ? 'increase' : growth < 0 ? 'decrease' : 'neutral';
  
  return { percentage, type };
};

// Helper function to format time ago
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};
