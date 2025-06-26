import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const OrderView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load order data from database service
  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading order data for ID:', id);

        // Import and use database service
        const { getOrderById } = await import('../services/orderService');
        const orderData = await getOrderById(id);

        if (orderData) {
          console.log('✅ Order loaded:', orderData);
          setOrder(orderData);
        } else {
          console.log('❌ Order not found');
          // Fallback to demo data for display
          setOrder({
            id: id,
            orderReferenceNumber: 'IS-2024-001',
            orderOnboardingDate: '2024-06-20',
            client: 'Acme Corporation',
            typeOfWork: 'Patent Filing',
            dateOfWorkCompletionExpected: '2024-07-20',
            totalInvoiceValue: '245000',
            totalValueGstGovtFees: '44100',
            dateOfPaymentExpected: '2024-07-25',
            dateOfOnboardingVendor: '2024-06-21',
            vendorName: 'Legal Associates',
            currentStatus: 'Completed',
            statusComments: 'Work completed successfully',
            dateOfStatusChange: '2024-07-18',
            dateOfWorkCompletionExpectedFromVendor: '2024-07-15',
            amountToBePaidToVendor: '150000',
            amountPaidToVendor: '150000',
            statusHistory: [
              { status: 'Pending', date: '2024-06-20', description: 'Order created' },
              { status: 'In Progress', date: '2024-06-21', description: 'Vendor assigned' },
              { status: 'Completed', date: '2024-07-18', description: 'Work completed successfully' }
            ]
          });
        }
      } catch (error) {
        console.error('❌ Error loading order:', error);
        // Fallback to demo data
        setOrder({
          id: id,
          orderReferenceNumber: 'IS-2024-001',
          orderOnboardingDate: '2024-06-20',
          client: 'Acme Corporation',
          typeOfWork: 'Patent Filing',
          dateOfWorkCompletionExpected: '2024-07-20',
          totalInvoiceValue: '245000',
          totalValueGstGovtFees: '44100',
          dateOfPaymentExpected: '2024-07-25',
          dateOfOnboardingVendor: '2024-06-21',
          vendorName: 'Legal Associates',
          currentStatus: 'Completed',
          statusComments: 'Work completed successfully',
          dateOfStatusChange: '2024-07-18',
          dateOfWorkCompletionExpectedFromVendor: '2024-07-15',
          amountToBePaidToVendor: '150000',
          amountPaidToVendor: '150000',
          statusHistory: [
            { status: 'Pending', date: '2024-06-20', description: 'Order created' },
            { status: 'In Progress', date: '2024-06-21', description: 'Vendor assigned' },
            { status: 'Completed', date: '2024-07-18', description: 'Work completed successfully' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Processing':
      case 'Shipped':
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
      case 'YET_TO_START':
        return 'bg-yellow-100 text-yellow-800';
      case 'Blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🔄 Deleting order:', id);

      // Import and use database service
      const { deleteOrder } = await import('../services/orderService');
      await deleteOrder(id);

      console.log('✅ Order deleted successfully');
      alert('Order deleted successfully');
      navigate('/orders');
    } catch (error) {
      console.error('❌ Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  const handlePrint = () => {
    navigate(`/orders/${id}/print`);
  };

  const handleExport = async (format) => {
    try {
      console.log(`🔄 Exporting order ${id} as ${format}...`);

      if (format === 'pdf') {
        // Open print page in new window for PDF export
        window.open(`/orders/${id}/print`, '_blank');
      } else if (format === 'excel') {
        // Create Excel export
        const { exportOrderToExcel } = await import('../utils/exportUtils');
        await exportOrderToExcel(order);
      }
    } catch (error) {
      console.error('❌ Error exporting order:', error);
      alert('Failed to export order');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/orders')}
            className="btn-primary"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Orders
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order {order.id}</h1>
              <p className="text-gray-600">View order details and status</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="btn-secondary flex items-center"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
            <div className="relative group">
              <button className="btn-secondary flex items-center">
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Export as Excel
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate(`/orders/${order.id}/edit`)}
              className="btn-primary flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Order
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger flex items-center"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Overview */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Order Overview</h2>
              <div className="flex space-x-2">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(order.priority)}`}>
                  {order.priority} Priority
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Order Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Order Reference:</span>
                    <span className="text-sm font-medium text-gray-900">{order.orderReferenceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Onboarding Date:</span>
                    <span className="text-sm font-medium text-gray-900">{order.orderOnboardingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Client:</span>
                    <span className="text-sm font-medium text-gray-900">{order.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type of Work:</span>
                    <span className="text-sm font-medium text-gray-900">{order.typeOfWork}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expected Completion:</span>
                    <span className="text-sm font-medium text-gray-900">{order.dateOfWorkCompletionExpected}</span>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Financial Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Invoice Value:</span>
                    <span className="text-sm font-medium text-gray-900">₹{parseFloat(order.totalInvoiceValue).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">GST + Govt Fees:</span>
                    <span className="text-sm font-medium text-gray-900">₹{parseFloat(order.totalValueGstGovtFees).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payment Due Date:</span>
                    <span className="text-sm font-medium text-gray-900">{order.dateOfPaymentExpected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vendor Amount:</span>
                    <span className="text-sm font-medium text-gray-900">₹{parseFloat(order.amountToBePaidToVendor).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount Paid to Vendor:</span>
                    <span className="text-sm font-medium text-gray-900">₹{parseFloat(order.amountPaidToVendor).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Vendor Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Vendor Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vendor Name:</span>
                    <span className="text-sm font-medium text-gray-900">{order.vendorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vendor Onboarding:</span>
                    <span className="text-sm font-medium text-gray-900">{order.dateOfOnboardingVendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vendor Expected Completion:</span>
                    <span className="text-sm font-medium text-gray-900">{order.dateOfWorkCompletionExpectedFromVendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Status:</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      order.currentStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.currentStatus === 'Pending with client' ? 'bg-blue-100 text-blue-800' :
                      order.currentStatus === 'Pending with Vendor' ? 'bg-yellow-100 text-yellow-800' :
                      order.currentStatus === 'Blocked' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.currentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status Change Date:</span>
                    <span className="text-sm font-medium text-gray-900">{order.dateOfStatusChange}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Comments */}
            {order.statusComments && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Current Status Comments</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{order.statusComments}</p>
                </div>
              </div>
            )}
          </div>

          {/* Files and Documents */}
          {order.files && Object.keys(order.files).length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(order.files).map(([category, files]) => (
                  <div key={category} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h3>
                    <div className="space-y-2">
                      {Array.isArray(files) ? files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{file.name || `File ${index + 1}`}</span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                        </div>
                      )) : (
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{files.name || 'Document'}</span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/orders/${order.id}/edit`)}
                className="w-full btn-primary flex items-center justify-center"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Order
              </button>
              <button
                onClick={handlePrint}
                className="w-full btn-secondary flex items-center justify-center"
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print Order
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full btn-secondary flex items-center justify-center"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export PDF
              </button>
              <button
                onClick={handleDelete}
                className="w-full btn-danger flex items-center justify-center"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Order
              </button>
            </div>
          </div>

          {/* Status History */}
          {(() => {
            // Parse statusHistory if it's a string, or use as array if already parsed
            let statusHistory = [];
            if (order.statusHistory) {
              if (typeof order.statusHistory === 'string') {
                try {
                  statusHistory = JSON.parse(order.statusHistory);
                } catch (e) {
                  console.warn('Failed to parse statusHistory:', e);
                  statusHistory = [];
                }
              } else if (Array.isArray(order.statusHistory)) {
                statusHistory = order.statusHistory;
              }
            }

            return statusHistory && statusHistory.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>
                <div className="space-y-3">
                  {statusHistory.map((status, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        status.status === 'Completed' ? 'bg-green-500' :
                        status.status === 'In Progress' ? 'bg-blue-500' :
                        status.status === 'Pending' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{status.status}</p>
                      <p className="text-xs text-gray-500">{status.date}</p>
                      {status.description && (
                        <p className="text-xs text-gray-600 mt-1">{status.description}</p>
                      )}
                    </div>
                  </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
    </>
  );
};

export default OrderView;
