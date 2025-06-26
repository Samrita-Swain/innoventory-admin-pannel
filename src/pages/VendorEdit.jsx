import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import FileUpload from '../components/FileUpload/FileUpload';
import { getVendorById, updateVendor } from '../services/vendorService';

const VendorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

  // Country, State, City data - same structure as main Vendors component
  const countryStateCity = {
    'India': {
      'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
      'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
      'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi'],
      'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar']
    },
    'United States': {
      'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
      'New York': ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany'],
      'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
      'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Tallahassee'],
      'Illinois': ['Chicago', 'Springfield', 'Rockford', 'Peoria', 'Aurora']
    }
  };

  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const vendor = await getVendorById(id);

      if (vendor) {
        const newFormData = {
          companyName: vendor.companyName || vendor.company_name || '',
          companyType: vendor.companyType || vendor.company_type || '',
          onboardingDate: vendor.onboardingDate || '',
          emails: vendor.emails && Array.isArray(vendor.emails) ? vendor.emails : [vendor.email || ''],
          phones: vendor.phones && Array.isArray(vendor.phones) ? vendor.phones : [vendor.phone || ''],
          address: vendor.address || '',
          country: vendor.country || '',
          state: vendor.state || '',
          city: vendor.city || '',
          username: vendor.username || '',
          gstNumber: vendor.gstNumber || '',
          description: vendor.description || '',
          services: vendor.services && Array.isArray(vendor.services) ? vendor.services : [],
          website: vendor.website || '',
          typeOfWork: vendor.typeOfWork || vendor.type_of_work || vendor.specialization || '',
          status: vendor.status || (vendor.isActive ? 'Active' : 'Pending')
        };

        setFormData(newFormData);

        // Set available states and cities based on saved data
        if (vendor.country) {
          setAvailableStates(Object.keys(countryStateCity[vendor.country] || {}));
          if (vendor.state && countryStateCity[vendor.country]?.[vendor.state]) {
            setAvailableCities(countryStateCity[vendor.country][vendor.state]);
          }
        }

        if (vendor.files && typeof vendor.files === 'object') {
          setUploadedFiles({
            gstFile: vendor.files.gstFile || null,
            ndaFile: vendor.files.ndaFile || null,
            agreementFile: vendor.files.agreementFile || null,
            companyLogos: vendor.files.companyLogos && Array.isArray(vendor.files.companyLogos) ? vendor.files.companyLogos : []
          });
        }
      }
    } catch (error) {
      console.error('Error fetching vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle null values properly
    const cleanValue = value && value !== 'null' ? value : '';
    setFormData(prev => ({
      ...prev,
      [name]: cleanValue
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
    // Handle null values properly
    const cleanValue = value && value !== 'null' ? value : '';
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.map((email, i) => i === index ? cleanValue : email)
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
    // Handle null values properly
    const cleanValue = value && value !== 'null' ? value : '';
    setFormData(prev => ({
      ...prev,
      phones: prev.phones.map((phone, i) => i === index ? cleanValue : phone)
    }));
  };

  const handleFileUpload = (fileType, file) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, value]
        : prev.services.filter(service => service !== value)
    }));
  };

  const handleFilesChange = (files) => {
    setUploadedFiles(files);
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

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSaveError(null);

      console.log('Submitting form data:', formData);

      // Prepare update data
      const updateData = {
        ...formData,
        files: uploadedFiles,
        // Ensure emails and phones are arrays and filter out empty values
        emails: formData.emails.filter(email => email.trim() !== ''),
        phones: formData.phones.filter(phone => phone.trim() !== ''),
        // Set primary email and phone from arrays
        email: formData.emails.find(email => email.trim() !== '') || '',
        phone: formData.phones.find(phone => phone.trim() !== '') || ''
      };

      console.log('Sending update data:', updateData);

      const result = await updateVendor(id, updateData);
      console.log('Update result:', result);

      // Show success message
      alert('Vendor updated successfully!');

      // Navigate back to view page
      navigate(`/vendors/${id}`);
    } catch (error) {
      console.error('Error updating vendor:', error);
      setSaveError('Failed to update vendor. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Load active work types for dropdown
  const [activeWorkTypes, setActiveWorkTypes] = useState([]);

  useEffect(() => {
    const loadActiveWorkTypes = async () => {
      try {
        console.log('🔄 Loading active work types for dropdown...');
        const { getActiveTypeOfWork } = await import('../services/typeOfWorkService');
        const workTypes = await getActiveTypeOfWork();
        setActiveWorkTypes(workTypes);
        console.log('✅ Active work types loaded:', workTypes.length);
      } catch (error) {
        console.error('❌ Error loading active work types:', error);
        // Fallback to demo data
        setActiveWorkTypes([
          { id: 1, name: 'Software Development' },
          { id: 2, name: 'Digital Marketing' },
          { id: 3, name: 'Graphic Design' },
          { id: 4, name: 'Data Analysis' }
        ]);
      }
    };

    loadActiveWorkTypes();
  }, []);

  const availableServices = [
    'Office Supplies',
    'Furniture',
    'Technology Equipment',
    'Maintenance Services',
    'Cleaning Services',
    'Security Services',
    'Catering Services',
    'Transportation',
    'Consulting',
    'Other'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/vendors/${id}`)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Vendor
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Vendor</h1>
            <p className="text-gray-600">Update vendor information and details</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-red-800">{saveError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Enter company name"
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
                  <option value="">Select Company Type</option>
                  <option value="Pvt. Company">Pvt. Company</option>
                  <option value="MSME">MSME</option>
                  <option value="Firm">Firm</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Onboarding Date
                </label>
                <input
                  type="date"
                  name="onboardingDate"
                  value={formData.onboardingDate}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              {/* Email Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Addresses *
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
                  Phone Numbers *
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
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="3"
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
                  onChange={handleCountryChange}
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
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleStateChange}
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
                  {availableCities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
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
            </div>
          </div>

          {/* Additional Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="4"
                  placeholder="Enter vendor description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field"
                  placeholder="Complete company address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Work
                </label>
                <select
                  name="typeOfWork"
                  value={formData.typeOfWork}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select Type of Work</option>
                  {activeWorkTypes.map(workType => (
                    <option key={workType.id} value={workType.name}>
                      {workType.name}
                    </option>
                  ))}
                </select>
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Services Offered */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Services Offered</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableServices.map((service) => (
              <label key={service} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={service}
                  checked={formData.services.includes(service)}
                  onChange={handleServiceChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{service}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Description</h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="input-field"
            placeholder="Brief description of the vendor and services provided"
          />
        </div>

        {/* File Upload Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents & Files</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* GST File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST File Upload
              </label>
              <FileUpload
                onFilesChange={(files) => handleFileUpload('gstFile', files[0])}
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
                onFilesChange={(files) => handleFileUpload('ndaFile', files[0])}
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
                onFilesChange={(files) => handleFileUpload('agreementFile', files[0])}
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
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(`/vendors/${id}`)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              'Update Vendor'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorEdit;
