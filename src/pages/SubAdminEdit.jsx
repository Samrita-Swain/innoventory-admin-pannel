import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, DocumentIcon } from '@heroicons/react/24/outline';

const SubAdminEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    status: 'Active'
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    tdsFile: [],
    ndaFile: [],
    employmentAgreement: [],
    panCard: []
  });

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
      status: 'Active',
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
      status: 'Active',
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
      status: 'Inactive',
      uploadedFiles: {
        tdsFile: [],
        ndaFile: [{ name: 'emily_nda.pdf', url: '/uploads/emily_nda.pdf' }],
        employmentAgreement: [{ name: 'emily_employment.pdf', url: '/uploads/emily_employment.pdf' }],
        panCard: [{ name: 'emily_pan.pdf', url: '/uploads/emily_pan.pdf' }]
      }
    }
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

  useEffect(() => {
    // Find sub-admin by ID and populate form
    const foundSubAdmin = sampleSubAdmins.find(admin => admin.id === parseInt(id));
    if (foundSubAdmin) {
      setFormData({
        subAdminOnboardingDate: foundSubAdmin.subAdminOnboardingDate || '',
        name: foundSubAdmin.name || '',
        email: foundSubAdmin.email || '',
        address: foundSubAdmin.address || '',
        country: foundSubAdmin.country || '',
        state: foundSubAdmin.state || '',
        city: foundSubAdmin.city || '',
        username: foundSubAdmin.username || '',
        panNumber: foundSubAdmin.panNumber || '',
        termOfWork: foundSubAdmin.termOfWork || '',
        status: foundSubAdmin.status || 'Active'
      });
      setUploadedFiles(foundSubAdmin.uploadedFiles || {
        tdsFile: [],
        ndaFile: [],
        employmentAgreement: [],
        panCard: []
      });
    }
  }, [id]);

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
    console.log('Updated Form Data:', formData);
    console.log('Updated Files:', uploadedFiles);
    // Here you would typically send the data to your backend
    navigate(`/sub-admins/${id}`);
  };

  if (!formData.name) {
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
            onClick={() => navigate(`/sub-admins/${id}`)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Sub-admin</h1>
            <p className="text-gray-600">{formData.name}</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                          <div className="flex items-center">
                            <DocumentIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                          </div>
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
                    />
                  </label>
                </div>
                {uploadedFiles.ndaFile && uploadedFiles.ndaFile.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                    <div className="space-y-1">
                      {uploadedFiles.ndaFile.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center">
                            <DocumentIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                          </div>
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
                    />
                  </label>
                </div>
                {uploadedFiles.employmentAgreement && uploadedFiles.employmentAgreement.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                    <div className="space-y-1">
                      {uploadedFiles.employmentAgreement.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center">
                            <DocumentIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                          </div>
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
                          <div className="flex items-center">
                            <DocumentIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                          </div>
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
              onClick={() => navigate(`/sub-admins/${id}`)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Update Sub-admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubAdminEdit;
