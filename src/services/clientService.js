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

// Get client by ID
export const getClientById = async (id) => {
  try {
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
    if (!clientData) return null;

    // Transform dates to strings to prevent React errors
    return {
      ...clientData,
      onboarding_date: clientData.onboarding_date ? new Date(clientData.onboarding_date).toISOString().split('T')[0] : '',
      created_at: clientData.created_at ? new Date(clientData.created_at).toISOString().split('T')[0] : '',
      updated_at: clientData.updated_at ? new Date(clientData.updated_at).toISOString().split('T')[0] : '',
      valid_till: clientData.valid_till ? new Date(clientData.valid_till).toISOString().split('T')[0] : ''
    };
  } catch (error) {
    console.error('Error fetching client by ID:', error);
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
