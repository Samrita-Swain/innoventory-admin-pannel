import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  PrinterIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const OrderView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample order data - in real app, this would come from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleOrder = {
        id: id || 'ORD-001',
        orderReferenceNumber: 'IS-1703845200000',
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
        uploadedFiles: {
          orderFriendlyImage: [
            { name: 'order_image_1.jpg', url: '/uploads/order_image_1.jpg' }
          ],
          documentsProvidedByOrder: [
            { name: 'client_requirements.pdf', url: '/uploads/client_requirements.pdf' },
            { name: 'specifications.docx', url: '/uploads/specifications.docx' }
          ],
          invoiceForCustomer: [
            { name: 'customer_invoice_IS-1703845200000.pdf', url: '/uploads/customer_invoice.pdf' }
          ],
          documentsProvidedByVendor: [
            { name: 'vendor_documents.pdf', url: '/uploads/vendor_documents.pdf' }
          ],
          invoiceFromVendor: [
            { name: 'vendor_invoice_001.pdf', url: '/uploads/vendor_invoice.pdf' }
          ]
        },
        statusHistory: [
          {
            date: '2024-06-20',
            oldStatus: '',
            newStatus: 'Yet to start',
            comment: 'Order created and onboarded',
            timestamp: '2024-06-20 10:30:00'
          },
          {
            date: '2024-06-21',
            oldStatus: 'Yet to start',
            newStatus: 'Pending with client',
            comment: 'Waiting for additional client documents',
            timestamp: '2024-06-21 14:15:00'
          },
          {
            date: '2024-06-25',
            oldStatus: 'Pending with client',
            newStatus: 'Pending with Vendor',
            comment: 'All documents received, forwarded to vendor',
            timestamp: '2024-06-25 09:45:00'
          },
          {
            date: '2024-07-18',
            oldStatus: 'Pending with Vendor',
            newStatus: 'Completed',
            comment: 'Work completed successfully, all deliverables received',
            timestamp: '2024-07-18 16:20:00'
          }
        ],
        documents: [
          { name: 'Purchase Order.pdf', size: '245 KB', uploadDate: '2024-06-20' },
          { name: 'Delivery Receipt.pdf', size: '156 KB', uploadDate: '2024-06-25' }
        ]
      };
      setOrder(sampleOrder);
      setLoading(false);
    }, 500);
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Processing':
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            <button className="btn-secondary flex items-center">
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
            <button className="btn-secondary flex items-center">
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => navigate(`/orders/${order.id}/edit`)}
              className="btn-primary flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Order
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
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Parties</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Client:</span>
                    <span className="text-sm font-medium text-gray-900">{order.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vendor:</span>
                    <span className="text-sm font-medium text-gray-900">{order.vendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payment Status:</span>
                    <span className={`text-sm font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="text-lg font-bold text-gray-900">{order.amount}</span>
                  </div>
                </div>
              </div>
            </div>

            {order.description && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-sm text-gray-700">{order.description}</p>
              </div>
            )}
          </div>

          {/* Document Management */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Document Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Order Friendly Image */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Friendly Image</h3>
                <div className="space-y-2">
                  {order.uploadedFiles?.orderFriendlyImage?.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </a>
                    </div>
                  ))}
                  {(!order.uploadedFiles?.orderFriendlyImage || order.uploadedFiles.orderFriendlyImage.length === 0) && (
                    <p className="text-sm text-gray-500">No files uploaded</p>
                  )}
                </div>
              </div>

              {/* Documents Provided by Order */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Documents Provided (Order)</h3>
                <div className="space-y-2">
                  {order.uploadedFiles?.documentsProvidedByOrder?.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </a>
                    </div>
                  ))}
                  {(!order.uploadedFiles?.documentsProvidedByOrder || order.uploadedFiles.documentsProvidedByOrder.length === 0) && (
                    <p className="text-sm text-gray-500">No files uploaded</p>
                  )}
                </div>
              </div>

              {/* Invoice for Customer */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Invoice for Customer</h3>
                <div className="space-y-2">
                  {order.uploadedFiles?.invoiceForCustomer?.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </a>
                    </div>
                  ))}
                  {(!order.uploadedFiles?.invoiceForCustomer || order.uploadedFiles.invoiceForCustomer.length === 0) && (
                    <p className="text-sm text-gray-500">No files uploaded</p>
                  )}
                </div>
              </div>

              {/* Documents Provided by Vendor */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Documents Provided (Vendor)</h3>
                <div className="space-y-2">
                  {order.uploadedFiles?.documentsProvidedByVendor?.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </a>
                    </div>
                  ))}
                  {(!order.uploadedFiles?.documentsProvidedByVendor || order.uploadedFiles.documentsProvidedByVendor.length === 0) && (
                    <p className="text-sm text-gray-500">No files uploaded</p>
                  )}
                </div>
              </div>

              {/* Invoice from Vendor */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Invoice from Vendor</h3>
                <div className="space-y-2">
                  {order.uploadedFiles?.invoiceFromVendor?.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </a>
                    </div>
                  ))}
                  {(!order.uploadedFiles?.invoiceFromVendor || order.uploadedFiles.invoiceFromVendor.length === 0) && (
                    <p className="text-sm text-gray-500">No files uploaded</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Status Change History</h2>
            <div className="space-y-4">
              {order.statusHistory?.map((change, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Status changed from "{change.oldStatus}" to "{change.newStatus}"
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{change.comment}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{change.date}</p>
                      <p className="text-xs text-gray-400">{change.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
              {(!order.statusHistory || order.statusHistory.length === 0) && (
                <p className="text-sm text-gray-500">No status changes recorded</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Total:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900">
                      {order.amount}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Delivery Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Delivery Address</label>
                <p className="text-sm text-gray-900 mt-1">{order.deliveryAddress}</p>
              </div>
              {order.specialInstructions && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Special Instructions</label>
                  <p className="text-sm text-gray-900 mt-1">{order.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
            <div className="space-y-4">
              {order.orderHistory.map((event, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {event.status === 'Delivered' ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : event.status === 'Processing' || event.status === 'Shipped' ? (
                      <ClockIcon className="h-5 w-5 text-blue-500" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{event.status}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
            <div className="space-y-3">
              {order.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.size} • {doc.uploadDate}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-900">
                    <DocumentArrowDownIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Priority:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${getPriorityColor(order.priority)}`}>
                  {order.priority}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderView;
