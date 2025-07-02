import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const TypeOfWorkEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [typeOfWork, setTypeOfWork] = useState({
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    loadTypeOfWork();
  }, [id]);

  const loadTypeOfWork = async () => {
    try {
      setLoading(true);
      const { getTypeOfWorkById } = await import('../services/typeOfWorkService');
      const data = await getTypeOfWorkById(id);
      
      if (data) {
        setTypeOfWork({
          name: data.name || '',
          description: data.description || '',
          isActive: data.isActive !== undefined ? data.isActive : true
        });
      }
    } catch (error) {
      console.error('Error loading type of work:', error);
      alert('Error loading type of work details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!typeOfWork.name || typeOfWork.name.trim() === '') {
      alert('❌ Work Type Name is required');
      return;
    }

    if (!typeOfWork.description || typeOfWork.description.trim() === '') {
      alert('❌ Description is required');
      return;
    }

    if (typeOfWork.name.trim().length < 3) {
      alert('❌ Work Type Name must be at least 3 characters long');
      return;
    }

    if (typeOfWork.description.trim().length < 10) {
      alert('❌ Description must be at least 10 characters long');
      return;
    }

    try {
      setSaving(true);
      console.log('✏️ Updating type of work:', typeOfWork);

      const { updateTypeOfWork } = await import('../services/typeOfWorkService');

      const result = await updateTypeOfWork(id, {
        name: typeOfWork.name.trim(),
        description: typeOfWork.description.trim(),
        isActive: typeOfWork.isActive
      });

      console.log('✅ Type of work updated successfully:', result);
      alert('✅ Type of work updated successfully!');
      navigate('/type-of-work');
    } catch (error) {
      console.error('❌ Error updating type of work:', error);
      alert(`❌ Error updating type of work: ${error.message || 'Please try again.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setTypeOfWork(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/type-of-work')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Type of Work
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Type of Work</h1>
          <p className="mt-2 text-gray-600">Update the work type information</p>
        </div>

        {/* Form */}
        <div className="bg-white shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Work Type Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Type Name *
              </label>
              <input
                type="text"
                value={typeOfWork.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter work type name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={typeOfWork.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
                required
              />
            </div>

            {/* Status Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={typeOfWork.isActive === true}
                    onChange={() => handleInputChange('isActive', true)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={typeOfWork.isActive === false}
                    onChange={() => handleInputChange('isActive', false)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Inactive</span>
                </label>
              </div>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  typeOfWork.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {typeOfWork.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/type-of-work')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TypeOfWorkEdit;
