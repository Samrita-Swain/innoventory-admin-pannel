import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import DataTable from '../components/DataTable/DataTable';

const TypeOfWork = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  // Demo data for display (not saved to database)
  const [typeOfWorkData, setTypeOfWorkData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Load type of work from database
  useEffect(() => {
    const loadTypeOfWork = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading type of work from database...');
        // Import and use database service
        const { getAllTypeOfWork } = await import('../services/database');
        const dbTypeOfWork = await getAllTypeOfWork();
        console.log('✅ Type of work loaded:', dbTypeOfWork);

        console.log('✅ Type of work loaded:', dbTypeOfWork);
        setTypeOfWorkData(dbTypeOfWork);
      } catch (err) {
        console.error('❌ Error loading type of work:', err);
        // Fallback to demo data if database fails
        setTypeOfWorkData(demoTypeOfWork);
      } finally {
        setLoading(false);
      }
    };

    loadTypeOfWork();
  }, []);

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
            onClick={() => handleEdit(row.id)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(row.id, row.status)}
            className={`${
              row.status === 'Active'
                ? 'text-green-600 hover:text-green-800'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title={row.status === 'Active' ? 'Deactivate' : 'Activate'}
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

  const handleEdit = (id) => {
    console.log('Edit type of work:', id);
    // Implementation for edit functionality
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      console.log(`🔄 Toggling status for type of work ${id} to ${newStatus}...`);

      // Import and use database service
      const { updateTypeOfWorkStatus } = await import('../services/database');
      await updateTypeOfWorkStatus(id, newStatus);

      // Update local state
      setTypeOfWorkData(prevData =>
        prevData.map(item =>
          item.id === id
            ? { ...item, status: newStatus }
            : item
        )
      );

      console.log(`✅ Type of work status updated to ${newStatus}`);
      alert(`Type of work status updated to ${newStatus}`);
    } catch (error) {
      console.error('❌ Error updating type of work status:', error);
      alert('Failed to update type of work status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this type of work? This action cannot be undone.')) {
      return;
    }

    try {
      console.log(`🔄 Deleting type of work ${id}...`);

      // Import and use database service
      const { deleteTypeOfWork } = await import('../services/database');
      await deleteTypeOfWork(id);

      // Update local state
      setTypeOfWorkData(prevData => prevData.filter(item => item.id !== id));

      console.log('✅ Type of work deleted successfully');
      alert('Type of work deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting type of work:', error);
      alert('Failed to delete type of work');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Type of Work</h1>
          <p className="mt-2 text-gray-600">Manage different types of work and services</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Work Type
        </button>
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

      {/* Add Form Modal - Placeholder */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Work Type</h3>
              <p className="text-gray-600 mb-4">Form implementation coming soon...</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypeOfWork;
