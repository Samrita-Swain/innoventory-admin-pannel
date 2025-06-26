import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../components/DataTable/DataTable';
import FileUpload from '../components/FileUpload/FileUpload';

const Orders = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeWorkTypes, setActiveWorkTypes] = useState([]);
  const [formData, setFormData] = useState({
    orderOnboardingDate: '',
    orderReferenceNumber: '',
    client: '',
    typeOfWork: '',
    dateOfWorkCompletionExpected: '',
    totalInvoiceValue: '',
    totalValueGstGovtFees: '',
    dateOfPaymentExpected: '',
    dateOfOnboardingVendor: '',
    vendorName: '',
    currentStatus: '',
    statusComments: '',
    dateOfStatusChange: '',
    dateOfWorkCompletionExpectedFromVendor: '',
    amountToBePaidToVendor: '',
    amountPaidToVendor: '',
    // Legacy fields for compatibility
    vendor: '',
    orderType: '',
    priority: '',
    description: '',
    deliveryAddress: '',
    specialInstructions: '',
    items: [{ name: '', quantity: '', unitPrice: '', total: '' }]
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    orderFriendlyImage: [],
    documentsProvidedByOrder: [],
    invoiceForCustomer: [],
    documentsProvidedByVendor: [],
    invoiceFromVendor: []
  });
  const [statusHistory, setStatusHistory] = useState([]);

  // Demo data for display (not saved to database)
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const demoOrders = [
    {
      id: 'demo-ord-001',
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
      amountPaidToVendor: '150000'
    },
    {
      id: 'demo-ord-002',
      orderReferenceNumber: 'IS-1703845260000',
      orderOnboardingDate: '2024-06-22',
      client: 'Global Tech Inc',
      typeOfWork: 'Trademark Registration',
      dateOfWorkCompletionExpected: '2024-07-22',
      totalInvoiceValue: '189000',
      totalValueGstGovtFees: '34020',
      dateOfPaymentExpected: '2024-07-27',
      dateOfOnboardingVendor: '2024-06-23',
      vendorName: 'ABC Supplies',
      currentStatus: 'Pending with client',
      statusComments: 'Waiting for client documents',
      dateOfStatusChange: '2024-06-25',
      dateOfWorkCompletionExpectedFromVendor: '2024-07-20',
      amountToBePaidToVendor: '120000',
      amountPaidToVendor: '60000'
    },
    {
      id: 'demo-ord-003',
      orderReferenceNumber: 'IS-1703845320000',
      orderOnboardingDate: '2024-06-24',
      client: 'StartUp Solutions',
      typeOfWork: 'Copyright Registration',
      dateOfWorkCompletionExpected: '2024-07-24',
      totalInvoiceValue: '75000',
      totalValueGstGovtFees: '13500',
      dateOfPaymentExpected: '2024-07-29',
      dateOfOnboardingVendor: '2024-06-25',
      vendorName: 'Tech Solutions Ltd',
      currentStatus: 'Pending with Vendor',
      statusComments: 'Vendor working on documentation',
      dateOfStatusChange: '2024-06-26',
      dateOfWorkCompletionExpectedFromVendor: '2024-07-22',
      amountToBePaidToVendor: '45000',
      amountPaidToVendor: '0'
    },
  ];

  // Manual refresh function for debugging
  const manualRefreshOrders = async () => {
    try {
      setLoading(true);
      console.log('🔄 Manual refresh triggered...');

      // Test database connection first
      const { sql } = await import('../config/database');
      const testQuery = await sql`SELECT COUNT(*) as count FROM orders`;
      console.log('📊 Database test - orders count:', testQuery[0]?.count);

      // Get raw data
      const rawOrders = await sql`SELECT * FROM orders LIMIT 5`;
      console.log('📋 Raw orders from DB:', rawOrders);

      // Import and use order service
      const { getAllOrders } = await import('../services/orderService');
      const dbOrders = await getAllOrders();

      console.log('✅ Service returned:', dbOrders);

      if (Array.isArray(dbOrders) && dbOrders.length > 0) {
        setOrders(dbOrders);
        console.log('✅ Orders set successfully');
      } else {
        console.log('⚠️ No orders returned, using demo data');
        setOrders(demoOrders);
      }
    } catch (error) {
      console.error('❌ Manual refresh failed:', error);
      setOrders(demoOrders);
    } finally {
      setLoading(false);
    }
  };

  // Add to window for debugging
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    window.manualRefreshOrders = manualRefreshOrders;
  }

  // Load orders from database
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading orders from database...');

        // Test database connection first
        try {
          const { sql } = await import('../config/database');
          const testQuery = await sql`SELECT COUNT(*) as count FROM orders`;
          console.log('📊 Database test - orders count:', testQuery[0]?.count);
        } catch (dbTestError) {
          console.error('❌ Database test failed:', dbTestError);
        }

        // Import and use order service
        const { getAllOrders } = await import('../services/orderService');
        const dbOrders = await getAllOrders();

        console.log('✅ Orders loaded:', dbOrders);
        console.log('📊 Orders count:', dbOrders?.length);
        console.log('📋 Orders data type:', typeof dbOrders);
        console.log('🔍 Is array:', Array.isArray(dbOrders));

        // Check if we got valid data
        if (Array.isArray(dbOrders) && dbOrders.length > 0) {
          console.log('✅ Setting orders from database:', dbOrders.length, 'orders');
          setOrders(dbOrders);
        } else if (Array.isArray(dbOrders) && dbOrders.length === 0) {
          console.log('⚠️ Database returned empty array, using demo data');
          setOrders(demoOrders);
        } else {
          console.log('⚠️ Invalid orders data format, using demo data');
          setOrders(demoOrders);
        }
      } catch (err) {
        console.error('❌ Error loading orders:', err);
        console.error('Error details:', err.message, err.stack);
        // Fallback to demo data if database fails
        setOrders(demoOrders);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Load active work types for dropdown
  useEffect(() => {
    const loadActiveWorkTypes = async () => {
      try {
        console.log('🔄 Loading active work types for dropdown...');
        const { getActiveTypeOfWork } = await import('../services/typeOfWorkService');
        const workTypes = await getActiveTypeOfWork();
        setActiveWorkTypes(workTypes);
        console.log('✅ Active work types loaded:', workTypes.length);
      } catch (error) {
        console.error('❌ Error loading active work types:', error);
        // Fallback to demo data
        setActiveWorkTypes([
          { id: 1, name: 'Patent Filing' },
          { id: 2, name: 'Trademark Registration' },
          { id: 3, name: 'Copyright Registration' },
          { id: 4, name: 'Design Registration' },
          { id: 5, name: 'Legal Consultation' }
        ]);
      }
    };

    loadActiveWorkTypes();
  }, []);

  const columns = [
    {
      key: 'orderReferenceNumber',
      label: 'Order Reference',
      sortable: true,
      filterable: true
    },
    {
      key: 'client',
      label: 'Client',
      sortable: true,
      filterable: true
    },
    {
      key: 'typeOfWork',
      label: 'Type of Work',
      sortable: true,
      filterable: true
    },
    {
      key: 'vendorName',
      label: 'Vendor',
      sortable: true,
      filterable: true
    },
    {
      key: 'totalInvoiceValue',
      label: 'Invoice Value',
      sortable: true,
      filterable: false,
      render: (value) => value ? `₹${parseFloat(value).toLocaleString()}` : '-'
    },
    {
      key: 'currentStatus',
      label: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'Completed' ? 'bg-green-100 text-green-800' :
          value === 'Pending with client' ? 'bg-blue-100 text-blue-800' :
          value === 'Pending with Vendor' ? 'bg-yellow-100 text-yellow-800' :
          value === 'Blocked' ? 'bg-red-100 text-red-800' :
          value === 'Yet to start' ? 'bg-gray-100 text-gray-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value || 'Not Set'}
        </span>
      )
    },
    {
      key: 'orderOnboardingDate',
      label: 'Onboarding Date',
      sortable: true,
      filterable: false
    },
    {
      key: 'dateOfWorkCompletionExpected',
      label: 'Expected Completion',
      sortable: true,
      filterable: false
    },
    {
      key: 'dateOfPaymentExpected',
      label: 'Payment Due',
      sortable: true,
      filterable: false
    },
    {
      key: 'amountToBePaidToVendor',
      label: 'Vendor Amount',
      sortable: true,
      filterable: false,
      render: (value) => value ? `₹${parseFloat(value).toLocaleString()}` : '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      filterable: false,
      render: (value, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/orders/${row.id}`)}
            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
            title="View Order"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(`/orders/${row.id}/edit`)}
            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
            title="Edit Order"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteOrder(row.id)}
            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
            title="Delete Order"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🔄 Deleting order:', orderId);

      // Import and use database service
      const { deleteOrder } = await import('../services/orderService');
      await deleteOrder(orderId);

      console.log('✅ Order deleted successfully');
      alert('Order deleted successfully');

      // Refresh the orders list
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('❌ Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  const handleExportOrders = async (format) => {
    try {
      console.log(`🔄 Exporting orders as ${format}...`);

      if (format === 'excel' || format === 'csv') {
        const { exportOrdersToExcel } = await import('../utils/exportUtils');
        await exportOrdersToExcel(orders);
      } else if (format === 'pdf') {
        // For PDF export of all orders, we could create a summary page
        alert('PDF export of all orders is not yet implemented. Please use Excel export or export individual orders.');
      }
    } catch (error) {
      console.error('❌ Error exporting orders:', error);
      alert('Failed to export orders');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Auto-generate order reference number
  const generateOrderReference = () => {
    const timestamp = Date.now();
    return `IS-${timestamp}`;
  };

  // File upload handler
  const handleFileUpload = (fileType, files) => {
    if (!files || files.length === 0) return;

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    const validFiles = [];
    const errors = [];

    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds 5MB limit`);
        return;
      }

      // Handle duplicate filename by appending timestamp
      const existingFiles = uploadedFiles[fileType] || [];
      const existingNames = existingFiles.map(f => f.name);
      let fileName = file.name;

      if (existingNames.includes(fileName)) {
        const timestamp = new Date().getTime();
        const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
        const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        fileName = `${fileNameWithoutExt}_${timestamp}${fileExtension}`;
      }

      // Create new file object with updated name
      const newFile = new File([file], fileName, { type: file.type });
      validFiles.push(newFile);
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: [...(prev[fileType] || []), ...validFiles]
      }));
    }
  };

  const removeFile = (fileType, index) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: prev[fileType].filter((_, i) => i !== index)
    }));
  };

  // Handle status change with comments
  const handleStatusChange = (newStatus) => {
    if (formData.currentStatus !== newStatus) {
      const comment = prompt('Please provide a comment for this status change:');
      if (comment) {
        const statusChange = {
          oldStatus: formData.currentStatus,
          newStatus: newStatus,
          comment: comment,
          date: new Date().toISOString().split('T')[0],
          timestamp: new Date().toLocaleString()
        };

        setStatusHistory(prev => [...prev, statusChange]);
        setFormData(prev => ({
          ...prev,
          currentStatus: newStatus,
          statusComments: comment,
          dateOfStatusChange: new Date().toISOString().split('T')[0]
        }));
      }
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Calculate total for the item
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
      newItems[index].total = (quantity * unitPrice).toFixed(2);
    }

    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: '', unitPrice: '', total: '' }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleFilesChange = (files) => {
    setUploadedFiles(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log('Uploaded Files:', uploadedFiles);
    // Here you would typically send the data to your backend
    setShowAddForm(false);
    // Reset form
    setFormData({
      orderOnboardingDate: '',
      orderReferenceNumber: '',
      client: '',
      typeOfWork: '',
      dateOfWorkCompletionExpected: '',
      totalInvoiceValue: '',
      totalValueGstGovtFees: '',
      dateOfPaymentExpected: '',
      dateOfOnboardingVendor: '',
      vendorName: '',
      currentStatus: '',
      statusComments: '',
      dateOfStatusChange: '',
      dateOfWorkCompletionExpectedFromVendor: '',
      amountToBePaidToVendor: '',
      amountPaidToVendor: '',
      // Legacy fields for compatibility
      vendor: '',
      orderType: '',
      priority: '',
      description: '',
      deliveryAddress: '',
      specialInstructions: '',
      items: [{ name: '', quantity: '', unitPrice: '', total: '' }]
    });
    setUploadedFiles({
      orderFriendlyImage: [],
      documentsProvidedByOrder: [],
      invoiceForCustomer: [],
      documentsProvidedByVendor: [],
      invoiceFromVendor: []
    });
    setStatusHistory([]);
  };



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="mt-2 text-gray-600">Track and manage all orders</p>
        </div>
        <div className="flex space-x-2">
          {process.env.NODE_ENV === 'development' && (
            <>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary flex items-center"
              >
                🔄 Refresh Page
              </button>
              <button
                onClick={async () => {
                  try {
                    const { refreshDatabaseData } = await import('../config/database');
                    await refreshDatabaseData();
                    window.location.reload();
                  } catch (error) {
                    console.error('Error refreshing database:', error);
                    alert('Error refreshing database: ' + error.message);
                  }
                }}
                className="btn-secondary flex items-center"
              >
                🗄️ Refresh DB
              </button>
              <button
                onClick={manualRefreshOrders}
                className="btn-secondary flex items-center"
              >
                🔄 Test Orders
              </button>
            </>
          )}
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Order
          </button>
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Debug Info:</h3>
          <p className="text-sm text-yellow-700">Orders count: {orders?.length || 0}</p>
          <p className="text-sm text-yellow-700">Loading: {loading ? 'Yes' : 'No'}</p>
          <p className="text-sm text-yellow-700">Orders type: {typeof orders}</p>
          <p className="text-sm text-yellow-700">Is array: {Array.isArray(orders) ? 'Yes' : 'No'}</p>
          {orders?.length > 0 && (
            <details className="mt-2">
              <summary className="text-sm text-yellow-700 cursor-pointer">First order data</summary>
              <pre className="text-xs text-yellow-600 mt-1 overflow-auto max-h-32">
                {JSON.stringify(orders[0], null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* Simple Debug Table */}
      {process.env.NODE_ENV === 'development' && orders?.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Simple Data Display (Debug):</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-2 py-1 text-left">ID</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Reference</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Client</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Status</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order, index) => (
                  <tr key={order.id || index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1">{order.id}</td>
                    <td className="border border-gray-300 px-2 py-1">{order.orderReferenceNumber}</td>
                    <td className="border border-gray-300 px-2 py-1">{order.client}</td>
                    <td className="border border-gray-300 px-2 py-1">{order.currentStatus}</td>
                    <td className="border border-gray-300 px-2 py-1">₹{order.totalInvoiceValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <DataTable
        data={orders}
        columns={columns}
        title="Orders Management"
        defaultPageSize={50}
        enableExport={true}
        enableColumnToggle={true}
        enableFiltering={true}
        enableSorting={true}
        onExport={handleExportOrders}
      />

      {/* Add Order Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowAddForm(false)}></div>
            <div className="relative bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Create New Order</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Order Information</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order Onboarding Date *
                      </label>
                      <input
                        type="date"
                        name="orderOnboardingDate"
                        value={formData.orderOnboardingDate}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order Reference Number
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          name="orderReferenceNumber"
                          value={formData.orderReferenceNumber}
                          readOnly
                          className="input-field bg-gray-50"
                          placeholder="Auto-generated"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, orderReferenceNumber: generateOrderReference() }))}
                          className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Generate
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order Friendly Image *
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> order image
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('orderFriendlyImage', e.target.files)}
                            multiple
                            required
                          />
                        </label>
                      </div>
                      {uploadedFiles.orderFriendlyImage && uploadedFiles.orderFriendlyImage.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.orderFriendlyImage.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('orderFriendlyImage', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client *
                      </label>
                      <select
                        name="client"
                        value={formData.client}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select client</option>
                        <option value="Acme Corporation">Acme Corporation</option>
                        <option value="Global Tech Inc">Global Tech Inc</option>
                        <option value="StartUp Solutions">StartUp Solutions</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type of Work *
                      </label>
                      <select
                        name="typeOfWork"
                        value={formData.typeOfWork}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select type of work</option>
                        {activeWorkTypes.map(workType => (
                          <option key={workType.id} value={workType.name}>
                            {workType.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Work Completion Expected *
                      </label>
                      <input
                        type="date"
                        name="dateOfWorkCompletionExpected"
                        value={formData.dateOfWorkCompletionExpected}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Financial and Vendor Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Financial & Vendor Information</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Invoice Value *
                      </label>
                      <input
                        type="number"
                        name="totalInvoiceValue"
                        value={formData.totalInvoiceValue}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Enter amount in ₹"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Value of GST + Govt Fees
                      </label>
                      <input
                        type="number"
                        name="totalValueGstGovtFees"
                        value={formData.totalValueGstGovtFees}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter amount in ₹"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Payment Expected *
                      </label>
                      <input
                        type="date"
                        name="dateOfPaymentExpected"
                        value={formData.dateOfPaymentExpected}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Onboarding Vendor for this Order *
                      </label>
                      <input
                        type="date"
                        name="dateOfOnboardingVendor"
                        value={formData.dateOfOnboardingVendor}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vendor Name *
                      </label>
                      <select
                        name="vendorName"
                        value={formData.vendorName}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select vendor</option>
                        <option value="ABC Supplies">ABC Supplies</option>
                        <option value="XYZ Manufacturing">XYZ Manufacturing</option>
                        <option value="Tech Solutions Ltd">Tech Solutions Ltd</option>
                        <option value="Legal Associates">Legal Associates</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Status
                      </label>
                      <select
                        name="currentStatus"
                        value={formData.currentStatus}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select status</option>
                        <option value="Yet to start">Yet to start</option>
                        <option value="Pending with client">Pending with client</option>
                        <option value="Pending with Vendor">Pending with Vendor</option>
                        <option value="Blocked">Blocked</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {formData.currentStatus && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status Comments
                        </label>
                        <textarea
                          name="statusComments"
                          value={formData.statusComments}
                          readOnly
                          rows={2}
                          className="input-field bg-gray-50"
                          placeholder="Comments will appear when status is changed"
                        />
                      </div>
                    )}

                    {formData.dateOfStatusChange && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Status Change
                        </label>
                        <input
                          type="date"
                          name="dateOfStatusChange"
                          value={formData.dateOfStatusChange}
                          readOnly
                          className="input-field bg-gray-50"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Vendor Details */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Vendor Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Work Completion Expected from Vendor
                      </label>
                      <input
                        type="date"
                        name="dateOfWorkCompletionExpectedFromVendor"
                        value={formData.dateOfWorkCompletionExpectedFromVendor}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount to be Paid to Vendor
                      </label>
                      <input
                        type="number"
                        name="amountToBePaidToVendor"
                        value={formData.amountToBePaidToVendor}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter amount in ₹"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount Paid to Vendor
                      </label>
                      <input
                        type="number"
                        name="amountPaidToVendor"
                        value={formData.amountPaidToVendor}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter amount in ₹"
                      />
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Document Management</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Documents Provided (as part of order) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Documents Provided (as part of order) *
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p className="text-xs text-gray-500">Upload Order Documents</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                            onChange={(e) => handleFileUpload('documentsProvidedByOrder', e.target.files)}
                            multiple
                            required
                          />
                        </label>
                      </div>
                      {uploadedFiles.documentsProvidedByOrder && uploadedFiles.documentsProvidedByOrder.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.documentsProvidedByOrder.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('documentsProvidedByOrder', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Invoice for the Customer */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Invoice for the Customer *
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p className="text-xs text-gray-500">Upload Customer Invoice</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                            onChange={(e) => handleFileUpload('invoiceForCustomer', e.target.files)}
                            multiple
                            required
                          />
                        </label>
                      </div>
                      {uploadedFiles.invoiceForCustomer && uploadedFiles.invoiceForCustomer.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.invoiceForCustomer.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('invoiceForCustomer', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Documents Provided by Vendor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Documents Provided (as part of order) by Vendor
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p className="text-xs text-gray-500">Upload Vendor Documents</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                            onChange={(e) => handleFileUpload('documentsProvidedByVendor', e.target.files)}
                            multiple
                          />
                        </label>
                      </div>
                      {uploadedFiles.documentsProvidedByVendor && uploadedFiles.documentsProvidedByVendor.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.documentsProvidedByVendor.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('documentsProvidedByVendor', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Invoice from the Vendor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Invoice from the Vendor
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p className="text-xs text-gray-500">Upload Vendor Invoice</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                            onChange={(e) => handleFileUpload('invoiceFromVendor', e.target.files)}
                            multiple
                          />
                        </label>
                      </div>
                      {uploadedFiles.invoiceFromVendor && uploadedFiles.invoiceFromVendor.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.invoiceFromVendor.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('invoiceFromVendor', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status History */}
                {statusHistory.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Status Change History</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        {statusHistory.map((change, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Status changed from "{change.oldStatus}" to "{change.newStatus}"
                                </p>
                                <p className="text-sm text-gray-600 mt-1">{change.comment}</p>
                              </div>
                              <span className="text-xs text-gray-500">{change.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Order Items</h4>
                    <button
                      type="button"
                      onClick={addItem}
                      className="btn-secondary text-sm"
                    >
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Item Name *
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            required
                            className="input-field text-sm"
                            placeholder="Item name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Quantity *
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            required
                            className="input-field text-sm"
                            placeholder="Qty"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Unit Price *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                            required
                            className="input-field text-sm"
                            placeholder="Price"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Total
                          </label>
                          <input
                            type="text"
                            value={item.total ? `₹${item.total}` : ''}
                            readOnly
                            className="input-field text-sm bg-gray-50"
                            placeholder="₹0.00"
                          />
                        </div>
                        <div className="flex items-end">
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-900 text-sm px-2 py-1"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Order Total:</span>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{formData.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>



                {/* Form Actions */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Create Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
