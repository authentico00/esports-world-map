import { EsportsRegion } from '@/types/esports';
import { getValveCountryRegion } from './valveRegions';

// Build static mapping from known countries using Valve data
// This provides immediate access and fallbacks
const buildStaticMapping = async (): Promise<Record<string, EsportsRegion>> => {
  const knownCountries = [
    'us', 'ca', 'mx', 'br', 'ar', 'cl', 'pe', 'co', 'uy', 've', 'ec', 'bo', 'py',
    'de', 'gb', 'fr', 'se', 'dk', 'no', 'fi', 'nl', 'be', 'ch', 'at', 'it', 'es', 
    'pl', 'cz', 'ua', 'ru', 'tr', 'kz', 'kr', 'jp', 'cn', 'in', 'th', 'vn', 'ph', 'id', 
    'my', 'sg', 'au', 'nz', 'fj', 'pg', 'za', 'eg', 'il', 'ae', 'sa', 'qa', 'dz', 'ma',
    'tn', 'ly', 'am', 'az', 'bh', 'cy', 'ge', 'iq', 'jo', 'kw', 'lb', 'om', 'ps', 'sy', 'ye'
  ];
  
  const mapping: Record<string, EsportsRegion> = {};
  
  // Use Promise.allSettled to handle any individual failures gracefully
  const results = await Promise.allSettled(
    knownCountries.map(async (countryCode) => {
      const region = await getValveCountryRegion(countryCode);
      return { countryCode: countryCode.toUpperCase(), region };
    })
  );
  
  // Process results
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      mapping[result.value.countryCode] = result.value.region;
    } else {
      // Fallback for failed countries
      const countryCode = knownCountries[index].toUpperCase();
      mapping[countryCode] = EsportsRegion.EUROPE;
    }
  });
  
  return mapping;
};

// Initialize the mapping
let staticCountryRegions: Record<string, EsportsRegion> = {};
let isInitialized = false;

// Initialize mapping on module load
buildStaticMapping()
  .then(mapping => {
    staticCountryRegions = mapping;
    isInitialized = true;
  })
  .catch(error => {
    console.error('Failed to build country regions mapping:', error);
    // Fallback mapping for core countries
    staticCountryRegions = {
      'US': EsportsRegion.NORTH_AMERICA,
      'CA': EsportsRegion.NORTH_AMERICA,
      'MX': EsportsRegion.NORTH_AMERICA,
      'BR': EsportsRegion.SOUTH_AMERICA,
      'AR': EsportsRegion.SOUTH_AMERICA,
      'CL': EsportsRegion.SOUTH_AMERICA,
      'DE': EsportsRegion.EUROPE,
      'GB': EsportsRegion.EUROPE,
      'FR': EsportsRegion.EUROPE,
      'SE': EsportsRegion.EUROPE,
      'DK': EsportsRegion.EUROPE,
      'KR': EsportsRegion.ASIA,
      'JP': EsportsRegion.ASIA,
      'CN': EsportsRegion.ASIA,
      'AU': EsportsRegion.OCEANIA,
      'NZ': EsportsRegion.OCEANIA,
      'ZA': EsportsRegion.AFRICA_NON_MENA,
      'EG': EsportsRegion.MENA,
      'SA': EsportsRegion.MENA,
    };
    isInitialized = true;
  });

// Async function to get country region (preferred for new lookups)
export async function getCountryRegion(countryCode: string): Promise<EsportsRegion> {
  const upperCountryCode = countryCode.toUpperCase();
  
  // Check cache first
  if (staticCountryRegions[upperCountryCode]) {
    return staticCountryRegions[upperCountryCode];
  }
  
  // Try to get from Valve data directly
  try {
    const region = await getValveCountryRegion(countryCode);
    staticCountryRegions[upperCountryCode] = region; // Cache result
    return region;
  } catch (error) {
    console.warn(`Failed to get region for ${countryCode}, using fallback`);
    return EsportsRegion.EUROPE; // Fallback
  }
}

// Synchronous version for immediate access
export function getCountryRegionSync(countryCode: string): EsportsRegion {
  const upperCountryCode = countryCode.toUpperCase();
  return staticCountryRegions[upperCountryCode] || EsportsRegion.EUROPE;
}

// Export the static mapping for existing code compatibility
export const COUNTRY_REGIONS: Record<string, EsportsRegion> = new Proxy({}, {
  get(_, prop: string) {
    return staticCountryRegions[prop] || EsportsRegion.EUROPE;
  },
  has(_, prop: string) {
    return prop in staticCountryRegions || true; // Always return true for compatibility
  },
  ownKeys(_) {
    return Object.keys(staticCountryRegions);
  }
});

export const SAMPLE_TOURNAMENTS = [
  {
    id: 'all',
    name: 'Show All Regions',
    regions: [
      EsportsRegion.AMERICAS,
      EsportsRegion.EUROPE,
      EsportsRegion.ASIA_PACIFIC,
      EsportsRegion.NORTH_AMERICA,
      EsportsRegion.SOUTH_AMERICA,
      EsportsRegion.MENA,
      EsportsRegion.OCEANIA,
      EsportsRegion.ASIA,
      EsportsRegion.ANTARCTICA,
      EsportsRegion.AFRICA_NON_MENA
    ],
    countries: Object.keys(COUNTRY_REGIONS)
  }
];