import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import FileUpload from '../components/FileUpload/FileUpload';

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
    items: []
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    orderFriendlyImage: [],
    documentsProvidedByOrder: [],
    invoiceForCustomer: [],
    documentsProvidedByVendor: [],
    invoiceFromVendor: []
  });
  const [statusHistory, setStatusHistory] = useState([]);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading order data for editing, ID:', id);

        // Import and use database service
        const { getOrderById } = await import('../services/orderService');
        const orderData = await getOrderById(id);

        if (orderData) {
          console.log('✅ Order loaded for editing:', orderData);
          setFormData({
            orderOnboardingDate: orderData.orderOnboardingDate || '',
            orderReferenceNumber: orderData.orderReferenceNumber || '',
            client: orderData.client || '',
            typeOfWork: orderData.typeOfWork || '',
            dateOfWorkCompletionExpected: orderData.dateOfWorkCompletionExpected || '',
            totalInvoiceValue: orderData.totalInvoiceValue || '',
            totalValueGstGovtFees: orderData.totalValueGstGovtFees || '',
            dateOfPaymentExpected: orderData.dateOfPaymentExpected || '',
            dateOfOnboardingVendor: orderData.dateOfOnboardingVendor || '',
            vendorName: orderData.vendorName || '',
            currentStatus: orderData.currentStatus || '',
            statusComments: orderData.statusComments || '',
            dateOfStatusChange: orderData.dateOfStatusChange || '',
            dateOfWorkCompletionExpectedFromVendor: orderData.dateOfWorkCompletionExpectedFromVendor || '',
            amountToBePaidToVendor: orderData.amountToBePaidToVendor || '',
            amountPaidToVendor: orderData.amountPaidToVendor || '',
            vendor: orderData.vendor || '',
            orderType: orderData.orderType || '',
            priority: orderData.priority || '',
            description: orderData.description || '',
            deliveryAddress: orderData.deliveryAddress || '',
            specialInstructions: orderData.specialInstructions || '',
            items: orderData.items || []
          });

          if (orderData.files) {
            setUploadedFiles(orderData.files);
          }

          if (orderData.statusHistory) {
            setStatusHistory(orderData.statusHistory);
          }
        } else {
          console.log('❌ Order not found, creating new order form');
          // Create a new order form with the given ID
          setFormData({
            orderOnboardingDate: new Date().toISOString().split('T')[0],
            orderReferenceNumber: `IS-${Date.now()}`,
            client: '',
            typeOfWork: '',
            dateOfWorkCompletionExpected: '',
            totalInvoiceValue: '',
            totalValueGstGovtFees: '',
            dateOfPaymentExpected: '',
            dateOfOnboardingVendor: '',
            vendorName: '',
            currentStatus: 'Pending',
            statusComments: '',
            dateOfStatusChange: new Date().toISOString().split('T')[0],
            dateOfWorkCompletionExpectedFromVendor: '',
            amountToBePaidToVendor: '',
            amountPaidToVendor: '',
            vendor: '',
            orderType: '',
            priority: 'Medium',
            description: '',
            deliveryAddress: '',
            specialInstructions: '',
            items: []
          });
          console.log('✅ Initialized new order form for ID:', id);
        }
      } catch (error) {
        console.error('❌ Error loading order for editing:', error);
        // Create a new order form instead of using demo data
        setFormData({
          orderOnboardingDate: new Date().toISOString().split('T')[0],
          orderReferenceNumber: `IS-${Date.now()}`,
          client: '',
          typeOfWork: '',
          dateOfWorkCompletionExpected: '',
          totalInvoiceValue: '',
          totalValueGstGovtFees: '',
          dateOfPaymentExpected: '',
          dateOfOnboardingVendor: '',
          vendorName: '',
          currentStatus: 'Pending',
          statusComments: '',
          dateOfStatusChange: new Date().toISOString().split('T')[0],
          dateOfWorkCompletionExpectedFromVendor: '',
          amountToBePaidToVendor: '',
          amountPaidToVendor: '',
          vendor: '',
          orderType: '',
          priority: 'Medium',
          description: '',
          deliveryAddress: '',
          specialInstructions: '',
          items: []
        });
        console.log('✅ Initialized new order form due to loading error');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  // Load active work types for dropdown
  useEffect(() => {
    const loadActiveWorkTypes = async () => {
      try {
        console.log('🔄 Loading active work types for dropdown...');
        const { getActiveTypeOfWork } = await import('../services/database');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle null values properly
    const cleanValue = value && value !== 'null' ? value : '';
    setFormData(prev => ({
      ...prev,
      [name]: cleanValue
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
    // Handle null values properly
    newItems[index][field] = value && value !== 'null' ? value : '';

    // Calculate total for the item
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
      newItems[index].total = (quantity * unitPrice);
    }

    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), name: '', quantity: '', unitPrice: '', total: 0 }]
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('🔄 Updating order data:', formData);
      console.log('🔄 Uploaded Files:', uploadedFiles);
      console.log('🔄 Status History:', statusHistory);

      // Import and use database service
      const { updateOrder } = await import('../services/orderService');

      // Prepare order data for database with proper field mapping
      const orderData = {
        ...formData,
        // Add explicit field mappings for clarity
        description: formData.typeOfWork || formData.description || formData.statusComments || '',
        amount: parseFloat(formData.totalInvoiceValue || 0),
        status: formData.currentStatus || 'Pending',
        priority: formData.priority || 'Medium',
        files: uploadedFiles,
        statusHistory: statusHistory
      };

      console.log('📋 Prepared order data for update:', orderData);

      const result = await updateOrder(id, orderData);

      console.log('✅ Order updated successfully:', result);
      alert('Order updated successfully!');
      navigate(`/orders/${id}`);
    } catch (error) {
      console.error('❌ Error updating order:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);

      // Show more specific error message
      const errorMessage = error.message || 'Unknown error occurred';

      // If the error is about order not existing, offer to create it
      if (errorMessage.includes('does not exist')) {
        const createNew = confirm(`Order with ID ${id} does not exist. Would you like to create it as a new order?`);
        if (createNew) {
          try {
            // Try again - the service will create the order if it doesn't exist
            const result = await updateOrder(id, orderData);
            console.log('✅ Order created successfully:', result);
            alert('Order created successfully!');
            navigate(`/orders/${id}`);
            return;
          } catch (createError) {
            console.error('❌ Error creating order:', createError);
            alert(`Failed to create order: ${createError.message}`);
          }
        }
      }

      alert(`Failed to update order: ${errorMessage}\n\nPlease check the console for more details and try again.`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/orders/${id}`)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Order
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Order {id}</h1>
            <p className="text-gray-600">Update order details and information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
          </div>
        </div>

        {/* Order Items */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="btn-secondary flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Item
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    required
                    className="input-field"
                    placeholder="Item name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    required
                    className="input-field"
                    placeholder="Qty"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    required
                    className="input-field"
                    placeholder="Price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total
                  </label>
                  <input
                    type="text"
                    value={item.total ? `₹${item.total.toFixed(2)}` : ''}
                    readOnly
                    className="input-field bg-gray-50"
                    placeholder="₹0.00"
                  />
                </div>
                <div className="flex items-end">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"
                      title="Remove Item"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Total */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Order Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                ₹{formData.items.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Documents</h2>
          <FileUpload
            onFilesChange={handleFilesChange}
            existingFiles={uploadedFiles}
            maxFileSize={5}
            multiple={true}
            label="Upload Order Documents"
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload purchase orders, specifications, drawings, contracts, etc.
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(`/orders/${id}`)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Update Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderEdit;
