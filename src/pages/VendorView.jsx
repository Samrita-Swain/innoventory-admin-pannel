import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  UserIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const VendorView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample vendor data - in real app, this would come from API
  useEffect(() => {
    // Load vendor data from localStorage or use sample data
    setTimeout(() => {
      const savedVendors = localStorage.getItem('vendors');
      let vendorsList = [];

      if (savedVendors) {
        vendorsList = JSON.parse(savedVendors);
      }

      const foundVendor = vendorsList.find(v => v.id === parseInt(id));

      let sampleVendor;

      if (foundVendor) {
        // Convert new data structure to display format
        sampleVendor = {
          ...foundVendor,
          name: foundVendor.companyName || foundVendor.name || 'Unknown Vendor',
          email: foundVendor.emails?.[0] || foundVendor.email || 'N/A',
          phone: foundVendor.phones?.[0] || foundVendor.phone || 'N/A',
          contactPerson: foundVendor.username || foundVendor.contactPerson || 'N/A',
          businessType: foundVendor.companyType || foundVendor.businessType || 'N/A',
          joinDate: foundVendor.onboardingDate || foundVendor.joinDate || 'N/A',
          taxId: foundVendor.gstNumber || foundVendor.taxId || 'N/A',
          rating: foundVendor.rating || 4.5,
          website: foundVendor.website || 'N/A',
          totalOrders: foundVendor.totalOrders || 0,
          // Additional fields from form
          typeOfWork: foundVendor.typeOfWork || 'N/A',
          country: foundVendor.country || 'N/A',
          state: foundVendor.state || 'N/A',
          city: foundVendor.city || 'N/A',
          allEmails: foundVendor.emails || [],
          allPhones: foundVendor.phones || [],
          companyLogos: foundVendor.files?.companyLogos || [],
          files: foundVendor.files || {},
          // Default values for missing fields
          services: foundVendor.services || ['General Services'],
          performanceMetrics: foundVendor.performanceMetrics || {
            onTimeDelivery: 95,
            qualityRating: 4.5,
            responseTime: '2 hours',
            totalRevenue: '₹0'
          },
          recentOrders: foundVendor.recentOrders || [],
          documents: foundVendor.documents || [],
          contactHistory: foundVendor.contactHistory || []
        };
      } else {
        // Fallback sample vendor if not found
        sampleVendor = {
          id: id || '1',
          name: 'ABC Supplies',
          email: 'contact@abcsupplies.com',
          phone: '+1-555-987-6543',
          status: 'Active',
          joinDate: '2024-01-15',
          totalOrders: 15,
          rating: 4.8,
          contactPerson: 'Sarah Wilson',
          businessType: 'Office Supplies',
          address: '456 Supplier Ave, Chicago, IL 60601',
          website: 'https://abcsupplies.com',
          taxId: 'TAX-987654321',
          description: 'Reliable office supplies vendor with over 20 years of experience in providing quality products and excellent customer service.',
          services: ['Office Supplies', 'Furniture', 'Technology Equipment', 'Maintenance Services'],
          recentOrders: [
            { id: 'ORD-001', date: '2024-06-20', amount: '₹2,45,000', status: 'Completed', client: 'Acme Corporation' },
            { id: 'ORD-018', date: '2024-06-18', amount: '₹1,20,000', status: 'Processing', client: 'Global Tech Inc' },
            { id: 'ORD-015', date: '2024-06-15', amount: '₹89,000', status: 'Completed', client: 'StartUp Solutions' }
          ],
          files: {
            gstFile: { name: 'GST_Certificate.pdf', size: '245 KB', uploadDate: '2024-01-15' },
            ndaFile: { name: 'NDA_Signed.pdf', size: '156 KB', uploadDate: '2024-01-15' },
            agreementFile: { name: 'Vendor_Agreement.pdf', size: '345 KB', uploadDate: '2024-01-15' }
          },
          documents: [
            { name: 'Business License.pdf', size: '256 KB', uploadDate: '2024-01-15' },
            { name: 'Insurance Certificate.pdf', size: '198 KB', uploadDate: '2024-01-20' },
            { name: 'Product Catalog.pdf', size: '2.1 MB', uploadDate: '2024-02-01' }
          ],
          performanceMetrics: {
            onTimeDelivery: 95,
            qualityRating: 4.8,
            responseTime: '2 hours',
            totalRevenue: '₹45,89,000'
          },
          contactHistory: [
            { date: '2024-06-20', type: 'Email', subject: 'Order delivery confirmation', status: 'Sent' },
            { date: '2024-06-18', type: 'Phone', subject: 'Product availability inquiry', status: 'Completed' },
            { date: '2024-06-15', type: 'Meeting', subject: 'Quarterly vendor review', status: 'Completed' }
          ]
        };
      }
      setVendor(sampleVendor);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleRatingChange = (newRating) => {
    // Update the vendor rating in state
    setVendor(prev => ({
      ...prev,
      rating: newRating
    }));

    // Update the rating in localStorage
    const savedVendors = localStorage.getItem('vendors');
    if (savedVendors) {
      const vendorsList = JSON.parse(savedVendors);
      const vendorIndex = vendorsList.findIndex(v => v.id === parseInt(id) || v.id === id || v.id.toString() === id);

      if (vendorIndex !== -1) {
        vendorsList[vendorIndex] = {
          ...vendorsList[vendorIndex],
          rating: newRating
        };
        localStorage.setItem('vendors', JSON.stringify(vendorsList));
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        onClick={() => handleRatingChange(index + 1)}
        className={`h-4 w-4 cursor-pointer transition-colors duration-200 hover:scale-110 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'
        }`}
        title={`Rate ${index + 1} star${index + 1 > 1 ? 's' : ''}`}
      />
    ));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const doc = new jsPDF();

    // Set up document styling
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Vendor Details Report', 14, 22);

    // Add vendor name
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246); // Blue color
    doc.text(vendor.name, 14, 35);

    // Add generation timestamp
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 45);

    // Vendor Basic Information
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Basic Information', 14, 60);

    const basicInfo = [
      ['Business Type', vendor.businessType],
      ['Type of Work', vendor.typeOfWork],
      ['Email', vendor.email],
      ['Phone', vendor.phone],
      ['Contact Person', vendor.contactPerson],
      ['Website', vendor.website],
      ['Tax ID', vendor.taxId],
      ['Status', vendor.status],
      ['Vendor Since', vendor.joinDate],
      ['Rating', `${vendor.rating}/5 stars`],
      ['Address', vendor.address],
      ['Location', [vendor.city, vendor.state, vendor.country].filter(Boolean).join(', ')],
      ['All Emails', vendor.allEmails ? vendor.allEmails.join(', ') : 'N/A'],
      ['All Phones', vendor.allPhones ? vendor.allPhones.join(', ') : 'N/A']
    ];

    doc.autoTable({
      startY: 65,
      head: [['Field', 'Value']],
      body: basicInfo,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 }
    });

    // Performance Metrics
    let currentY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Performance Metrics', 14, currentY);

    const performanceData = [
      ['On-Time Delivery', `${vendor.performanceMetrics.onTimeDelivery}%`],
      ['Quality Rating', vendor.performanceMetrics.qualityRating],
      ['Response Time', vendor.performanceMetrics.responseTime],
      ['Total Revenue', vendor.performanceMetrics.totalRevenue]
    ];

    doc.autoTable({
      startY: currentY + 5,
      head: [['Metric', 'Value']],
      body: performanceData,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      margin: { left: 14, right: 14 }
    });

    // Recent Orders (if there's space)
    currentY = doc.lastAutoTable.finalY + 15;
    if (currentY < 250) { // Check if there's enough space
      doc.setFontSize(14);
      doc.text('Recent Orders', 14, currentY);

      const ordersData = vendor.recentOrders.slice(0, 5).map(order => [
        order.id,
        order.client,
        order.date,
        order.amount,
        order.status
      ]);

      doc.autoTable({
        startY: currentY + 5,
        head: [['Order ID', 'Client', 'Date', 'Amount', 'Status']],
        body: ordersData,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [168, 85, 247], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [250, 245, 255] },
        margin: { left: 14, right: 14 }
      });
    }

    // Save the PDF
    const fileName = `vendor_${vendor.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Not Found</h2>
          <p className="text-gray-600 mb-4">The vendor you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/vendors')}
            className="btn-primary"
          >
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          /* Hide the entire layout structure except main content */
          body > div > div:first-child {
            display: none !important; /* Hide sidebar */
          }

          body > div > div:last-child > header {
            display: none !important; /* Hide header */
          }

          /* Reset body and main layout for print */
          body {
            font-size: 12px !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          /* Make main content area take full space */
          body > div {
            display: block !important;
            height: auto !important;
            background: white !important;
          }

          body > div > div:last-child {
            flex: none !important;
            display: block !important;
            overflow: visible !important;
          }

          body > div > div:last-child > main {
            flex: none !important;
            overflow: visible !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Hide navigation and non-essential elements */
          .no-print {
            display: none !important;
          }

          /* Hide sidebar completely */
          .print-hide-sidebar {
            display: none !important;
          }

          /* Make main content full width */
          .print-full-width {
            grid-column: 1 / -1 !important;
          }

          .print-break {
            page-break-after: always;
          }

          .bg-white {
            background: white !important;
          }

          .shadow, .shadow-sm, .shadow-md, .shadow-lg {
            box-shadow: none !important;
          }

          /* Remove borders and backgrounds for cleaner print */
          .card {
            border: 1px solid #e5e7eb !important;
            box-shadow: none !important;
            margin-bottom: 1rem !important;
            background: white !important;
          }

          /* Ensure proper spacing */
          .space-y-6 > * + * {
            margin-top: 1rem !important;
          }

          /* Hide interactive elements */
          button:not(.print-keep) {
            display: none !important;
          }

          a {
            color: black !important;
            text-decoration: none !important;
          }

          /* Optimize table printing */
          table {
            page-break-inside: avoid;
          }

          tr {
            page-break-inside: avoid;
          }

          /* Remove gradients and backgrounds */
          * {
            background-image: none !important;
          }

          .bg-gradient-to-br,
          .bg-gradient-to-b {
            background: white !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/vendors')}
              className="flex items-center text-gray-600 hover:text-gray-900 no-print"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Vendors
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
              <p className="text-gray-600">Vendor details and performance overview</p>
            </div>
          </div>
          <div className="flex space-x-3 no-print">
            <button
              onClick={handlePrint}
              className="btn-secondary flex items-center"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
            <button
              onClick={handleExport}
              className="btn-secondary flex items-center"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => navigate(`/vendors/${vendor.id}/edit`)}
              className="btn-primary flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Vendor
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 print-full-width space-y-6">
          {/* Vendor Overview */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Vendor Overview</h2>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {renderStars(vendor.rating)}
                  <span className="text-sm text-gray-600 ml-1">{vendor.rating}</span>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  vendor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {vendor.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Business Type</p>
                    <p className="text-sm font-medium text-gray-900">{vendor.businessType}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{vendor.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{vendor.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Contact Person</p>
                    <p className="text-sm font-medium text-gray-900">{vendor.contactPerson}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" 
                       className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {vendor.website}
                    </a>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Tax ID</p>
                  <p className="text-sm font-medium text-gray-900">{vendor.taxId}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Vendor Since</p>
                  <p className="text-sm font-medium text-gray-900">{vendor.joinDate}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-sm font-medium text-gray-900">{vendor.totalOrders}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Type of Work</p>
                  <p className="text-sm font-medium text-gray-900">{vendor.typeOfWork}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Address</h3>
              <p className="text-sm text-gray-900">{vendor.address}</p>
              {(vendor.city || vendor.state || vendor.country) && (
                <p className="text-sm text-gray-600 mt-1">
                  {[vendor.city, vendor.state, vendor.country].filter(Boolean).join(', ')}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
              <div className="space-y-2">
                {vendor.allEmails && vendor.allEmails.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">Email Addresses</p>
                    {vendor.allEmails.map((email, index) => (
                      <p key={index} className="text-sm text-gray-900">{email}</p>
                    ))}
                  </div>
                )}
                {vendor.allPhones && vendor.allPhones.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">Phone Numbers</p>
                    {vendor.allPhones.map((phone, index) => (
                      <p key={index} className="text-sm text-gray-900">{phone}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Company Logos */}
            {vendor.companyLogos && vendor.companyLogos.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Company Logos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {vendor.companyLogos.map((logo, index) => (
                    <div key={index} className="border rounded-lg p-2">
                      <img
                        src={logo.url || logo.preview}
                        alt={`Company Logo ${index + 1}`}
                        className="w-full h-20 object-contain"
                      />
                      <p className="text-xs text-gray-500 mt-1">{logo.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {vendor.description && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-sm text-gray-700">{vendor.description}</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Services Offered</h3>
              <div className="flex flex-wrap gap-2">
                {vendor.services.map((service, index) => (
                  <span key={index} className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{vendor.performanceMetrics.onTimeDelivery}%</div>
                <div className="text-sm text-gray-500">On-Time Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{vendor.performanceMetrics.qualityRating}</div>
                <div className="text-sm text-gray-500">Quality Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{vendor.performanceMetrics.responseTime}</div>
                <div className="text-sm text-gray-500">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{vendor.performanceMetrics.totalRevenue}</div>
                <div className="text-sm text-gray-500">Total Revenue</div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <button 
                onClick={() => navigate('/orders')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All Orders
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendor.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {order.id}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 print-hide-sidebar">
          {/* Contact History */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact History</h3>
            <div className="space-y-4">
              {vendor.contactHistory.map((contact, index) => (
                <div key={index} className="border-l-4 border-green-200 pl-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{contact.type}</p>
                    <p className="text-xs text-gray-500">{contact.date}</p>
                  </div>
                  <p className="text-sm text-gray-600">{contact.subject}</p>
                  <p className="text-xs text-green-600">{contact.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents & Files - Parallel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Specific Document Files */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Documents & Files</h3>

              <div className="grid grid-cols-1 gap-4">
                {/* GST File */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">GST File Upload</h4>
                  {vendor.files?.gstFile ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DocumentArrowDownIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{vendor.files.gstFile.name || 'GST Document'}</p>
                          <p className="text-xs text-gray-500">{vendor.files.gstFile.size || 'Unknown size'}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-900">
                        <DocumentArrowDownIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <DocumentArrowDownIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No GST document uploaded</p>
                    </div>
                  )}
                </div>

                {/* NDA File */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">NDA File Upload</h4>
                  {vendor.files?.ndaFile ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DocumentArrowDownIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{vendor.files.ndaFile.name || 'NDA Document'}</p>
                          <p className="text-xs text-gray-500">{vendor.files.ndaFile.size || 'Unknown size'}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-900">
                        <DocumentArrowDownIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <DocumentArrowDownIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No NDA document uploaded</p>
                    </div>
                  )}
                </div>

                {/* Agreement File */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Agreement File Upload</h4>
                  {vendor.files?.agreementFile ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DocumentArrowDownIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{vendor.files.agreementFile.name || 'Agreement Document'}</p>
                          <p className="text-xs text-gray-500">{vendor.files.agreementFile.size || 'Unknown size'}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-900">
                        <DocumentArrowDownIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <DocumentArrowDownIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No agreement document uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Other Documents */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Other Documents</h3>
              {vendor.documents && vendor.documents.length > 0 ? (
                <div className="space-y-3">
                  {vendor.documents.map((doc, index) => (
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
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DocumentArrowDownIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No other documents uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                Send Email
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                Schedule Meeting
              </button>
              <button 
                onClick={() => navigate('/orders/new')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
              >
                Create New Order
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default VendorView;
