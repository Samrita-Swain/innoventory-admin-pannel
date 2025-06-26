// Export utilities for orders

// Export order to Excel format
export const exportOrderToExcel = async (order) => {
  try {
    // Create CSV content (Excel-compatible)
    const csvContent = generateOrderCSV(order);
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `order_${order.orderReferenceNumber || order.id}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Order exported to Excel/CSV successfully');
  } catch (error) {
    console.error('❌ Error exporting order to Excel:', error);
    throw error;
  }
};

// Generate CSV content for order
const generateOrderCSV = (order) => {
  const headers = [
    'Field',
    'Value'
  ];
  
  const rows = [
    ['Order Reference Number', order.orderReferenceNumber || ''],
    ['Order Onboarding Date', order.orderOnboardingDate || ''],
    ['Client', order.client || ''],
    ['Type of Work', order.typeOfWork || ''],
    ['Date of Work Completion Expected', order.dateOfWorkCompletionExpected || ''],
    ['Total Invoice Value (₹)', order.totalInvoiceValue || ''],
    ['Total Value GST + Govt Fees (₹)', order.totalValueGstGovtFees || ''],
    ['Date of Payment Expected', order.dateOfPaymentExpected || ''],
    ['Date of Onboarding Vendor', order.dateOfOnboardingVendor || ''],
    ['Vendor Name', order.vendorName || ''],
    ['Current Status', order.currentStatus || ''],
    ['Status Comments', order.statusComments || ''],
    ['Date of Status Change', order.dateOfStatusChange || ''],
    ['Date of Work Completion Expected from Vendor', order.dateOfWorkCompletionExpectedFromVendor || ''],
    ['Amount to be Paid to Vendor (₹)', order.amountToBePaidToVendor || ''],
    ['Amount Paid to Vendor (₹)', order.amountPaidToVendor || '']
  ];
  
  // Convert to CSV format
  const csvRows = [headers, ...rows];
  return csvRows.map(row => 
    row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
};

// Export order to PDF (using browser print functionality)
export const exportOrderToPDF = (orderId) => {
  try {
    // Open print page in new window
    const printWindow = window.open(`/orders/${orderId}/print`, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };
    } else {
      // Fallback: navigate to print page
      window.open(`/orders/${orderId}/print`, '_blank');
    }
    
    console.log('✅ Order PDF export initiated');
  } catch (error) {
    console.error('❌ Error exporting order to PDF:', error);
    throw error;
  }
};

// Export multiple orders to Excel
export const exportOrdersToExcel = async (orders) => {
  try {
    const csvContent = generateOrdersCSV(orders);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Orders exported to Excel/CSV successfully');
  } catch (error) {
    console.error('❌ Error exporting orders to Excel:', error);
    throw error;
  }
};

// Generate CSV content for multiple orders
const generateOrdersCSV = (orders) => {
  const headers = [
    'Order Reference Number',
    'Order Onboarding Date',
    'Client',
    'Type of Work',
    'Date of Work Completion Expected',
    'Total Invoice Value (₹)',
    'Total Value GST + Govt Fees (₹)',
    'Date of Payment Expected',
    'Date of Onboarding Vendor',
    'Vendor Name',
    'Current Status',
    'Status Comments',
    'Date of Status Change',
    'Date of Work Completion Expected from Vendor',
    'Amount to be Paid to Vendor (₹)',
    'Amount Paid to Vendor (₹)'
  ];
  
  const rows = orders.map(order => [
    order.orderReferenceNumber || '',
    order.orderOnboardingDate || '',
    order.client || '',
    order.typeOfWork || '',
    order.dateOfWorkCompletionExpected || '',
    order.totalInvoiceValue || '',
    order.totalValueGstGovtFees || '',
    order.dateOfPaymentExpected || '',
    order.dateOfOnboardingVendor || '',
    order.vendorName || '',
    order.currentStatus || '',
    order.statusComments || '',
    order.dateOfStatusChange || '',
    order.dateOfWorkCompletionExpectedFromVendor || '',
    order.amountToBePaidToVendor || '',
    order.amountPaidToVendor || ''
  ]);
  
  // Convert to CSV format
  const csvRows = [headers, ...rows];
  return csvRows.map(row => 
    row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
};

// Format currency for export
export const formatCurrency = (amount) => {
  if (!amount) return '0';
  return parseFloat(amount).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  });
};

// Format date for export
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN');
};

// Sanitize filename for download
export const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};
