import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import DataTable from '../components/DataTable/DataTable';
import FileUpload from '../components/FileUpload/FileUpload';
import { getAllVendors, createVendor, deleteVendor, getVendorStats } from '../services/vendorService';
import { getActiveTypeOfWork } from '../services/typeOfWorkService';
import { getAllStates, getCitiesByStateName } from '../services/locationService';

// Removed demo data - using only database data

const Vendors = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    onboardingDate: '',
    emails: [''],
    phones: [''],
    address: '',
    country: '',
    state: '',
    city: '',
    username: '',
    gstNumber: '',
    description: '',
    services: [],
    website: '',
    typeOfWork: '',
    status: 'Pending'
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    gstFile: null,
    ndaFile: null,
    agreementFile: null,
    companyLogos: []
  });
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [vendorsList, setVendorsList] = useState([]);
  const [typeOfWorkOptions, setTypeOfWorkOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  // Load vendors from database
  const loadVendors = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading vendors from database...');
      console.log('🔗 Database connection test starting...');
      const dbVendors = await getAllVendors();
      console.log('✅ Database connection successful!');
      console.log('✅ Vendors loaded:', dbVendors.length, 'records');

      console.log('✅ Vendors loaded:', dbVendors.length, 'records');

      setVendorsList(dbVendors || []);
      setError(null);
    } catch (err) {
      console.error('❌ Database connection failed:', err);
      console.error('❌ Error details:', err.message);
      setError('Failed to load vendors from database: ' + err.message);
      setVendorsList([]);
    } finally {
      setLoading(false);
    }
  };



  // Load type of work options
  const loadTypeOfWork = async () => {
    try {
      const workTypes = await getActiveTypeOfWork();
      setTypeOfWorkOptions(workTypes);
    } catch (err) {
      console.error('Error loading type of work:', err);
    }
  };

  // Load states from government API
  const loadStates = async () => {
    try {
      setLoadingStates(true);
      console.log('🔄 Loading states from government API...');
      const states = await getAllStates();
      setAvailableStates(states);
      console.log(`✅ Loaded ${states.length} states`);
    } catch (error) {
      console.error('❌ Error loading states:', error);
    } finally {
      setLoadingStates(false);
    }
  };

  // Load cities for selected state
  const loadCities = async (stateName) => {
    try {
      setLoadingCities(true);
      console.log(`🔄 Loading cities for state ${stateName}...`);
      const cities = await getCitiesByStateName(stateName);
      setAvailableCities(cities);
      console.log(`✅ Loaded ${cities.length} cities`);
    } catch (error) {
      console.error('❌ Error loading cities:', error);
      setAvailableCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadVendors();
    loadTypeOfWork();
    loadStates();
  }, []);

  // Country, State, City data
  const countryStateCity = {
    'India': {
      'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
      'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
      'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi'],
      'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
      'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner'],
      'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
      'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi']
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
      'Wales': ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry']
    }
  };




  const columns = [
    {
      key: 'company_name',
      label: 'Vendor Name',
      sortable: true,
      filterable: true
    },
    {
      key: 'emails',
      label: 'Email',
      sortable: true,
      filterable: true,
      render: (value) => value && value.length > 0 ? value[0] : 'N/A'
    },
    {
      key: 'phones',
      label: 'Phone',
      sortable: false,
      filterable: true,
      render: (value) => value && value.length > 0 ? value[0] : 'N/A'
    },
    {
      key: 'username',
      label: 'Contact Person',
      sortable: true,
      filterable: true
    },
    {
      key: 'company_type',
      label: 'Business Type',
      sortable: true,
      filterable: true
    },
    {
      key: 'type_of_work',
      label: 'Type of Work',
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
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'onboardingDate',
      label: 'Join Date',
      sortable: true,
      filterable: false
    },
    {
      key: 'totalOrders',
      label: 'Total Orders',
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
            onClick={() => navigate(`/vendors/${row.id}`)}
            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
            title="View Vendor"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(`/vendors/${row.id}/edit`)}
            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
            title="Edit Vendor"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteVendor(row.id)}
            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
            title="Delete Vendor"
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

    // Handle country change
    if (name === 'country') {
      if (value === 'India') {
        // Load states for India from government API
        loadStates();
      } else {
        // For other countries, use fallback data
        setAvailableStates(Object.keys(countryStateCity[value] || {}));
      }
      setAvailableCities([]);
      setFormData(prev => ({
        ...prev,
        state: '',
        city: ''
      }));
    }

    // Handle state change
    if (name === 'state') {
      if (formData.country === 'India') {
        // Load cities from local JSON for Indian states
        loadCities(value);
      } else {
        // Use fallback data for other countries
        setAvailableCities(countryStateCity[formData.country]?.[value] || []);
      }
      setFormData(prev => ({
        ...prev,
        city: ''
      }));
    }
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...formData.emails];
    newEmails[index] = value;
    setFormData(prev => ({
      ...prev,
      emails: newEmails
    }));
  };

  const addEmail = () => {
    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, '']
    }));
  };

  const removeEmail = (index) => {
    if (formData.emails.length > 1) {
      setFormData(prev => ({
        ...prev,
        emails: prev.emails.filter((_, i) => i !== index)
      }));
    }
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.phones];
    newPhones[index] = value;
    setFormData(prev => ({
      ...prev,
      phones: newPhones
    }));
  };

  const addPhone = () => {
    setFormData(prev => ({
      ...prev,
      phones: [...prev.phones, '']
    }));
  };

  const removePhone = (index) => {
    if (formData.phones.length > 1) {
      setFormData(prev => ({
        ...prev,
        phones: prev.phones.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileChange = (fileType, files) => {
    console.log('📁 File change for', fileType, ':', files);

    if (fileType === 'companyLogos') {
      // Handle multiple files for company logos
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: files || []
      }));
    } else {
      // Handle single file for other types
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: files && files.length > 0 ? files[0] : null
      }));
    }
  };

  // Handle company logo file uploads (multiple files)
  const handleCompanyLogoUpload = (files) => {
    const allowedExtensions = [
      '.pdf', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp',
      '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf'
    ];
    const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

    const validFiles = [];
    const errors = [];

    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File size exceeds 5MB limit`);
        return;
      }

      // Check file extension
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        errors.push(`${file.name}: File type not allowed`);
        return;
      }

      // Handle duplicate file names by appending timestamp
      const timestamp = Date.now();
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
      const extension = file.name.substring(file.name.lastIndexOf('.'));

      // Check if file name already exists
      const existingFile = uploadedFiles.companyLogos.find(
        existingFile => existingFile.originalName === file.name
      );

      const finalFileName = existingFile
        ? `${nameWithoutExt}_${timestamp}${extension}`
        : file.name;

      validFiles.push({
        file: file,
        originalName: file.name,
        displayName: finalFileName,
        size: file.size,
        uploadDate: new Date().toISOString()
      });
    });

    if (errors.length > 0) {
      alert('Some files could not be uploaded:\n' + errors.join('\n'));
    }

    if (validFiles.length > 0) {
      setUploadedFiles(prev => ({
        ...prev,
        companyLogos: [...prev.companyLogos, ...validFiles]
      }));
    }
  };

  // Remove company logo file
  const removeCompanyLogo = (index) => {
    setUploadedFiles(prev => ({
      ...prev,
      companyLogos: prev.companyLogos.filter((_, i) => i !== index)
    }));
  };

  // Download company logo file
  const downloadCompanyLogo = (logoFile) => {
    const url = URL.createObjectURL(logoFile.file);
    const link = document.createElement('a');
    link.href = url;
    link.download = logoFile.displayName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.companyName || formData.companyName.trim() === '') {
      alert('❌ Company name is required');
      return;
    }

    if (!formData.emails[0] || formData.emails[0].trim() === '') {
      alert('❌ At least one email is required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = formData.emails.filter(email => email && !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      alert('❌ Please enter valid email addresses');
      return;
    }

    try {
      setLoading(true);
      console.log('🚀 Submitting vendor form...');
      console.log('📋 Form data:', formData);
      console.log('📁 Uploaded files:', uploadedFiles);

      // Create new vendor object
      const vendorData = {
        ...formData,
        files: uploadedFiles
      };

      console.log('💾 Sending vendor data to service:', vendorData);

      // Save to database
      const result = await createVendor(vendorData);
      console.log('✅ Vendor created successfully:', result);

      // Reload vendors list
      await loadVendors();

      // Reset form
      setFormData({
        companyName: '',
        companyType: '',
        onboardingDate: '',
        emails: [''],
        phones: [''],
        address: '',
        country: '',
        state: '',
        city: '',
        username: '',
        gstNumber: '',
        description: '',
        services: [],
        website: '',
        typeOfWork: '',
        status: 'Pending'
      });
      setUploadedFiles({
        gstFile: null,
        ndaFile: null,
        agreementFile: null,
        companyLogos: []
      });
      setAvailableStates([]);
      setAvailableCities([]);
      setShowAddForm(false);

      // Show success message
      alert('✅ Vendor added successfully! All files have been saved locally and data stored in database.');
    } catch (err) {
      console.error('❌ Error creating vendor:', err);
      alert(`❌ Failed to create vendor: ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        setLoading(true);
        await deleteVendor(vendorId);
        await loadVendors();
        alert('Vendor deleted successfully!');
      } catch (err) {
        console.error('Error deleting vendor:', err);
        alert('Failed to delete vendor. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
          <p className="mt-2 text-gray-600">Manage your vendor network</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Vendor
          </button>
        </div>
      </div>

      {/* Vendors Table */}
      <DataTable
        data={vendorsList}
        columns={columns}
        title="Vendors Management"
        defaultPageSize={50}
        enableExport={true}
        enableColumnToggle={true}
        enableFiltering={true}
        enableSorting={true}
      />

      {/* Add Vendor Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowAddForm(false)}></div>
            <div className="relative bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Vendor Onboarding</h3>
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
                        Vendor Onboarding Date *
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
                        Company Type *
                      </label>
                      <select
                        name="companyType"
                        value={formData.companyType}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select company type</option>
                        <option value="Pvt. Company">Pvt. Company</option>
                        <option value="MSME">MSME</option>
                        <option value="Firm">Firm</option>
                        <option value="Individual">Individual</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {formData.companyType === 'Individual' ? 'Individual Name' : 'Company Name'} *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder={formData.companyType === 'Individual' ? 'Enter individual name' : 'Enter company name'}
                      />
                    </div>

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
                        {typeOfWorkOptions.map(workType => (
                          <option key={workType.id} value={workType.name}>
                            {workType.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Company Logo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Logo
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                              </svg>
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> company logos
                              </p>
                              <p className="text-xs text-gray-500">PDF, Images, Word, Excel, PowerPoint (MAX. 5MB each)</p>
                            </div>
                            <input
                              type="file"
                              multiple
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                              onChange={(e) => handleCompanyLogoUpload(e.target.files)}
                            />
                          </label>
                        </div>

                        {/* Display uploaded files */}
                        {uploadedFiles.companyLogos.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-700">Uploaded Files:</h5>
                            {uploadedFiles.companyLogos.map((logoFile, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{logoFile.displayName}</p>
                                    <p className="text-xs text-gray-500">{(logoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => downloadCompanyLogo(logoFile)}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                  >
                                    Download
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeCompanyLogo(index)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Contact Information</h4>

                    {/* Multiple Email Addresses */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company's Email ID *
                      </label>
                      {formData.emails.map((email, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => handleEmailChange(index, e.target.value)}
                            required={index === 0}
                            className="input-field flex-1"
                            placeholder={`Email ${index + 1}`}
                          />
                          {formData.emails.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEmail(index)}
                              className="text-red-600 hover:text-red-800 px-2 py-1"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addEmail}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + Add Another Email
                      </button>
                    </div>

                    {/* Multiple Phone Numbers */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company's Phone No *
                      </label>
                      {formData.phones.map((phone, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => handlePhoneChange(index, e.target.value)}
                            required={index === 0}
                            className="input-field flex-1"
                            placeholder={`Phone ${index + 1}`}
                          />
                          {formData.phones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePhone(index)}
                              className="text-red-600 hover:text-red-800 px-2 py-1"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addPhone}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + Add Another Phone
                      </button>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Address Information</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select country</option>
                        {Object.keys(countryStateCity).map(country => (
                          <option key={country} value={country}>{country}</option>
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
                        onChange={handleInputChange}
                        required
                        disabled={!formData.country}
                        className="input-field disabled:bg-gray-100"
                      >
                        <option value="">
                          {loadingStates ? 'Loading states...' : 'Select state'}
                        </option>
                        {availableStates.map(state => (
                          <option key={state.id || state} value={state.name || state}>
                            {state.name || state}
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
                        disabled={!formData.state}
                        className="input-field disabled:bg-gray-100"
                      >
                        <option value="">
                          {loadingCities ? 'Loading cities...' : 'Select city'}
                        </option>
                        {availableCities.map(city => (
                          <option key={city.id || city} value={city.name || city}>
                            {city.name || city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="input-field"
                        placeholder="Brief description of vendor services/products"
                      />
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Documents & Files</h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* GST File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GST File Upload
                      </label>
                      <FileUpload
                        onFilesChange={(files) => handleFileChange('gstFile', files)}
                        existingFiles={uploadedFiles.gstFile ? [uploadedFiles.gstFile] : []}
                        maxFileSize={5}
                        multiple={false}
                        label="Upload GST Document"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Upload GST registration certificate
                      </p>
                    </div>

                    {/* NDA File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NDA File Upload *
                      </label>
                      <FileUpload
                        onFilesChange={(files) => handleFileChange('ndaFile', files)}
                        existingFiles={uploadedFiles.ndaFile ? [uploadedFiles.ndaFile] : []}
                        maxFileSize={5}
                        multiple={false}
                        label="Upload NDA Document"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Upload signed NDA document (Required)
                      </p>
                    </div>

                    {/* Agreement File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Agreement File Upload
                      </label>
                      <FileUpload
                        onFilesChange={(files) => handleFileChange('agreementFile', files)}
                        existingFiles={uploadedFiles.agreementFile ? [uploadedFiles.agreementFile] : []}
                        maxFileSize={5}
                        multiple={false}
                        label="Upload Agreement Document"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Upload vendor agreement document
                      </p>
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
                    Save Vendor
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

export default Vendors;
