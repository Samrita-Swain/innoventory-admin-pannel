import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, DocumentIcon } from '@heroicons/react/24/outline';

const SubAdminView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subAdmin, setSubAdmin] = useState(null);

  // Sample data - in real app, this would come from API
  const sampleSubAdmins = [
    {
      id: 1,
      subAdminOnboardingDate: '2024-01-15',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@innoventory.com',
      address: '123 Business Street, Suite 100, New York, NY 10001',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      username: 'sarah.johnson',
      panNumber: 'ABCDE1234F',
      termOfWork: 'Full-time',
      role: 'Senior Admin',
      permissions: ['Users', 'Orders', 'Reports'],
      status: 'Active',
      lastLogin: '2024-06-25 09:30 AM',
      createdDate: '2024-01-15',
      uploadedFiles: {
        tdsFile: [{ name: 'sarah_tds_2024.pdf', url: '/uploads/sarah_tds.pdf' }],
        ndaFile: [{ name: 'sarah_nda.pdf', url: '/uploads/sarah_nda.pdf' }],
        employmentAgreement: [{ name: 'sarah_employment.pdf', url: '/uploads/sarah_employment.pdf' }],
        panCard: [{ name: 'sarah_pan.pdf', url: '/uploads/sarah_pan.pdf' }]
      }
    },
    {
      id: 2,
      subAdminOnboardingDate: '2024-02-20',
      name: 'Mike Chen',
      email: 'mike.chen@innoventory.com',
      address: '456 Tech Park, Building B, Bangalore, Karnataka 560001',
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      username: 'mike.chen',
      panNumber: 'FGHIJ5678K',
      termOfWork: 'Contract',
      role: 'Operations Admin',
      permissions: ['Orders', 'Vendors'],
      status: 'Active',
      lastLogin: '2024-06-24 04:15 PM',
      createdDate: '2024-02-20',
      uploadedFiles: {
        tdsFile: [{ name: 'mike_tds_2024.pdf', url: '/uploads/mike_tds.pdf' }],
        ndaFile: [{ name: 'mike_nda.pdf', url: '/uploads/mike_nda.pdf' }],
        employmentAgreement: [{ name: 'mike_contract.pdf', url: '/uploads/mike_contract.pdf' }],
        panCard: [{ name: 'mike_pan.pdf', url: '/uploads/mike_pan.pdf' }]
      }
    },
    {
      id: 3,
      subAdminOnboardingDate: '2024-03-10',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@innoventory.com',
      address: '789 Support Center, Floor 3, Delhi, Delhi 110001',
      country: 'India',
      state: 'Delhi',
      city: 'New Delhi',
      username: 'emily.rodriguez',
      panNumber: 'LMNOP9012Q',
      termOfWork: 'Part-time',
      role: 'Support Admin',
      permissions: ['Clients', 'Support'],
      status: 'Inactive',
      lastLogin: '2024-06-20 11:45 AM',
      createdDate: '2024-03-10',
      uploadedFiles: {
        tdsFile: [],
        ndaFile: [{ name: 'emily_nda.pdf', url: '/uploads/emily_nda.pdf' }],
        employmentAgreement: [{ name: 'emily_employment.pdf', url: '/uploads/emily_employment.pdf' }],
        panCard: [{ name: 'emily_pan.pdf', url: '/uploads/emily_pan.pdf' }]
      }
    }
  ];

  useEffect(() => {
    // Find sub-admin by ID
    const foundSubAdmin = sampleSubAdmins.find(admin => admin.id === parseInt(id));
    setSubAdmin(foundSubAdmin);
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // In a real application, this would generate and download a PDF
    alert('Export functionality would be implemented here');
  };

  if (!subAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sub-admin Not Found</h2>
          <p className="text-gray-600 mb-4">The requested sub-admin could not be found.</p>
          <button
            onClick={() => navigate('/sub-admins')}
            className="btn-primary"
          >
            Back to Sub-admins
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/sub-admins')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{subAdmin.name}</h1>
            <p className="text-gray-600">Sub-admin Details</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handlePrint}
            className="btn-secondary"
          >
            Print
          </button>
          <button
            onClick={handleExport}
            className="btn-secondary"
          >
            Export PDF
          </button>
          <button
            onClick={() => navigate(`/sub-admins/${id}/edit`)}
            className="btn-primary flex items-center"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
      </div>

      {/* Sub-admin Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Onboarding Date</label>
                <p className="text-sm text-gray-900">{subAdmin.subAdminOnboardingDate || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-sm text-gray-900">{subAdmin.name || 'Not specified'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{subAdmin.email || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Username</label>
                <p className="text-sm text-gray-900">{subAdmin.username || 'Not specified'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="text-sm text-gray-900">{subAdmin.address || 'Not specified'}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Country</label>
                <p className="text-sm text-gray-900">{subAdmin.country || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">State</label>
                <p className="text-sm text-gray-900">{subAdmin.state || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">City</label>
                <p className="text-sm text-gray-900">{subAdmin.city || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">PAN Number</label>
                <p className="text-sm text-gray-900">{subAdmin.panNumber || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Term of Work</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  subAdmin.termOfWork === 'Full-time' ? 'bg-green-100 text-green-800' :
                  subAdmin.termOfWork === 'Part-time' ? 'bg-blue-100 text-blue-800' :
                  subAdmin.termOfWork === 'Contract' ? 'bg-yellow-100 text-yellow-800' :
                  subAdmin.termOfWork === 'Internship' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {subAdmin.termOfWork || 'Not specified'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  subAdmin.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {subAdmin.status}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Login</label>
                <p className="text-sm text-gray-900">{subAdmin.lastLogin || 'Never'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Permissions</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {subAdmin.permissions && subAdmin.permissions.length > 0 ? (
                  subAdmin.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {permission}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-900">No permissions assigned</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* TDS Files */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">TDS Files</h4>
            {subAdmin.uploadedFiles?.tdsFile && subAdmin.uploadedFiles.tdsFile.length > 0 ? (
              <div className="space-y-2">
                {subAdmin.uploadedFiles.tdsFile.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                    </div>
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No TDS files uploaded</p>
            )}
          </div>

          {/* NDA Files */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">NDA Files</h4>
            {subAdmin.uploadedFiles?.ndaFile && subAdmin.uploadedFiles.ndaFile.length > 0 ? (
              <div className="space-y-2">
                {subAdmin.uploadedFiles.ndaFile.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                    </div>
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No NDA files uploaded</p>
            )}
          </div>

          {/* Employment Agreement Files */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Employment Agreement</h4>
            {subAdmin.uploadedFiles?.employmentAgreement && subAdmin.uploadedFiles.employmentAgreement.length > 0 ? (
              <div className="space-y-2">
                {subAdmin.uploadedFiles.employmentAgreement.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                    </div>
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No employment agreement files uploaded</p>
            )}
          </div>

          {/* PAN Card Files */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">PAN Card</h4>
            {subAdmin.uploadedFiles?.panCard && subAdmin.uploadedFiles.panCard.length > 0 ? (
              <div className="space-y-2">
                {subAdmin.uploadedFiles.panCard.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                    </div>
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No PAN card files uploaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAdminView;
