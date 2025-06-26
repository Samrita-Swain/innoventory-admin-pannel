import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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

const ClientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
    description: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    dpiitCertificate: null,
    tdsFile: null,
    gstFile: null,
    ndaFile: null,
    agreementFile: null,
    quotationFile: null,
    panCardFile: null,
    udhyamRegistrationFile: null
  });
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    const loadClient = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading client data for editing, ID:', id);

        // Import and use database service
        const { getClientById } = await import('../services/clientService');
        const clientData = await getClientById(id);

        if (clientData) {
          console.log('✅ Client data loaded for editing:', clientData);

          // Populate form with client data
          setFormData({
            onboardingDate: clientData.onboarding_date || '',
            companyType: clientData.company_type || '',
            companyName: clientData.company_name || '',
            emails: Array.isArray(clientData.emails) ? clientData.emails : [''],
            phones: Array.isArray(clientData.phones) ? clientData.phones : [''],
            address: clientData.address || '',
            country: clientData.country || '',
            state: clientData.state || '',
            city: clientData.city || '',
            username: clientData.username || '',
            gstNumber: clientData.gst_number || '',
            dpiitRegistered: clientData.dpiit_registered ? 'yes' : 'no',
            validTill: clientData.valid_till || '',
            website: clientData.website || '',
            description: clientData.description || ''
          });

          // Set uploaded files if they exist
          if (clientData.files) {
            setUploadedFiles(clientData.files);
          }
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

  // Update cascading dropdowns when form data changes
  useEffect(() => {
    if (formData.country) {
      setAvailableStates(Object.keys(countryStateCity[formData.country] || {}));

      if (formData.state) {
        setAvailableCities(countryStateCity[formData.country]?.[formData.state] || []);
      } else {
        setAvailableCities([]);
      }
    } else {
      setAvailableStates([]);
      setAvailableCities([]);
    }
  }, [formData.country, formData.state]);

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

  const handleFileUpload = (fileType, file) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const handleFilesChange = (files) => {
    setUploadedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log('💾 Updating client data:', formData);
      console.log('📁 Uploaded Files:', uploadedFiles);

      // Prepare client data for database
      const clientData = {
        companyName: formData.companyName,
        companyType: formData.companyType,
        onboardingDate: formData.onboardingDate,
        emails: formData.emails.filter(email => email.trim() !== ''),
        phones: formData.phones.filter(phone => phone.trim() !== ''),
        address: formData.address,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        dpiitRegistered: formData.dpiitRegistered === 'yes',
        dpiitNumber: formData.dpiitRegistered === 'yes' ? formData.validTill : null,
        files: uploadedFiles,
        status: 'Active'
      };

      // Import and use database service
      const { updateClient } = await import('../services/clientService');
      const updatedClient = await updateClient(id, clientData);

      console.log('✅ Client updated successfully:', updatedClient);
      alert('Client updated successfully!');
      navigate(`/clients/${id}`);
    } catch (error) {
      console.error('❌ Error updating client:', error);
      alert('Failed to update client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-1 py-2">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/clients/${id}`)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Client
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Client</h1>
            <p className="text-gray-600">Update client information and details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Onboarding Date *
                </label>
                <input
                  type="date"
                  name="onboardingDate"
                  value={formData.onboardingDate || ''}
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
                  value={formData.companyType || ''}
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
                  value={formData.companyName || ''}
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
                {formData.emails && formData.emails.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="email"
                      value={email || ''}
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
                {formData.phones && formData.phones.map((phone, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="tel"
                      value={phone || ''}
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
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="input-field"
                  placeholder="Complete company address"
                />
              </div>
            </div>
          </div>

          {/* Location and Additional Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Location & Additional Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country || ''}
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
                  value={formData.state || ''}
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
                  value={formData.city || ''}
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
                  value={formData.username || ''}
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
                  value={formData.gstNumber || ''}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Till *
                  </label>
                  <input
                    type="date"
                    name="validTill"
                    value={formData.validTill || ''}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://company.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* DPIIT Certificate Upload - Only show if DPIIT Registered is Yes */}
        {formData.dpiitRegistered === 'yes' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">DPIIT Certificate</h2>
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
                    {uploadedFiles.dpiitCertificate && (
                      <p className="text-xs text-blue-600 mt-1">Current: {uploadedFiles.dpiitCertificate}</p>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                    onChange={(e) => handleFileUpload('dpiitCertificate', e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* File Upload Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">File Upload Section</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">

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
                    {uploadedFiles.tdsFile && (
                      <p className="text-xs text-blue-600 mt-1">Current: {uploadedFiles.tdsFile}</p>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                    onChange={(e) => handleFileUpload('tdsFile', e.target.files[0])}
                  />
                </label>
              </div>
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
                    {uploadedFiles.gstFile && (
                      <p className="text-xs text-blue-600 mt-1">Current: {uploadedFiles.gstFile}</p>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                    onChange={(e) => handleFileUpload('gstFile', e.target.files[0])}
                  />
                </label>
              </div>
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
                    {uploadedFiles.ndaFile && (
                      <p className="text-xs text-blue-600 mt-1">Current: {uploadedFiles.ndaFile}</p>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                    onChange={(e) => handleFileUpload('ndaFile', e.target.files[0])}
                  />
                </label>
              </div>
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
                    {uploadedFiles.agreementFile && (
                      <p className="text-xs text-blue-600 mt-1">Current: {uploadedFiles.agreementFile}</p>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                    onChange={(e) => handleFileUpload('agreementFile', e.target.files[0])}
                  />
                </label>
              </div>
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
                    {uploadedFiles.quotationFile && (
                      <p className="text-xs text-blue-600 mt-1">Current: {uploadedFiles.quotationFile}</p>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                    onChange={(e) => handleFileUpload('quotationFile', e.target.files[0])}
                  />
                </label>
              </div>
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
                    {uploadedFiles.panCardFile && (
                      <p className="text-xs text-blue-600 mt-1">Current: {uploadedFiles.panCardFile}</p>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                    onChange={(e) => handleFileUpload('panCardFile', e.target.files[0])}
                  />
                </label>
              </div>
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
                    {uploadedFiles.udhyamRegistrationFile && (
                      <p className="text-xs text-blue-600 mt-1">Current: {uploadedFiles.udhyamRegistrationFile}</p>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                    onChange={(e) => handleFileUpload('udhyamRegistrationFile', e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Description</h2>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={4}
            className="input-field"
            placeholder="Brief description of the client and business relationship"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(`/clients/${id}`)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Update Client
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default ClientEdit;
