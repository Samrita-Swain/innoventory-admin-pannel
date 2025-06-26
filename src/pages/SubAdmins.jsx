import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, KeyIcon, ShieldCheckIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../components/DataTable/DataTable';

const SubAdmins = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    subAdminOnboardingDate: '',
    name: '',
    email: '',
    address: '',
    country: '',
    state: '',
    city: '',
    username: '',
    panNumber: '',
    termOfWork: '',
    // Legacy fields for compatibility
    role: '',
    permissions: [],
    status: 'Active'
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    tdsFile: [],
    ndaFile: [],
    employmentAgreement: [],
    panCard: []
  });

  // Demo data for display (not saved to database)
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const demoSubAdmins = [
    {
      id: 'demo-admin-1',
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
      id: 'demo-admin-2',
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
      id: 'demo-admin-3',
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
    },
  ];

  // Load sub-admins from database
  useEffect(() => {
    const loadSubAdmins = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading sub-admins from database...');
        // Import and use database service
        const { getAllSubAdmins } = await import('../services/database');
        const dbSubAdmins = await getAllSubAdmins();
        console.log('✅ Sub-admins loaded:', dbSubAdmins);
        setSubAdmins(dbSubAdmins);
      } catch (err) {
        console.error('❌ Error loading sub-admins:', err);
        // Fallback to demo data if database fails
        setSubAdmins(demoSubAdmins);
      } finally {
        setLoading(false);
      }
    };

    loadSubAdmins();
  }, []);

  const availablePermissions = [
    'Dashboard',
    'Clients',
    'Vendors',
    'Orders',
    'Reports',
    'Users',
    'Support',
    'Settings'
  ];

  // Country, State, City data
  const locationData = {
    India: {
      Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
      Karnataka: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
      Delhi: ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
      Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar']
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset dependent dropdowns
    if (name === 'country') {
      setFormData(prev => ({ ...prev, state: '', city: '' }));
    } else if (name === 'state') {
      setFormData(prev => ({ ...prev, city: '' }));
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log('Uploaded Files:', uploadedFiles);
    // Here you would typically send the data to your backend
    setShowAddForm(false);
    // Reset form
    setFormData({
      subAdminOnboardingDate: '',
      name: '',
      email: '',
      address: '',
      country: '',
      state: '',
      city: '',
      username: '',
      panNumber: '',
      termOfWork: '',
      role: '',
      permissions: [],
      status: 'Active'
    });
    setUploadedFiles({
      tdsFile: [],
      ndaFile: [],
      employmentAgreement: [],
      panCard: []
    });
  };

  // DataTable columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      filterable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      filterable: true
    },
    {
      key: 'username',
      label: 'Username',
      sortable: true,
      filterable: true
    },
    {
      key: 'termOfWork',
      label: 'Term of Work',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Full-time' ? 'bg-green-100 text-green-800' :
          value === 'Part-time' ? 'bg-blue-100 text-blue-800' :
          value === 'Contract' ? 'bg-yellow-100 text-yellow-800' :
          value === 'Internship' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'subAdminOnboardingDate',
      label: 'Onboarding Date',
      sortable: true,
      filterable: false
    },
    {
      key: 'city',
      label: 'Location',
      sortable: true,
      filterable: true,
      render: (value, row) => `${row.city}, ${row.state}`
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      filterable: false,
      render: (value, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/sub-admins/${row.id}`)}
            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
            title="View Sub-admin"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(`/sub-admins/${row.id}/edit`)}
            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
            title="Edit Sub-admin"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
            title="Delete Sub-admin"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sub-admins</h1>
          <p className="mt-2 text-gray-600">Manage administrative users and permissions</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Sub-admin
        </button>
      </div>

      {/* Sub-admins Table */}
      <DataTable
        data={subAdmins}
        columns={columns}
        title="Sub-admins Management"
        defaultPageSize={50}
        enableExport={true}
        enableColumnToggle={true}
        enableFiltering={true}
        enableSorting={true}
      />

      {/* Permission Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Overview</h3>
          <div className="space-y-3">
            {availablePermissions.map((permission, index) => {
              const adminCount = subAdmins.filter(admin => 
                admin.permissions.includes(permission) && admin.status === 'Active'
              ).length;
              return (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-900">{permission}</span>
                  <span className="text-sm font-medium text-gray-600">
                    {adminCount} admin{adminCount !== 1 ? 's' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Sub-admins:</span>
              <span className="text-lg font-semibold text-gray-900">{subAdmins.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Sub-admins:</span>
              <span className="text-lg font-semibold text-green-600">
                {subAdmins.filter(admin => admin.status === 'Active').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Inactive Sub-admins:</span>
              <span className="text-lg font-semibold text-red-600">
                {subAdmins.filter(admin => admin.status === 'Inactive').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Sub-admin Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowAddForm(false)}></div>
            <div className="relative bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Create New Sub-admin</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Personal Information</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub-admin Onboarding Date *
                      </label>
                      <input
                        type="date"
                        name="subAdminOnboardingDate"
                        value={formData.subAdminOnboardingDate}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email ID *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="input-field"
                        placeholder="Enter complete address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="">Select Country</option>
                        {Object.keys(locationData).map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="input-field"
                        disabled={!formData.country}
                      >
                        <option value="">Select State</option>
                        {formData.country && locationData[formData.country] &&
                          Object.keys(locationData[formData.country]).map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))
                        }
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="input-field"
                        disabled={!formData.state}
                      >
                        <option value="">Select City</option>
                        {formData.state && locationData[formData.country] && locationData[formData.country][formData.state] &&
                          locationData[formData.country][formData.state].map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Professional Information</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username *
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Enter username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PAN Number
                      </label>
                      <input
                        type="text"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter PAN number"
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                        title="Please enter a valid PAN number (e.g., ABCDE1234F)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Term of Work *
                      </label>
                      <select
                        name="termOfWork"
                        value={formData.termOfWork}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select term of work</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="mt-8">
                  <h4 className="text-md font-medium text-gray-900 mb-6">File Upload Section</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* TDS File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        TDS File
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p className="text-xs text-gray-500">Upload TDS File</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                            onChange={(e) => handleFileUpload('tdsFile', e.target.files)}
                            multiple
                          />
                        </label>
                      </div>
                      {uploadedFiles.tdsFile && uploadedFiles.tdsFile.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.tdsFile.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('tdsFile', index)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* NDA File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NDA (Required) *
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p className="text-xs text-gray-500">Upload NDA</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                            onChange={(e) => handleFileUpload('ndaFile', e.target.files)}
                            multiple
                            required
                          />
                        </label>
                      </div>
                      {uploadedFiles.ndaFile && uploadedFiles.ndaFile.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.ndaFile.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('ndaFile', index)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Employment Agreement Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Agreement (Required) *
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p className="text-xs text-gray-500">Upload Employment Agreement</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                            onChange={(e) => handleFileUpload('employmentAgreement', e.target.files)}
                            multiple
                            required
                          />
                        </label>
                      </div>
                      {uploadedFiles.employmentAgreement && uploadedFiles.employmentAgreement.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.employmentAgreement.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('employmentAgreement', index)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* PAN Card Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PAN Card
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p className="text-xs text-gray-500">Upload PAN Card</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                            onChange={(e) => handleFileUpload('panCard', e.target.files)}
                            multiple
                          />
                        </label>
                      </div>
                      {uploadedFiles.panCard && uploadedFiles.panCard.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.panCard.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('panCard', index)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    Max file size: 5MB. Supported formats: PDF, Images, MS Office documents.
                  </p>
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
                    Create Sub-admin
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

export default SubAdmins;
