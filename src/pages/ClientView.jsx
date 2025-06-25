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

const ClientView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample client data - in real app, this would come from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleClient = {
        id: id || '1',
        onboardingDate: '2024-01-10',
        companyType: 'Startup',
        companyName: 'Acme Corporation',
        emails: ['contact@acme.com', 'support@acme.com'],
        phones: ['+1-555-123-4567', '+1-555-123-4568'],
        address: '123 Business St, New York, NY 10001',
        country: 'United States',
        state: 'New York',
        city: 'New York City',
        username: 'acmecorp',
        gstNumber: 'GST123456789',
        dpiitRegistered: 'yes',
        validTill: '2025-12-31',
        website: 'https://acme.com',
        status: 'Active',
        joinDate: '2024-01-10',
        totalOrders: 28,
        totalSpent: '₹45,23,000',
        description: 'Leading technology company specializing in innovative software solutions and digital transformation services.',
        uploadedFiles: {
          dpiitCertificate: 'dpiit_certificate_acme.pdf',
          tdsFile: 'tds_file_acme.pdf',
          gstFile: 'gst_certificate_acme.pdf',
          ndaFile: 'nda_agreement_acme.pdf',
          agreementFile: 'service_agreement_acme.pdf',
          quotationFile: 'quotation_2024_acme.pdf',
          panCardFile: 'pan_card_acme.pdf',
          udhyamRegistrationFile: 'udhyam_registration_acme.pdf'
        },
        recentOrders: [
          { id: 'ORD-001', date: '2024-06-20', amount: '₹2,45,000', status: 'Completed' },
          { id: 'ORD-015', date: '2024-06-15', amount: '₹1,89,000', status: 'Processing' },
          { id: 'ORD-012', date: '2024-06-10', amount: '₹3,20,000', status: 'Completed' }
        ],
        documents: [
          { name: 'Service Agreement.pdf', size: '245 KB', uploadDate: '2024-01-10' },
          { name: 'Business License.pdf', size: '156 KB', uploadDate: '2024-01-10' },
          { name: 'Insurance Certificate.pdf', size: '198 KB', uploadDate: '2024-01-15' }
        ],
        contactHistory: [
          { date: '2024-06-20', type: 'Email', subject: 'Order confirmation for ORD-001', status: 'Sent' },
          { date: '2024-06-15', type: 'Phone', subject: 'Follow-up on pending order', status: 'Completed' },
          { date: '2024-06-10', type: 'Meeting', subject: 'Quarterly business review', status: 'Completed' }
        ]
      };
      setClient(sampleClient);
      setLoading(false);
    }, 500);
  }, [id]);

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
              <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-gray-600">Client details and relationship overview</p>
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
              onClick={() => navigate(`/clients/${client.id}/edit`)}
              className="btn-primary flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Client
            </button>
          </div>
        </div>
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
                    <p className="text-sm font-medium text-gray-900">{client.companyName || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Company Type</p>
                    <p className="text-sm font-medium text-gray-900">{client.companyType || 'Not specified'}</p>
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
                    {client.dpiitRegistered === 'yes' ? 'Yes' : client.dpiitRegistered === 'no' ? 'No' : 'Not specified'}
                  </p>
                </div>

                {client.dpiitRegistered === 'yes' && (
                  <div>
                    <p className="text-sm text-gray-500">Valid Till</p>
                    <p className="text-sm font-medium text-gray-900">{client.validTill || 'Not specified'}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Onboarding Date</p>
                  <p className="text-sm font-medium text-gray-900">{client.onboardingDate || 'Not specified'}</p>
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
              {client.dpiitRegistered === 'yes' && (
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
                <div className="text-3xl font-bold text-blue-600">{client.totalOrders}</div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{client.totalSpent}</div>
                <div className="text-sm text-gray-500">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{client.joinDate}</div>
                <div className="text-sm text-gray-500">Client Since</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  ₹{(parseFloat(client.totalSpent.replace('₹', '').replace(/,/g, '')) / client.totalOrders).toFixed(0)}
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
                  {client.recentOrders.map((order) => (
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
              {client.contactHistory.map((contact, index) => (
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
              {client.documents.map((doc, index) => (
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
  );
};

export default ClientView;
