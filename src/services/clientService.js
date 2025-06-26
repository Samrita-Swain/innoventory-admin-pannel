import { sql } from '../config/database.js';

// Get all clients
export const getAllClients = async () => {
  try {
    const clients = await sql`
      SELECT 
        id,
        company_name,
        company_type,
        onboarding_date,
        emails,
        phones,
        address,
        country,
        state,
        city,
        dpiit_registered,
        dpiit_number,
        files,
        status,
        created_at,
        updated_at
      FROM clients 
      ORDER BY created_at DESC
    `;

    // Transform dates to strings to prevent React errors
    return clients.map(client => ({
      ...client,
      onboarding_date: client.onboarding_date ? new Date(client.onboarding_date).toISOString().split('T')[0] : '',
      created_at: client.created_at ? new Date(client.created_at).toISOString().split('T')[0] : '',
      updated_at: client.updated_at ? new Date(client.updated_at).toISOString().split('T')[0] : '',
      valid_till: client.valid_till ? new Date(client.valid_till).toISOString().split('T')[0] : ''
    }));
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

// Demo clients fallback data
const demoClients = [
  {
    id: 'demo-client-1',
    onboarding_date: '2024-01-10',
    onboardingDate: '2024-01-10',
    company_type: 'Startup',
    companyType: 'Startup',
    company_name: 'Acme Corporation',
    companyName: 'Acme Corporation',
    emails: ['contact@acme.com', 'admin@acme.com'],
    phones: ['+91-9876543210', '+91-9876543211'],
    address: 'Tech Hub, Bandra Kurla Complex, Mumbai',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    is_dpiit_registered: false,
    isDpiitRegistered: false,
    dpiit_number: '',
    dpiitNumber: '',
    dpiit_certificate: '',
    dpiitCertificate: '',
    total_projects: 5,
    totalProjects: 5,
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'demo-client-2',
    onboarding_date: '2024-02-15',
    onboardingDate: '2024-02-15',
    company_type: 'DPIIT',
    companyType: 'DPIIT',
    company_name: 'Global Tech Inc',
    companyName: 'Global Tech Inc',
    emails: ['info@globaltech.com'],
    phones: ['+91-8765432109'],
    address: 'Innovation District, Electronic City, Bangalore',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
    is_dpiit_registered: true,
    isDpiitRegistered: true,
    dpiit_number: 'DPIIT12345',
    dpiitNumber: 'DPIIT12345',
    dpiit_certificate: 'dpiit_cert_globaltech.pdf',
    dpiitCertificate: 'dpiit_cert_globaltech.pdf',
    total_projects: 12,
    totalProjects: 12,
    isActive: true,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z'
  },
  {
    id: 'demo-client-3',
    onboarding_date: '2024-03-01',
    onboardingDate: '2024-03-01',
    company_type: 'Small Entity',
    companyType: 'Small Entity',
    company_name: 'StartUp Solutions',
    companyName: 'StartUp Solutions',
    emails: ['hello@startupsolutions.com'],
    phones: ['+91-7654321098'],
    address: 'Business Park, Connaught Place, New Delhi',
    country: 'India',
    state: 'Delhi',
    city: 'New Delhi',
    is_dpiit_registered: false,
    isDpiitRegistered: false,
    dpiit_number: '',
    dpiitNumber: '',
    dpiit_certificate: '',
    dpiitCertificate: '',
    total_projects: 3,
    totalProjects: 3,
    isActive: true,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  }
];

// Get client by ID
export const getClientById = async (id) => {
  try {
    // First try to get from database
    const client = await sql`
      SELECT
        id,
        company_name,
        company_type,
        onboarding_date,
        emails,
        phones,
        address,
        country,
        state,
        city,
        dpiit_registered,
        dpiit_number,
        files,
        status,
        created_at,
        updated_at
      FROM clients 
      WHERE id = ${id}
    `;

    const clientData = client[0];

    // If found in database, return it
    if (clientData) {
      console.log('✅ Client found in database:', clientData);
      return {
        ...clientData,
        onboarding_date: clientData.onboarding_date ? new Date(clientData.onboarding_date).toISOString().split('T')[0] : '',
        created_at: clientData.created_at ? new Date(clientData.created_at).toISOString().split('T')[0] : '',
        updated_at: clientData.updated_at ? new Date(clientData.updated_at).toISOString().split('T')[0] : '',
        valid_till: clientData.valid_till ? new Date(clientData.valid_till).toISOString().split('T')[0] : ''
      };
    }

    // If not found in database, check demo data
    const demoClient = demoClients.find(c => c.id === id);
    if (demoClient) {
      console.log('✅ Client found in demo data:', demoClient);
      return demoClient;
    }

    console.log('❌ Client not found:', id);
    return null;
  } catch (error) {
    console.error('Error fetching client by ID:', error);

    // Fallback to demo data if database error
    const demoClient = demoClients.find(c => c.id === id);
    if (demoClient) {
      console.log('✅ Using demo client as fallback:', demoClient);
      return demoClient;
    }

    throw error;
  }
};

// Create new client
export const createClient = async (clientData) => {
  try {
    const {
      companyName,
      companyType,
      onboardingDate,
      emails,
      phones,
      address,
      country,
      state,
      city,
      dpiitRegistered = false,
      dpiitNumber,
      files = {},
      status = 'Active'
    } = clientData;

    const client = await sql`
      INSERT INTO clients (
        company_name,
        company_type,
        onboarding_date,
        emails,
        phones,
        address,
        country,
        state,
        city,
        dpiit_registered,
        dpiit_number,
        files,
        status
      ) VALUES (
        ${companyName},
        ${companyType},
        ${onboardingDate},
        ${JSON.stringify(emails)},
        ${JSON.stringify(phones)},
        ${address},
        ${country},
        ${state},
        ${city},
        ${dpiitRegistered},
        ${dpiitNumber},
        ${JSON.stringify(files)},
        ${status}
      )
      RETURNING *
    `;
    return client[0];
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

// Update client
export const updateClient = async (id, clientData) => {
  try {
    const {
      companyName,
      companyType,
      onboardingDate,
      emails,
      phones,
      address,
      country,
      state,
      city,
      dpiitRegistered,
      dpiitNumber,
      files,
      status
    } = clientData;

    const client = await sql`
      UPDATE clients SET
        company_name = ${companyName},
        company_type = ${companyType},
        onboarding_date = ${onboardingDate},
        emails = ${JSON.stringify(emails)},
        phones = ${JSON.stringify(phones)},
        address = ${address},
        country = ${country},
        state = ${state},
        city = ${city},
        dpiit_registered = ${dpiitRegistered},
        dpiit_number = ${dpiitNumber},
        files = ${JSON.stringify(files)},
        status = ${status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return client[0];
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

// Delete client
export const deleteClient = async (id) => {
  try {
    await sql`DELETE FROM clients WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

// Get client statistics
export const getClientStats = async () => {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total_clients,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_clients,
        COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive_clients,
        COUNT(CASE WHEN dpiit_registered = true THEN 1 END) as dpiit_registered_clients,
        COUNT(CASE WHEN company_type = 'Startup' THEN 1 END) as startup_clients,
        COUNT(CASE WHEN company_type = 'MSME' THEN 1 END) as msme_clients,
        COUNT(CASE WHEN company_type = 'Large Entity' THEN 1 END) as large_entity_clients
      FROM clients
    `;
    return stats[0];
  } catch (error) {
    console.error('Error fetching client stats:', error);
    throw error;
  }
};

// Search clients
export const searchClients = async (searchTerm) => {
  try {
    const clients = await sql`
      SELECT 
        id,
        company_name,
        company_type,
        onboarding_date,
        emails,
        phones,
        address,
        country,
        state,
        city,
        dpiit_registered,
        dpiit_number,
        files,
        status,
        created_at,
        updated_at
      FROM clients 
      WHERE 
        company_name ILIKE ${`%${searchTerm}%`} OR
        company_type ILIKE ${`%${searchTerm}%`} OR
        dpiit_number ILIKE ${`%${searchTerm}%`}
      ORDER BY created_at DESC
    `;
    return clients;
  } catch (error) {
    console.error('Error searching clients:', error);
    throw error;
  }
};
