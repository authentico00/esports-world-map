/**
 * Country data types for the esports world map
 * Provides type safety for country codes, names, regions, and related data structures
 */

import { EsportsRegion } from './esports';

/**
 * Standard ISO country codes - 2-letter alpha codes (ISO 3166-1 alpha-2)
 * Examples: 'US', 'GB', 'DE', 'XK' (Kosovo special case)
 */
export type Alpha2CountryCode = string;

/**
 * Standard ISO country codes - 3-digit numeric codes (ISO 3166-1 numeric)
 * Examples: '840' (US), '826' (GB), '276' (DE), undefined (Kosovo special case)
 */
export type NumericCountryCode = string | undefined;

/**
 * Country names as they appear in various data sources
 * Can be full names, abbreviated names, or alternative names
 */
export type CountryName = string;

/**
 * Basic country information structure
 * Used throughout the application for country identification
 */
export interface BaseCountry {
  /** 2-letter country code (ISO 3166-1 alpha-2) */
  code: Alpha2CountryCode;
  /** Official or common country name */
  name: CountryName;
  /** Associated esports region */
  region: EsportsRegion;
}

/**
 * Extended country information with additional identifiers
 * Used for mapping between different country code systems
 */
export interface Country extends BaseCountry {
  /** 3-digit numeric country code (ISO 3166-1 numeric) */
  numericCode?: NumericCountryCode;
  /** Alternative names and abbreviations */
  alternativeNames?: CountryName[];
  /** Flag emoji (Unicode) */
  flagEmoji?: string;
}

/**
 * Geography data from map sources (e.g., world-atlas)
 * Represents raw geographic data before processing
 */
export interface GeographyProperties {
  /** Country name from geography data source */
  NAME?: string;
  /** Alternative name property */
  name?: string;
  /** English name property */
  NAME_EN?: string;
  /** Any additional properties from geography data */
  [key: string]: unknown;
}

/**
 * Geography object structure from map data sources
 */
export interface GeographyData {
  /** Geographic identifier (usually numeric, can be undefined for special cases) */
  id: NumericCountryCode;
  /** Geographic properties containing country name and other data */
  properties?: GeographyProperties;
  /** Geographic shape data */
  geometry?: {
    coordinates?: unknown;
    [key: string]: unknown;
  };
  /** React simple maps key */
  rsmKey?: string;
  /** Additional properties */
  [key: string]: unknown;
}

/**
 * Country hover state information
 * Used for displaying hover modals and tooltips
 */
export interface HoveredCountry {
  /** Country name */
  name: CountryName;
  /** Associated esports region */
  region: EsportsRegion | null;
  /** Country code for flag display */
  countryCode: Alpha2CountryCode;
}

/**
 * Country search/zoom target information
 * Used for search functionality and country highlighting
 */
export interface CountryTarget {
  /** Country code for identification */
  countryCode: Alpha2CountryCode;
  /** Country name for display */
  countryName: CountryName;
}

/**
 * Search modal state with protection and persistence flags
 * Manages the search-triggered modal behavior
 */
export interface SearchModalState extends HoveredCountry {
  /** Protected from hover overrides for first 5 seconds */
  isProtected: boolean;
  /** Stays visible after protection period until explicit dismissal */
  isPersistent: boolean;
}

/**
 * Country option for search dropdown
 * Optimized for search component display and interaction
 */
export interface CountrySearchOption extends BaseCountry {
  /** Search relevance score (for sorting results) */
  searchScore?: number;
  /** Whether this country matches the current search query */
  matches?: boolean;
}

/**
 * Country code mapping structures
 * Used for converting between different country code systems
 */
export interface CountryCodeMappings {
  /** Maps numeric codes to alpha-2 codes */
  numericToAlpha2: Record<string, Alpha2CountryCode>;
  /** Maps alpha-2 codes to numeric codes */
  alpha2ToNumeric: Record<Alpha2CountryCode, NumericCountryCode>;
  /** Maps country names to alpha-2 codes */
  nameToAlpha2: Record<CountryName, Alpha2CountryCode>;
  /** Maps alternative/abbreviated names to full names */
  nameExpansions: Record<CountryName, CountryName[]>;
}

/**
 * Country region assignment data
 * Maps country codes to their associated esports regions
 */
export type CountryRegionMap = Record<Alpha2CountryCode, EsportsRegion>;

/**
 * Flag loading and display utilities
 */
export interface FlagData {
  /** Country code for flag APIs */
  code: Alpha2CountryCode;
  /** Country name for fallbacks */
  name: CountryName;
  /** Primary flag image URL */
  primaryUrl: string;
  /** Fallback flag URLs */
  fallbackUrls: string[];
  /** Whether flag loading failed */
  hasError?: boolean;
}

/**
 * Country statistics and data (for future features)
 */
export interface CountryStats {
  /** Country identification */
  country: BaseCountry;
  /** Population */
  population?: number;
  /** Economic indicators */
  gdp?: number;
  /** Internet penetration rate */
  internetPenetration?: number;
  /** Gaming/esports specific statistics */
  esportsStats?: {
    playerCount?: number;
    majorTournaments?: number;
    professionalTeams?: number;
  };
}

/**
 * Preloading configuration for countries
 * Used for optimizing flag loading performance
 */
export interface CountryPreloadConfig {
  /** Countries to preload immediately */
  tier1: Alpha2CountryCode[];
  /** Countries to preload after delay */
  tier2: Alpha2CountryCode[];
  /** Countries to preload after longer delay */
  tier3: Alpha2CountryCode[];
}

/**
 * Event handlers for country interactions
 */
export interface CountryEventHandlers {
  /** Handles country hover events */
  onCountryHover: (
    countryCode: NumericCountryCode | null, 
    countryName?: CountryName, 
    region?: EsportsRegion | null, 
    event?: React.MouseEvent
  ) => void;
  
  /** Handles country selection from search */
  onCountrySelect: (
    countryCode: Alpha2CountryCode, 
    countryName: CountryName
  ) => void;
  
  /** Handles country click events (if enabled) */
  onCountryClick?: (
    countryCode: NumericCountryCode, 
    countryName?: CountryName, 
    region?: EsportsRegion | null
  ) => void;
}

/**
 * Type guards for country data validation
 */
export const CountryTypeGuards = {
  isValidAlpha2Code: (code: string): code is Alpha2CountryCode => {
    return typeof code === 'string' && code.length === 2 && /^[A-Z]{2}$/.test(code);
  },
  
  isValidNumericCode: (code: string): code is NumericCountryCode => {
    return typeof code === 'string' && code.length === 3 && /^\d{3}$/.test(code) && code !== undefined;
  },
  
  isBaseCountry: (obj: unknown): obj is BaseCountry => {
    return typeof obj === 'object' && 
           obj !== null && 
           'code' in obj && 
           'name' in obj && 
           'region' in obj;
  },
  
  isHoveredCountry: (obj: unknown): obj is HoveredCountry => {
    return typeof obj === 'object' && 
           obj !== null && 
           'name' in obj && 
           'countryCode' in obj;
  }
};

/**
 * Utility types for common country data operations
 */
export type CountryLookupResult = Country | null;
export type CountrySearchResults = CountrySearchOption[];
export type CountryPreloadTier = 'tier1' | 'tier2' | 'tier3';

/**
 * Special country codes and identifiers
 */
export const SPECIAL_COUNTRIES = {
  /** Kosovo - uses XK as user-assigned code */
  KOSOVO: {
    alpha2: 'XK' as Alpha2CountryCode,
    numeric: undefined as NumericCountryCode,
    name: 'Kosovo' as CountryName,
    region: EsportsRegion.EUROPE
  },
  /** Antarctica - has Unicode flag but no official government flag */
  ANTARCTICA: {
    alpha2: 'AQ' as Alpha2CountryCode,
    numeric: '010' as NumericCountryCode,
    name: 'Antarctica' as CountryName,
    region: null
  }
} as const;

/**
 * Common country name patterns for search matching
 */
export const COUNTRY_NAME_PATTERNS = {
  /** Democratic republics */
  DEMOCRATIC_REPUBLIC: /^(democratic\s+republic\s+of|dem\.?\s+rep\.?\s+)/i,
  /** United/Union countries */
  UNITED: /^united\s+(states|kingdom|arab\s+emirates)/i,
  /** Saint/St. countries */
  SAINT: /^(saint|st\.?)\s+/i,
  /** North/South variants */
  DIRECTIONAL: /^(north|south|east|west)\s+/i,
  /** Republic abbreviations */
  REPUBLIC_ABBREV: /\s+(rep\.?|republic)$/i
} as const;