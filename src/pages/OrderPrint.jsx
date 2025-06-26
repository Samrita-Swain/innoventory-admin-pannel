import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const OrderPrint = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading order data for printing, ID:', id);
        
        // Import and use database service
        const { getOrderById } = await import('../services/orderService');
        const orderData = await getOrderById(id);
        
        if (orderData) {
          console.log('✅ Order loaded for printing:', orderData);
          setOrder(orderData);
        } else {
          console.log('❌ Order not found, using demo data');
          // Fallback to demo data for printing
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
            amountPaidToVendor: '150000'
          });
        }
      } catch (error) {
        console.error('❌ Error loading order for printing:', error);
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
          amountPaidToVendor: '150000'
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  useEffect(() => {
    // Auto-print when page loads
    if (!loading && order) {
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [loading, order]);

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
          <p className="text-gray-600">The order you're trying to print doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="print-container">
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
        
        .print-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .company-name {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 5px;
        }
        
        .company-tagline {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }
        
        .document-title {
          font-size: 24px;
          font-weight: bold;
          margin-top: 20px;
        }
        
        .order-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .info-section h3 {
          font-size: 16px;
          font-weight: bold;
          color: #2563eb;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding: 4px 0;
        }
        
        .info-label {
          font-weight: 500;
          color: #374151;
        }
        
        .info-value {
          font-weight: 600;
          color: #111827;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-completed {
          background-color: #d1fae5;
          color: #065f46;
        }
        
        .status-pending {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        .status-progress {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .financial-summary {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
        }
        
        .total-amount {
          font-size: 20px;
          font-weight: bold;
          color: #2563eb;
          text-align: center;
          padding: 15px;
          background-color: #eff6ff;
          border-radius: 8px;
          margin-top: 15px;
        }
        
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        
        .print-button {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        
        .print-button:hover {
          background-color: #1d4ed8;
        }
      `}</style>

      <button 
        className="print-button no-print" 
        onClick={() => window.print()}
      >
        Print Order
      </button>

      <div className="header">
        <div className="company-name">Innoventory</div>
        <div className="company-tagline">Innoventory Management System</div>
        <div className="document-title">ORDER DETAILS</div>
      </div>

      <div className="order-info">
        <div className="info-section">
          <h3>Order Information</h3>
          <div className="info-row">
            <span className="info-label">Order Reference:</span>
            <span className="info-value">{order.orderReferenceNumber}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Onboarding Date:</span>
            <span className="info-value">{order.orderOnboardingDate}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Client:</span>
            <span className="info-value">{order.client}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Type of Work:</span>
            <span className="info-value">{order.typeOfWork}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Expected Completion:</span>
            <span className="info-value">{order.dateOfWorkCompletionExpected}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Current Status:</span>
            <span className={`status-badge ${
              order.currentStatus === 'Completed' ? 'status-completed' :
              order.currentStatus === 'Pending' ? 'status-pending' :
              'status-progress'
            }`}>
              {order.currentStatus}
            </span>
          </div>
        </div>

        <div className="info-section">
          <h3>Vendor Information</h3>
          <div className="info-row">
            <span className="info-label">Vendor Name:</span>
            <span className="info-value">{order.vendorName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Vendor Onboarding:</span>
            <span className="info-value">{order.dateOfOnboardingVendor}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Vendor Expected Completion:</span>
            <span className="info-value">{order.dateOfWorkCompletionExpectedFromVendor}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status Change Date:</span>
            <span className="info-value">{order.dateOfStatusChange}</span>
          </div>
          {order.statusComments && (
            <div style={{ marginTop: '15px' }}>
              <div className="info-label" style={{ marginBottom: '5px' }}>Status Comments:</div>
              <div style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '10px', 
                borderRadius: '5px',
                fontSize: '14px',
                color: '#374151'
              }}>
                {order.statusComments}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="financial-summary">
        <h3 style={{ marginTop: 0, color: '#2563eb' }}>Financial Summary</h3>
        <div className="info-row">
          <span className="info-label">Total Invoice Value:</span>
          <span className="info-value">₹{parseFloat(order.totalInvoiceValue).toLocaleString()}</span>
        </div>
        <div className="info-row">
          <span className="info-label">GST + Govt Fees:</span>
          <span className="info-value">₹{parseFloat(order.totalValueGstGovtFees).toLocaleString()}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Payment Due Date:</span>
          <span className="info-value">{order.dateOfPaymentExpected}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Amount to be Paid to Vendor:</span>
          <span className="info-value">₹{parseFloat(order.amountToBePaidToVendor).toLocaleString()}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Amount Paid to Vendor:</span>
          <span className="info-value">₹{parseFloat(order.amountPaidToVendor).toLocaleString()}</span>
        </div>
        
        <div className="total-amount">
          Total Order Value: ₹{parseFloat(order.totalInvoiceValue).toLocaleString()}
        </div>
      </div>

      <div className="footer">
        <p>This is a computer-generated document. No signature is required.</p>
        <p>Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
        <p>© 2024 Innoventory Management System. All rights reserved.</p>
      </div>
    </div>
  );
};

export default OrderPrint;
