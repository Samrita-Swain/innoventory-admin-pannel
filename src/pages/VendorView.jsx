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
import { getVendorById } from '../services/prismaVendorService';

const VendorView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching vendor with ID:', id);
      
      const vendorData = await getVendorById(id);
      console.log('📦 Raw vendor data:', vendorData);

      if (vendorData) {
        // Transform Prisma service data to display format
        const transformedVendor = {
          id: vendorData.id,
          name: vendorData.companyName || 'Unknown Vendor',
          email: Array.isArray(vendorData.emails) && vendorData.emails.length > 0 
            ? vendorData.emails[0] 
            : vendorData.email || 'N/A',
          phone: Array.isArray(vendorData.phones) && vendorData.phones.length > 0 
            ? vendorData.phones[0] 
            : vendorData.phone || 'N/A',
          contactPerson: vendorData.username || 'N/A',
          businessType: vendorData.companyType || 'N/A',
          joinDate: vendorData.onboardingDate || 'N/A',
          taxId: vendorData.gstNumber || 'N/A',
          rating: parseFloat(vendorData.rating) || 4.5,
          website: vendorData.website || 'N/A',
          totalOrders: vendorData.totalOrders || 0,
          typeOfWork: vendorData.typeOfWork || 'N/A',
          status: vendorData.status || 'Active',
          address: vendorData.address || 'N/A',
          city: vendorData.city || '',
          state: vendorData.state || '',
          country: vendorData.country || '',
          allEmails: Array.isArray(vendorData.emails) ? vendorData.emails : [vendorData.email].filter(Boolean),
          allPhones: Array.isArray(vendorData.phones) ? vendorData.phones : [vendorData.phone].filter(Boolean),
          files: vendorData.files || {}
        };

        console.log('✅ Transformed vendor data:', transformedVendor);
        setVendor(transformedVendor);
      } else {
        setVendor(null);
      }
    } catch (error) {
      console.error('❌ Error fetching vendor:', error);
      setVendor(null);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vendor Not Found</h1>
          <p className="text-gray-600 mb-8">The vendor you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/vendors')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <button
              onClick={() => navigate('/vendors')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Vendors
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{vendor.name}</h1>
              <p className="text-gray-600 text-lg">Vendor details and performance overview</p>
            </div>
          </div>
          <div className="flex space-x-3 ml-6">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
            <button
              onClick={() => navigate(`/vendors/${vendor.id}/edit`)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Vendor
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vendor Overview */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Vendor Overview</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {renderStars(vendor.rating)}
                  <span className="text-sm text-gray-600 ml-2">{vendor.rating}</span>
                </div>
                <span className={`status-badge ${
                  vendor.status === 'Active' ? 'status-active' : 
                  vendor.status === 'Pending' ? 'status-pending' : 'status-inactive'
                }`}>
                  {vendor.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="vendor-info-item">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400 icon" />
                  <div className="content">
                    <p className="vendor-info-label">Business Type</p>
                    <p className="vendor-info-value">{vendor.businessType}</p>
                  </div>
                </div>
                
                <div className="vendor-info-item">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 icon" />
                  <div className="content">
                    <p className="vendor-info-label">Email</p>
                    <p className="vendor-info-value">{vendor.email}</p>
                  </div>
                </div>
                
                <div className="vendor-info-item">
                  <PhoneIcon className="h-5 w-5 text-gray-400 icon" />
                  <div className="content">
                    <p className="vendor-info-label">Phone</p>
                    <p className="vendor-info-value">{vendor.phone}</p>
                  </div>
                </div>
                
                <div className="vendor-info-item">
                  <UserIcon className="h-5 w-5 text-gray-400 icon" />
                  <div className="content">
                    <p className="vendor-info-label">Contact Person</p>
                    <p className="vendor-info-value">{vendor.contactPerson}</p>
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-4">
                <div className="vendor-info-item">
                  <GlobeAltIcon className="h-5 w-5 text-gray-400 icon" />
                  <div className="content">
                    <p className="vendor-info-label">Website</p>
                    {vendor.website && vendor.website !== 'N/A' ? (
                      <a href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`} 
                         target="_blank" rel="noopener noreferrer" 
                         className="vendor-info-value text-blue-600 hover:text-blue-800">
                        {vendor.website}
                      </a>
                    ) : (
                      <p className="vendor-info-value">N/A</p>
                    )}
                  </div>
                </div>
                
                <div className="vendor-info-item">
                  <div className="content">
                    <p className="vendor-info-label">Tax ID</p>
                    <p className="vendor-info-value font-mono">{vendor.taxId}</p>
                  </div>
                </div>
                
                <div className="vendor-info-item">
                  <div className="content">
                    <p className="vendor-info-label">Vendor Since</p>
                    <p className="vendor-info-value">{vendor.joinDate}</p>
                  </div>
                </div>
                
                <div className="vendor-info-item">
                  <div className="content">
                    <p className="vendor-info-label">Total Orders</p>
                    <p className="vendor-info-value font-semibold">{vendor.totalOrders}</p>
                  </div>
                </div>

                <div className="vendor-info-item">
                  <div className="content">
                    <p className="vendor-info-label">Type of Work</p>
                    <p className="vendor-info-value">{vendor.typeOfWork}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Address</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-base text-gray-900 leading-relaxed">{vendor.address}</p>
                {(vendor.city || vendor.state || vendor.country) && (
                  <p className="text-base text-gray-700 mt-2 font-medium">
                    {[vendor.city, vendor.state, vendor.country].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Documents & Files */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents & Files</h3>
            <div className="space-y-4">
              {vendor.files?.gstFileUrl && (
                <div className="document-file-item">
                  <div className="flex items-center space-x-3">
                    <DocumentArrowDownIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">GST Document</p>
                      <p className="text-xs text-gray-500">PDF File</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors">
                    <DocumentArrowDownIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {vendor.files?.ndaFileUrl && (
                <div className="document-file-item">
                  <div className="flex items-center space-x-3">
                    <DocumentArrowDownIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">NDA Document</p>
                      <p className="text-xs text-gray-500">PDF File</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors">
                    <DocumentArrowDownIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {(!vendor.files?.gstFileUrl && !vendor.files?.ndaFileUrl) && (
                <div className="document-upload-area">
                  <DocumentArrowDownIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">No documents uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorView;
