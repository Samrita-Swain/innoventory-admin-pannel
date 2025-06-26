import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, PrinterIcon } from '@heroicons/react/24/outline';

const TypeOfWorkView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [typeOfWork, setTypeOfWork] = useState(null);

  useEffect(() => {
    loadTypeOfWork();
  }, [id]);

  const loadTypeOfWork = async () => {
    try {
      setLoading(true);
      const { getTypeOfWorkById } = await import('../services/typeOfWorkService');
      const data = await getTypeOfWorkById(id);
      setTypeOfWork(data);
    } catch (error) {
      console.error('Error loading type of work:', error);
      alert('Error loading type of work details');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    navigate(`/type-of-work/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!typeOfWork) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Type of Work Not Found</h2>
            <p className="mt-2 text-gray-600">The requested type of work could not be found.</p>
            <button
              onClick={() => navigate('/type-of-work')}
              className="mt-4 btn-primary"
            >
              Back to Type of Work
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Hidden in print */}
        <div className="mb-8 print:hidden">
          <button
            onClick={() => navigate('/type-of-work')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Type of Work
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Type of Work Details</h1>
              <p className="mt-2 text-gray-600">View work type information</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="btn-secondary flex items-center"
              >
                <PrinterIcon className="h-5 w-5 mr-2" />
                Print
              </button>
              <button
                onClick={handleEdit}
                className="btn-primary flex items-center"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white shadow-lg rounded-lg print:shadow-none print:rounded-none">
          <div className="p-6">
            {/* Print Header - Only visible in print */}
            <div className="hidden print:block mb-8 text-center border-b border-gray-200 pb-4">
              <h1 className="text-2xl font-bold text-gray-900">Type of Work Details</h1>
              <p className="text-gray-600">Innoventory Admin Panel</p>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Work Type Name</label>
                    <p className="mt-1 text-sm text-gray-900">{typeOfWork.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      typeOfWork.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {typeOfWork.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {typeOfWork.createdAt ? new Date(typeOfWork.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {typeOfWork.updatedAt ? new Date(typeOfWork.updatedAt).toLocaleDateString('en-IN') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {typeOfWork.description || 'No description provided'}
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Created By</label>
                  <p className="mt-1 text-sm text-gray-900">{typeOfWork.createdById || 'Admin'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Record ID</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{typeOfWork.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Hidden in print */}
        <div className="mt-8 flex justify-center space-x-4 print:hidden">
          <button
            onClick={() => navigate('/type-of-work')}
            className="btn-secondary"
          >
            Back to List
          </button>
          <button
            onClick={handleEdit}
            className="btn-primary"
          >
            Edit Type of Work
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypeOfWorkView;
