/**
 * Location Service
 * Handles states and cities data from local JSON file
 */

// Cache for states and cities data
let locationData = null;
let statesCache = null;
let citiesCache = {};

/**
 * Load location data from local JSON file
 */
const loadLocationData = async () => {
  try {
    if (locationData) {
      return locationData;
    }

    console.log('🔄 Loading states and cities from local JSON file...');

    // Import the JSON file
    const response = await fetch('/cities_states.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    locationData = await response.json();
    console.log(`✅ Loaded ${locationData.length} states with cities from JSON file`);

    return locationData;
  } catch (error) {
    console.error('❌ Error loading location data:', error);
    throw error;
  }
};

/**
 * Get all states from local JSON file
 */
export const getAllStates = async () => {
  try {
    // Return cached data if available
    if (statesCache) {
      console.log('📍 Returning cached states data');
      return statesCache;
    }

    // Load data from JSON file
    const data = await loadLocationData();

    // Transform the data to a more usable format
    const states = data.map((state, index) => ({
      id: index + 1,
      name: state.name,
      code: state.name.substring(0, 2).toUpperCase()
    }));

    // Sort states alphabetically
    states.sort((a, b) => a.name.localeCompare(b.name));

    // Cache the results
    statesCache = states;

    console.log(`✅ Processed ${states.length} states successfully`);
    return states;

  } catch (error) {
    console.error('❌ Error fetching states:', error);

    // Fallback to basic states if JSON loading fails
    const fallbackStates = [
      { id: 1, name: 'Andhra Pradesh', code: 'AP' },
      { id: 2, name: 'Karnataka', code: 'KA' },
      { id: 3, name: 'Maharashtra', code: 'MH' },
      { id: 4, name: 'Tamil Nadu', code: 'TN' },
      { id: 5, name: 'Delhi', code: 'DL' }
    ];

    console.log('⚠️ Using fallback states data');
    statesCache = fallbackStates;
    return fallbackStates;
  }
};

/**
 * Get cities for a specific state by state name
 */
export const getCitiesByStateName = async (stateName) => {
  try {
    // Return cached data if available
    if (citiesCache[stateName]) {
      console.log(`📍 Returning cached cities for state ${stateName}`);
      return citiesCache[stateName];
    }

    console.log(`🔄 Loading cities for state ${stateName}...`);

    // Load data from JSON file
    const data = await loadLocationData();

    // Find the state by name
    const stateData = data.find(state => state.name === stateName);

    if (!stateData) {
      console.warn(`⚠️ State ${stateName} not found in data`);
      return [];
    }

    // Transform cities to the expected format
    const cities = stateData.cities.map((city, index) => ({
      id: index + 1,
      name: city,
      stateName: stateName
    }));

    // Sort cities alphabetically
    cities.sort((a, b) => a.name.localeCompare(b.name));

    // Cache the results
    citiesCache[stateName] = cities;

    console.log(`✅ Loaded ${cities.length} cities for state ${stateName}`);
    return cities;

  } catch (error) {
    console.error(`❌ Error loading cities for state ${stateName}:`, error);
    return [];
  }
};

/**
 * Get cities for a specific state by state ID (for backward compatibility)
 */
export const getDistrictsByState = async (stateId) => {
  try {
    // Get all states to find the state name by ID
    const states = await getAllStates();
    const state = states.find(s => s.id == stateId);

    if (!state) {
      console.warn(`⚠️ State with ID ${stateId} not found`);
      return [];
    }

    return await getCitiesByStateName(state.name);
  } catch (error) {
    console.error(`❌ Error getting cities for state ID ${stateId}:`, error);
    return [];
  }
};



/**
 * Search states by name
 */
export const searchStates = async (searchTerm) => {
  try {
    const states = await getAllStates();
    return states.filter(state => 
      state.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('❌ Error searching states:', error);
    return [];
  }
};

/**
 * Search cities by name within a state
 */
export const searchCities = async (stateName, searchTerm) => {
  try {
    const cities = await getCitiesByStateName(stateName);
    return cities.filter(city =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('❌ Error searching cities:', error);
    return [];
  }
};

/**
 * Search districts by name within a state (backward compatibility)
 */
export const searchDistricts = async (stateId, searchTerm) => {
  try {
    const districts = await getDistrictsByState(stateId);
    return districts.filter(district =>
      district.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('❌ Error searching districts:', error);
    return [];
  }
};

/**
 * Clear cache (useful for refreshing data)
 */
export const clearLocationCache = () => {
  locationData = null;
  statesCache = null;
  citiesCache = {};
  console.log('🗑️ Location cache cleared');
};
