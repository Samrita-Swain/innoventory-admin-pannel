import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../components/DataTable/DataTable';
import FileUpload from '../components/FileUpload/FileUpload';

// Country-State-City data
const countryStateCity = {
  'India': {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi']
  },
  'United States': {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Tallahassee']
  },
  'United Kingdom': {
    'England': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'],
    'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Stirling'],
    'Wales': ['Cardiff', 'Swansea', 'Newport', 'Bangor', 'St. Davids']
  }
};

const Clients = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    onboardingDate: '',
    companyType: '',
    companyName: '',
    emails: [''],
    phones: [''],
    address: '',
    country: '',
    state: '',
    city: '',
    username: '',
    gstNumber: '',
    dpiitRegistered: '',
    validTill: '',
    website: '',
    description: '',
    creditLimit: '',
    paymentTerms: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    dpiitCertificate: [],
    tdsFile: [],
    gstFile: [],
    ndaFile: [],
    agreementFile: [],
    quotationFile: [],
    panCardFile: [],
    udhyamRegistrationFile: [],
    othersFile: []
  });
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  // Demo data for display (not saved to database)
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const demoClients = [
    {
      id: 'demo-client-1',
      onboarding_date: '2024-01-10',
      company_type: 'Startup',
      company_name: 'Acme Corporation',
      emails: ['contact@acme.com', 'support@acme.com'],
      phones: ['+1-555-123-4567', '+1-555-123-4568'],
      address: '123 Business St, New York, NY 10001',
      country: 'United States',
      state: 'New York',
      city: 'New York City',
      dpiit_registered: true,
      dpiit_number: 'DPIIT2024001',
      status: 'Active',
      created_at: '2024-01-10'
    },
    {
      id: 'demo-client-2',
      onboarding_date: '2024-02-15',
      company_type: 'MSME',
      company_name: 'Global Tech Inc',
      emails: ['info@globaltech.com'],
      phones: ['+1-555-234-5678'],
      address: '456 Industrial Ave, Chicago, IL 60601',
      country: 'United States',
      state: 'Texas',
      city: 'Houston',
      dpiit_registered: false,
      dpiit_number: '',
      status: 'Active',
      created_at: '2024-02-15'
    },
    {
      id: 'demo-client-3',
      onboarding_date: '2024-03-01',
      company_type: 'Small Entity',
      company_name: 'StartUp Solutions',
      emails: ['hello@startupsolutions.com'],
      phones: ['+1-555-345-6789'],
      address: '789 Startup Blvd, San Francisco, CA 94102',
      country: 'United States',
      state: 'California',
      city: 'Los Angeles',
      dpiit_registered: true,
      dpiit_number: 'DPIIT2024003',
      status: 'Inactive',
      created_at: '2024-03-01'
    },
  ];

  // Load clients from database
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading clients from database...');
        // Import and use client service
        const { getAllClients } = await import('../services/clientService');
        const dbClients = await getAllClients();
        console.log('✅ Clients loaded:', dbClients);
        console.log('📊 First client structure:', dbClients[0]);

        console.log('✅ Clients loaded:', dbClients);
        console.log('📊 First client structure:', dbClients[0]);
        setClients(dbClients);
      } catch (err) {
        console.error('❌ Error loading clients:', err);
        // Fallback to demo data if database fails
        setClients(demoClients);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  // Handle client deletion
  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(true);
      console.log('🗑️ Deleting client:', clientId);

      // Import and use database service
      const { deleteClient } = await import('../services/clientService');
      await deleteClient(clientId);

      // Remove client from local state
      setClients(prevClients => prevClients.filter(client => client.id !== clientId));

      console.log('✅ Client deleted successfully');
      alert('Client deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting client:', error);
      alert('Failed to delete client. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      key: 'company_name',
      label: 'Company Name',
      sortable: true,
      filterable: true
    },
    {
      key: 'company_type',
      label: 'Company Type',
      sortable: true,
      filterable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div>
          {Array.isArray(row.emails) ? row.emails[0] : row.email}
          {Array.isArray(row.emails) && row.emails.length > 1 && (
            <span className="text-xs text-gray-500 block">+{row.emails.length - 1} more</span>
          )}
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: false,
      filterable: true,
      render: (value, row) => (
        <div>
          {Array.isArray(row.phones) ? row.phones[0] : row.phone}
          {Array.isArray(row.phones) && row.phones.length > 1 && (
            <span className="text-xs text-gray-500 block">+{row.phones.length - 1} more</span>
          )}
        </div>
      )
    },
    {
      key: 'onboarding_date',
      label: 'Onboarding Date',
      sortable: true,
      filterable: true
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'Active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Join Date',
      sortable: true,
      filterable: false
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      filterable: false,
      render: (value, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/clients/${row.id}`)}
            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
            title="View Client"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(`/clients/${row.id}/edit`)}
            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
            title="Edit Client"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteClient(row.id)}
            disabled={deleteLoading}
            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded disabled:opacity-50"
            title="Delete Client"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData(prev => ({
      ...prev,
      country: selectedCountry,
      state: '',
      city: ''
    }));

    setAvailableStates(Object.keys(countryStateCity[selectedCountry] || {}));
    setAvailableCities([]);
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData(prev => ({
      ...prev,
      state: selectedState,
      city: ''
    }));

    setAvailableCities(countryStateCity[formData.country]?.[selectedState] || []);
  };

  const addEmailField = () => {
    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, '']
    }));
  };

  const removeEmailField = (index) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index)
    }));
  };

  const handleEmailChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.map((email, i) => i === index ? value : email)
    }));
  };

  const addPhoneField = () => {
    setFormData(prev => ({
      ...prev,
      phones: [...prev.phones, '']
    }));
  };

  const removePhoneField = (index) => {
    setFormData(prev => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index)
    }));
  };

  const handlePhoneChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      phones: prev.phones.map((phone, i) => i === index ? value : phone)
    }));
  };

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
      onboardingDate: '',
      companyType: '',
      companyName: '',
      emails: [''],
      phones: [''],
      address: '',
      country: '',
      state: '',
      city: '',
      username: '',
      gstNumber: '',
      dpiitRegistered: '',
      validTill: '',
      website: '',
      description: '',
      creditLimit: '',
      paymentTerms: ''
    });
    setUploadedFiles({
      dpiitCertificate: [],
      tdsFile: [],
      gstFile: [],
      ndaFile: [],
      agreementFile: [],
      quotationFile: [],
      panCardFile: [],
      udhyamRegistrationFile: [],
      othersFile: []
    });
    setAvailableStates([]);
    setAvailableCities([]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="mt-2 text-gray-600">Manage your client relationships</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Client
        </button>
      </div>

      {/* Clients Table */}
      <DataTable
        data={clients}
        columns={columns}
        title="Clients Management"
        defaultPageSize={50}
        enableExport={true}
        enableColumnToggle={true}
        enableFiltering={true}
        enableSorting={true}
      />

      {/* Add Client Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowAddForm(false)}></div>
            <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Add New Client</h3>
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
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Basic Information</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client Onboarding Date *
                      </label>
                      <input
                        type="date"
                        name="onboardingDate"
                        value={formData.onboardingDate}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type of Company *
                      </label>
                      <select
                        name="companyType"
                        value={formData.companyType}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select company type</option>
                        <option value="Startup">Startup</option>
                        <option value="DPIIT">DPIIT</option>
                        <option value="MSME">MSME</option>
                        <option value="Small Entity">Small Entity</option>
                        <option value="Large Entity">Large Entity</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name / Individual Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Enter company or individual name"
                      />
                    </div>

                    {/* Email Fields */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company's Email Id *
                      </label>
                      {formData.emails.map((email, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => handleEmailChange(index, e.target.value)}
                            required={index === 0}
                            className="flex-1 input-field"
                            placeholder="Enter email address"
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeEmailField(index)}
                              className="px-3 py-2 text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addEmailField}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + Add Another Email
                      </button>
                    </div>

                    {/* Phone Fields */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company's Phone Number *
                      </label>
                      {formData.phones.map((phone, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => handlePhoneChange(index, e.target.value)}
                            required={index === 0}
                            className="flex-1 input-field"
                            placeholder="Enter phone number"
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removePhoneField(index)}
                              className="px-3 py-2 text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addPhoneField}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + Add Another Phone
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company's Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="input-field"
                        placeholder="Complete company address"
                      />
                    </div>
                  </div>

                  {/* Location and Additional Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Location & Additional Information</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleCountryChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select Country</option>
                        {Object.keys(countryStateCity).map(country => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleStateChange}
                        required
                        className="input-field"
                        disabled={!formData.country}
                      >
                        <option value="">Select State</option>
                        {availableStates.map(state => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        disabled={!formData.state}
                      >
                        <option value="">Select City</option>
                        {availableCities.map(city => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GST Number
                      </label>
                      <input
                        type="text"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter GST number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        DPIIT Registered *
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="dpiitRegistered"
                            value="yes"
                            checked={formData.dpiitRegistered === 'yes'}
                            onChange={handleInputChange}
                            required
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="dpiitRegistered"
                            value="no"
                            checked={formData.dpiitRegistered === 'no'}
                            onChange={handleInputChange}
                            required
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    </div>

                    {formData.dpiitRegistered === 'yes' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valid Till *
                          </label>
                          <input
                            type="date"
                            name="validTill"
                            value={formData.validTill}
                            onChange={handleInputChange}
                            required
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            DPIIT Certificate *
                          </label>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> DPIIT Certificate
                                </p>
                                <p className="text-xs text-gray-500">PDF, Images, Word, Excel, PowerPoint (MAX. 5MB)</p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                                onChange={(e) => handleFileUpload('dpiitCertificate', e.target.files)}
                                multiple
                                required
                              />
                            </label>
                          </div>
                          {uploadedFiles.dpiitCertificate && uploadedFiles.dpiitCertificate.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                              <div className="space-y-1">
                                {uploadedFiles.dpiitCertificate.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <span className="text-sm text-gray-700">{file.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeFile('dpiitCertificate', index)}
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
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="https://company.com"
                      />
                    </div>

                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="input-field"
                    placeholder="Brief description of the client and business relationship"
                  />
                </div>

                {/* File Upload Section */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">File Upload Section</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* TDS File */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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

                    {/* GST File */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GST File
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p className="text-xs text-gray-500">Upload GST File</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                            onChange={(e) => handleFileUpload('gstFile', e.target.files)}
                            multiple
                          />
                        </label>
                      </div>
                      {uploadedFiles.gstFile && uploadedFiles.gstFile.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.gstFile.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('gstFile', index)}
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

                    {/* NDA File */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NDA *
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

                    {/* Agreement File */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Agreement *
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p className="text-xs text-gray-500">Upload Agreement</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                            onChange={(e) => handleFileUpload('agreementFile', e.target.files)}
                            multiple
                            required
                          />
                        </label>
                      </div>
                      {uploadedFiles.agreementFile && uploadedFiles.agreementFile.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.agreementFile.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('agreementFile', index)}
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

                    {/* Quotation File */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quotation *
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p className="text-xs text-gray-500">Upload Quotation</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                            onChange={(e) => handleFileUpload('quotationFile', e.target.files)}
                            multiple
                            required
                          />
                        </label>
                      </div>
                      {uploadedFiles.quotationFile && uploadedFiles.quotationFile.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.quotationFile.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('quotationFile', index)}
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

                    {/* Pan Card File */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pan Card *
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p className="text-xs text-gray-500">Upload Pan Card</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                            onChange={(e) => handleFileUpload('panCardFile', e.target.files)}
                            multiple
                            required
                          />
                        </label>
                      </div>
                      {uploadedFiles.panCardFile && uploadedFiles.panCardFile.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.panCardFile.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('panCardFile', index)}
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

                    {/* Udhyam Registration File */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Udhyam Registration
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p className="text-xs text-gray-500">Upload Udhyam Registration</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                            onChange={(e) => handleFileUpload('udhyamRegistrationFile', e.target.files)}
                            multiple
                          />
                        </label>
                      </div>
                      {uploadedFiles.udhyamRegistrationFile && uploadedFiles.udhyamRegistrationFile.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.udhyamRegistrationFile.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('udhyamRegistrationFile', index)}
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

                    {/* Others File */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Others
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p className="text-xs text-gray-500">Upload Other Files</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                            onChange={(e) => handleFileUpload('othersFile', e.target.files)}
                            multiple
                          />
                        </label>
                      </div>
                      {uploadedFiles.othersFile && uploadedFiles.othersFile.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                          <div className="space-y-1">
                            {uploadedFiles.othersFile.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('othersFile', index)}
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
                    Save Client
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

export default Clients;
