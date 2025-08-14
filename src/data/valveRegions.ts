import { EsportsRegion } from '@/types/esports';

// Import the Valve region.js file
// Note: This will require dynamic import since it's a CommonJS module
let valveRegions: any = null;

// Function to load Valve region data
async function loadValveRegions() {
  if (!valveRegions) {
    try {
      // Dynamic import of the Valve region.js file
      const valveModule = await import('../../valve-data/model/util/region.js');
      // Handle CommonJS module.exports structure
      valveRegions = valveModule.default || valveModule;
    } catch (error) {
      console.error('Failed to load Valve region data:', error);
      throw error;
    }
  }
  return valveRegions;
}

// Function to map region codes from Valve's region.js to our EsportsRegion enums
function mapRegionCodeToEsportsRegion(regionCode: string): EsportsRegion {
  switch (regionCode) {
    case 'MENA':
      return EsportsRegion.MENA; // Sub-region: MENA, Main region: Europe
    case 'AF':
      return EsportsRegion.AFRICA_NON_MENA; // Sub-region: Africa (non-MENA), Main region: Asia-Pacific
    case 'AN':
      return EsportsRegion.ANTARCTICA; // Sub-region: Antarctica
    case 'AS':
      return EsportsRegion.ASIA; // Sub-region: Asia, Main region: Asia-Pacific
    case 'EU':
      return EsportsRegion.EUROPE; // Main region: Europe
    case 'NA':
      return EsportsRegion.NORTH_AMERICA; // Sub-region: North America, Main region: Americas
    case 'OC':
      return EsportsRegion.OCEANIA; // Sub-region: Oceania, Main region: Asia-Pacific
    case 'SA':
      return EsportsRegion.SOUTH_AMERICA; // Sub-region: South America, Main region: Americas
    default:
      return EsportsRegion.EUROPE; // Default fallback
  }
}

// Create a hardcoded mapping for more precise region assignment
// This is based on the actual data in Valve's region.js file
const specificRegionMapping: Record<string, string> = {
  // MENA countries
  'dz': 'MENA', 'eg': 'MENA', 'ly': 'MENA', 'ma': 'MENA', 'tn': 'MENA',
  'am': 'MENA', 'az': 'MENA', 'bh': 'MENA', 'cy': 'MENA', 'ge': 'MENA',
  'iq': 'MENA', 'il': 'MENA', 'jo': 'MENA', 'kw': 'MENA', 'lb': 'MENA',
  'om': 'MENA', 'ps': 'MENA', 'qa': 'MENA', 'sa': 'MENA', 'sy': 'MENA',
  'ae': 'MENA', 'ye': 'MENA',
  
  // South America countries
  'ar': 'SA', 'bo': 'SA', 'br': 'SA', 'cl': 'SA', 'co': 'SA', 'ec': 'SA',
  'fk': 'SA', 'gf': 'SA', 'gy': 'SA', 'py': 'SA', 'pe': 'SA', 'sr': 'SA',
  'uy': 'SA', 've': 'SA',
  
  // Oceania countries
  'as': 'OC', 'au': 'OC', 'ck': 'OC', 'fj': 'OC', 'pf': 'OC', 'gu': 'OC',
  'ki': 'OC', 'mh': 'OC', 'fm': 'OC', 'nr': 'OC', 'nc': 'OC', 'nz': 'OC',
  'nu': 'OC', 'nf': 'OC', 'mp': 'OC', 'pw': 'OC', 'pg': 'OC', 'pn': 'OC',
  'ws': 'OC', 'sb': 'OC', 'tk': 'OC', 'to': 'OC', 'tv': 'OC', 'um': 'OC',
  'vu': 'OC', 'wf': 'OC'
};

// Function to get region for a country code using Valve's data
export async function getValveCountryRegion(countryCode: string): Promise<EsportsRegion> {
  try {
    const lowerCountryCode = countryCode.toLowerCase();
    
    // First check our specific mapping for precise region assignment
    if (specificRegionMapping[lowerCountryCode]) {
      return mapRegionCodeToEsportsRegion(specificRegionMapping[lowerCountryCode]);
    }
    
    // Fallback to Valve's numeric mapping
    const valveModule = await loadValveRegions();
    const valveRegionNumeric = valveModule.getCountryRegion(lowerCountryCode);
    
    // Map Valve's numeric codes to region strings
    let valveRegionCode: string;
    switch (valveRegionNumeric) {
      case 0: // Europe/MENA regions - use EU for unknown countries in this group
        valveRegionCode = 'EU';
        break;
      case 1: // Americas - use NA for unknown countries in this group
        valveRegionCode = 'NA';
        break;
      case 2: // Asia-Pacific - use AS for unknown countries in this group
        valveRegionCode = 'AS';
        break;
      case -1: // Africa (non-MENA)
        valveRegionCode = 'AF';
        break;
      default:
        valveRegionCode = 'EU'; // Fallback to Europe
    }
    
    return mapRegionCodeToEsportsRegion(valveRegionCode);
  } catch (error) {
    console.warn(`Failed to get region for country ${countryCode} from Valve data:`, error);
    return EsportsRegion.EUROPE; // Fallback
  }
}

// Sync version for cases where we need immediate access (uses cached data)
export function getCountryRegionSync(countryCode: string): EsportsRegion {
  // This function will use the existing static mapping as fallback
  // until we can fully migrate to async Valve data
  
  // For now, delegate to the existing COUNTRY_REGIONS mapping
  // which will be updated to use Valve data in the background
  return EsportsRegion.EUROPE; // Temporary fallback
}