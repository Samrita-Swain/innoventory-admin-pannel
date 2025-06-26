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
  CreditCardIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const ClientView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load client data from database service
  useEffect(() => {
    const loadClient = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading client data for ID:', id);

        // Import and use database service
        const { getClientById } = await import('../services/clientService');
        const clientData = await getClientById(id);

        if (clientData) {
          console.log('✅ Client data loaded:', clientData);
          setClient(clientData);
        } else {
          console.log('❌ Client not found');
          alert('Client not found');
          navigate('/clients');
        }
      } catch (error) {
        console.error('❌ Error loading client:', error);
        alert('Failed to load client data');
        navigate('/clients');
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [id, navigate]);

  // Print functionality
  const handlePrint = () => {
    const printContent = document.getElementById('client-print-content');
    const originalContent = document.body.innerHTML;

    // Create print-specific styles
    const printStyles = `
      <style>
        @media print {
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .card { border: 1px solid #ddd; margin-bottom: 20px; padding: 15px; }
          .grid { display: block; }
          .grid > div { margin-bottom: 15px; }
          h1 { font-size: 24px; margin-bottom: 10px; }
          h2 { font-size: 18px; margin-bottom: 8px; }
          .text-sm { font-size: 12px; }
          .text-gray-600 { color: #666; }
          .bg-green-100 { background-color: #f0f9ff; }
          .text-green-800 { color: #166534; }
        }
      </style>
    `;

    document.body.innerHTML = printStyles + printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore functionality
  };

  // Export to PDF functionality
  const handleExportPDF = async () => {
    try {
      const element = document.getElementById('client-print-content');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`client-${client.companyName || 'details'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Export to Excel functionality
  const handleExportExcel = () => {
    try {
      const workbook = XLSX.utils.book_new();

      // Client basic information
      const clientData = [
        ['Client Information', ''],
        ['Company Name', client.companyName || 'Not specified'],
        ['Company Type', client.companyType || 'Not specified'],
        ['Email', client.emails?.[0] || 'Not specified'],
        ['Phone', client.phones?.[0] || 'Not specified'],
        ['Website', client.website || 'Not specified'],
        ['GST Number', client.gstNumber || 'Not specified'],
        ['DPIIT Registered', client.dpitRegistered || 'Not specified'],
        ['Username', client.username || 'Not specified'],
        ['Onboarding Date', client.onboardingDate || 'Not specified'],
        [''],
        ['Address Information', ''],
        ['Address', client.address || 'Not specified'],
        ['Country', client.country || 'Not specified'],
        ['State', client.state || 'Not specified'],
        ['City', client.city || 'Not specified'],
      ];

      // Add additional emails if any
      if (client.emails && client.emails.length > 1) {
        clientData.push([''], ['Additional Emails', '']);
        client.emails.slice(1).forEach((email, index) => {
          clientData.push([`Email ${index + 2}`, email]);
        });
      }

      // Add additional phones if any
      if (client.phones && client.phones.length > 1) {
        clientData.push([''], ['Additional Phones', '']);
        client.phones.slice(1).forEach((phone, index) => {
          clientData.push([`Phone ${index + 2}`, phone]);
        });
      }

      const worksheet = XLSX.utils.aoa_to_sheet(clientData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Client Details');

      XLSX.writeFile(workbook, `client-${client.companyName || 'details'}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Failed to generate Excel file. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Client Not Found</h2>
          <p className="text-gray-600 mb-4">The client you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/clients')}
            className="btn-primary"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/clients')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Clients
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{client.company_name}</h1>
              <p className="text-gray-600">Client details and relationship overview</p>
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={handleExportPDF}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export as PDF
                </button>
                <button
                  onClick={handleExportExcel}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export as Excel
                </button>
              </div>
            </div>
            <button
              onClick={() => navigate(`/clients/${client.id}/edit`)}
              className="btn-primary flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Client
            </button>
          </div>
        </div>
      </div>

      <div id="client-print-content">
        <div className="print-only" style={{display: 'none'}}>
          <h1>{client.companyName}</h1>
          <p>Client Details and Information</p>
          <hr style={{margin: '20px 0'}} />
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Overview */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Client Overview</h2>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {client.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Company Name</p>
                    <p className="text-sm font-medium text-gray-900">{client.company_name || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Company Type</p>
                    <p className="text-sm font-medium text-gray-900">{client.company_type || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email Addresses</p>
                    <div>
                      {client.emails && client.emails.length > 0 ? (
                        client.emails.map((email, index) => (
                          <p key={index} className="text-sm font-medium text-gray-900">{email}</p>
                        ))
                      ) : (
                        <p className="text-sm font-medium text-gray-900">Not specified</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Numbers</p>
                    <div>
                      {client.phones && client.phones.length > 0 ? (
                        client.phones.map((phone, index) => (
                          <p key={index} className="text-sm font-medium text-gray-900">{phone}</p>
                        ))
                      ) : (
                        <p className="text-sm font-medium text-gray-900">Not specified</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="text-sm font-medium text-gray-900">{client.username || 'Not specified'}</p>
                  </div>
                </div>
                
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    {client.website ? (
                      <a href={client.website} target="_blank" rel="noopener noreferrer"
                         className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        {client.website}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-gray-900">Not specified</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CreditCardIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">GST Number</p>
                    <p className="text-sm font-medium text-gray-900">{client.gstNumber || 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">DPIIT Registered</p>
                  <p className="text-sm font-medium text-gray-900">
                    {client.dpiit_registered ? 'Yes' : 'No'}
                  </p>
                </div>

                {client.dpiit_registered && (
                  <div>
                    <p className="text-sm text-gray-500">DPIIT Number</p>
                    <p className="text-sm font-medium text-gray-900">{client.dpiit_number || 'Not specified'}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Onboarding Date</p>
                  <p className="text-sm font-medium text-gray-900">{client.onboarding_date || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Address</h3>
              <p className="text-sm text-gray-900">{client.address || 'Not specified'}</p>
              <div className="mt-2 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Country</p>
                  <p className="text-sm text-gray-900">{client.country || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">State</p>
                  <p className="text-sm text-gray-900">{client.state || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">City</p>
                  <p className="text-sm text-gray-900">{client.city || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {client.description && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-sm text-gray-700">{client.description}</p>
              </div>
            )}
          </div>

          {/* Uploaded Documents */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Uploaded Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {client.dpiit_registered && (
                <div>
                  <p className="text-sm font-medium text-gray-700">DPIIT Certificate</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {client.uploadedFiles?.dpiitCertificate ? (
                      <a href="#" className="text-blue-600 hover:text-blue-800">
                        {client.uploadedFiles.dpiitCertificate}
                      </a>
                    ) : (
                      'Not uploaded'
                    )}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700">TDS File</p>
                <p className="text-sm text-gray-500 mt-1">
                  {client.uploadedFiles?.tdsFile ? (
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      {client.uploadedFiles.tdsFile}
                    </a>
                  ) : (
                    'Not uploaded'
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">GST File</p>
                <p className="text-sm text-gray-500 mt-1">
                  {client.uploadedFiles?.gstFile ? (
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      {client.uploadedFiles.gstFile}
                    </a>
                  ) : (
                    'Not uploaded'
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">NDA</p>
                <p className="text-sm text-gray-500 mt-1">
                  {client.uploadedFiles?.ndaFile ? (
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      {client.uploadedFiles.ndaFile}
                    </a>
                  ) : (
                    'Not uploaded'
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Agreement</p>
                <p className="text-sm text-gray-500 mt-1">
                  {client.uploadedFiles?.agreementFile ? (
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      {client.uploadedFiles.agreementFile}
                    </a>
                  ) : (
                    'Not uploaded'
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Quotation</p>
                <p className="text-sm text-gray-500 mt-1">
                  {client.uploadedFiles?.quotationFile ? (
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      {client.uploadedFiles.quotationFile}
                    </a>
                  ) : (
                    'Not uploaded'
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Pan Card</p>
                <p className="text-sm text-gray-500 mt-1">
                  {client.uploadedFiles?.panCardFile ? (
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      {client.uploadedFiles.panCardFile}
                    </a>
                  ) : (
                    'Not uploaded'
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Udhyam Registration</p>
                <p className="text-sm text-gray-500 mt-1">
                  {client.uploadedFiles?.udhyamRegistrationFile ? (
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      {client.uploadedFiles.udhyamRegistrationFile}
                    </a>
                  ) : (
                    'Not uploaded'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Business Statistics */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{client.totalOrders || 0}</div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{client.totalSpent || '₹0'}</div>
                <div className="text-sm text-gray-500">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{client.created_at || client.joinDate || 'N/A'}</div>
                <div className="text-sm text-gray-500">Client Since</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  ₹{(() => {
                    const totalSpent = client.totalSpent || '₹0';
                    const totalOrders = client.totalOrders || 1;
                    if (typeof totalSpent === 'string' && totalSpent.includes('₹')) {
                      const amount = parseFloat(totalSpent.replace('₹', '').replace(/,/g, ''));
                      return (amount / totalOrders).toFixed(0);
                    }
                    return '0';
                  })()}
                </div>
                <div className="text-sm text-gray-500">Avg Order Value</div>
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
                  {(client.recentOrders || []).map((order) => (
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
        <div className="space-y-6">
          {/* Contact History */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact History</h3>
            <div className="space-y-4">
              {(client.contactHistory || []).map((contact, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
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

          {/* Documents */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
            <div className="space-y-3">
              {(client.documents || []).map((doc, index) => (
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
    </div>
  );
};

export default ClientView;
