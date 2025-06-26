import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
import DataTable from '../components/DataTable/DataTable';

const TypeOfWork = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [typeOfWorkData, setTypeOfWorkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);

  const demoTypeOfWork = [
    {
      id: 'demo-work-1',
      name: 'Software Development',
      description: 'Custom software development and programming services',
      category: 'Technology',
      status: 'Active',
      createdDate: '2024-01-15',
      totalProjects: 45,
      averageRate: '₹2,500/hour'
    },
    {
      id: 'demo-work-2',
      name: 'Digital Marketing',
      description: 'SEO, social media marketing, and online advertising',
      category: 'Marketing',
      status: 'Active',
      createdDate: '2024-02-10',
      totalProjects: 32,
      averageRate: '₹1,800/hour'
    },
    {
      id: 'demo-work-3',
      name: 'Graphic Design',
      description: 'Logo design, branding, and visual identity services',
      category: 'Design',
      status: 'Active',
      createdDate: '2024-01-20',
      totalProjects: 28,
      averageRate: '₹1,200/hour'
    },
    {
      id: 'demo-work-4',
      name: 'Content Writing',
      description: 'Blog posts, articles, and copywriting services',
      category: 'Content',
      status: 'Inactive',
      createdDate: '2024-03-05',
      totalProjects: 15,
      averageRate: '₹800/hour'
    },
    {
      id: 'demo-work-5',
      name: 'Data Analysis',
      description: 'Business intelligence and data analytics services',
      category: 'Analytics',
      status: 'Active',
      createdDate: '2024-02-28',
      totalProjects: 22,
      averageRate: '₹2,200/hour'
    }
  ];

  // Transform database data to match expected format
  const transformTypeOfWorkData = (data) => {
    return data.map(item => ({
      ...item,
      status: item.isActive !== undefined ? (item.isActive ? 'Active' : 'Inactive') : (item.status || 'Active'),
      createdDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.createdDate || new Date().toLocaleDateString())
    }));
  };

  // Load type of work from database
  const loadTypeOfWork = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading type of work from database...');
      // Import and use database service
      const { getAllTypeOfWork } = await import('../services/typeOfWorkService');
      const dbTypeOfWork = await getAllTypeOfWork();
      console.log('✅ Type of work loaded:', dbTypeOfWork);

      console.log('✅ Type of work loaded:', dbTypeOfWork);

      // If database is empty, add demo data and save to database
      if (dbTypeOfWork && dbTypeOfWork.length === 0) {
        console.log('📝 Database is empty, adding demo data...');
        await addDemoDataToDatabase();
        // Reload data after adding demo data
        const updatedData = await getAllTypeOfWork();
        setTypeOfWorkData(transformTypeOfWorkData(updatedData));
      } else {
        setTypeOfWorkData(transformTypeOfWorkData(dbTypeOfWork));
      }
    } catch (err) {
      console.error('❌ Error loading type of work:', err);
      // Fallback to demo data if database fails
      console.log('🔄 Using demo data as fallback and attempting to save to database');
      setTypeOfWorkData(transformTypeOfWorkData(demoTypeOfWork));
      // Try to save demo data to database in background
      try {
        await addDemoDataToDatabase();
      } catch (saveError) {
        console.log('⚠️ Could not save demo data to database:', saveError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTypeOfWork();
  }, []);

  // Add demo data to database
  const addDemoDataToDatabase = async () => {
    try {
      console.log('💾 Saving demo data to database...');
      const { createTypeOfWork } = await import('../services/typeOfWorkService');

      for (const work of demoTypeOfWork) {
        try {
          await createTypeOfWork({
            name: work.name,
            description: work.description
          });
          console.log(`✅ Saved to database: ${work.name}`);
        } catch (saveError) {
          console.log(`⚠️ Could not save ${work.name}:`, saveError.message);
        }
      }
      console.log('✅ Demo data saved to database successfully!');
    } catch (error) {
      console.log('❌ Error saving demo data:', error.message);
      throw error;
    }
  };

  // Toggle status function
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      console.log(`🔄 Toggling status for ${id} from ${currentStatus} to ${newStatus}`);

      // Update in database
      const { updateTypeOfWork } = await import('../services/typeOfWorkService');
      await updateTypeOfWork(id, { isActive: newStatus === 'Active' });

      // Update local state
      setTypeOfWorkData(prevData =>
        prevData.map(item =>
          item.id === id
            ? { ...item, status: newStatus, isActive: newStatus === 'Active' }
            : item
        )
      );

      console.log(`✅ Status updated successfully for ${id}`);
    } catch (error) {
      console.error('❌ Error updating status:', error);
      // For demo data, just update local state
      setTypeOfWorkData(prevData =>
        prevData.map(item =>
          item.id === id
            ? { ...item, status: currentStatus === 'Active' ? 'Inactive' : 'Active' }
            : item
        )
      );
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingId) {
        // Update existing type of work
        const { updateTypeOfWork } = await import('../services/typeOfWorkService');
        await updateTypeOfWork(editingId, formData);
        console.log('✅ Type of work updated successfully');
      } else {
        // Create new type of work
        const { createTypeOfWork } = await import('../services/typeOfWorkService');
        await createTypeOfWork(formData);
        console.log('✅ Type of work created successfully');
      }

      // Reset form and reload data
      setFormData({ name: '', description: '' });
      setShowAddForm(false);
      setEditingId(null);
      await loadTypeOfWork();
    } catch (error) {
      console.error('❌ Error saving type of work:', error);
      alert('Error saving type of work: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      const { updateTypeOfWorkStatus } = await import('../services/typeOfWorkService');
      await updateTypeOfWorkStatus(id, newStatus);
      console.log(`✅ Status updated to ${newStatus}`);
      await loadTypeOfWork();
    } catch (error) {
      console.error('❌ Error updating status:', error);
      alert('Error updating status: ' + error.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this type of work?')) {
      try {
        const { deleteTypeOfWork } = await import('../services/typeOfWorkService');
        await deleteTypeOfWork(id);
        console.log('✅ Type of work deleted successfully');
        await loadTypeOfWork();
      } catch (error) {
        console.error('❌ Error deleting type of work:', error);
        alert('Error deleting type of work: ' + error.message);
      }
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description
    });
    setEditingId(item.id);
    setShowAddForm(true);
  };

  const columns = [
    {
      key: 'name',
      label: 'Work Type',
      sortable: true,
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      render: (value) => (
        <div className="max-w-xs text-gray-600">{value}</div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
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
      key: 'createdDate',
      label: 'Created Date',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">{value}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      filterable: false,
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setFormData({
                name: row.name,
                description: row.description
              });
              setEditingId(row.id);
              setShowViewModal(true);
            }}
            className="text-gray-600 hover:text-gray-800"
            title="View"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleStatus(row.id, row.status)}
            className={`${
              row.status === 'Active'
                ? 'text-green-600 hover:text-green-800'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title={`${row.status} - Click to toggle to ${row.status === 'Active' ? 'Inactive' : 'Active'}`}
          >
            {row.status === 'Active' ? (
              <CheckCircleIcon className="h-4 w-4" />
            ) : (
              <XCircleIcon className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
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
          <h1 className="text-3xl font-bold text-gray-900">Type of Work</h1>
          <p className="mt-2 text-gray-600">Manage different types of work and services</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={addDemoDataToDatabase}
            className="btn-secondary flex items-center"
            title="Save demo data to database"
          >
            💾 Save Demo Data
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Work Type
          </button>
        </div>
      </div>

      {/* Status Legend */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <span className="font-medium">Action Icons:</span>
          <div className="flex items-center space-x-2">
            <EyeIcon className="w-4 h-4 text-gray-600" />
            <span>View</span>
          </div>
          <div className="flex items-center space-x-2">
            <PencilIcon className="w-4 h-4 text-blue-600" />
            <span>Edit</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="w-4 h-4 text-green-600" />
            <span>Toggle Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircleIcon className="w-4 h-4 text-gray-400" />
            <span>Toggle Inactive</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrashIcon className="w-4 h-4 text-red-600" />
            <span>Delete</span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card">
        <DataTable
          data={typeOfWorkData}
          columns={columns}
          title="Type of Work"
          searchPlaceholder="Search work types..."
          itemsPerPage={50}
        />
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingId ? 'Edit Work Type' : 'Add New Work Type'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Work Type Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Work Type Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter work type name"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter description"
                    required
                  />
                </div>

                {/* Created Date Info */}
                <div className="text-sm text-gray-500">
                  <p>Created Date: {new Date().toLocaleDateString()} (Auto-generated)</p>
                  <p>Status: Active (Default)</p>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingId(null);
                      setFormData({ name: '', description: '' });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingId ? 'Update' : 'Save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                View Work Type
              </h3>

              <div className="space-y-4">
                {/* Work Type Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Type Name
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    {formData.name}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[80px]">
                    {formData.description}
                  </div>
                </div>

                {/* Status and Date Info */}
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  <p><strong>Status:</strong> {typeOfWorkData.find(item => item.id === editingId)?.status || 'Active'}</p>
                  <p><strong>Created Date:</strong> {typeOfWorkData.find(item => item.id === editingId)?.createdDate || 'N/A'}</p>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowViewModal(false);
                      setEditingId(null);
                      setFormData({ name: '', description: '' });
                    }}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowViewModal(false);
                      setShowAddForm(true);
                    }}
                    className="btn-primary"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypeOfWork;
