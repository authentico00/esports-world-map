/**
 * Flag loading utilities for esports world map
 * Provides comprehensive country code mapping and fallback flag loading
 */

import type { Alpha2CountryCode, CountryName, NumericCountryCode } from '@/types/country';
import { numericToAlpha2, getCountryCodeFromName, resolveCountryCode, handleSpecialCases } from './countryMappings';

export interface FlagSources {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
}

/**
 * Available flag API sources with their patterns
 */
export const FLAG_SOURCES: FlagSources = {
  primary: 'https://flagcdn.com/w40/{code}.png',
  secondary: 'https://flagpedia.net/data/flags/mini/{code}.png',
  tertiary: 'https://flagsapi.com/{CODE}/flat/32.png',
  quaternary: 'https://flagicons.lipis.dev/flags/4x3/{code}.svg'
};

/**
 * Gets the appropriate country code for flag APIs
 * Handles numeric ISO codes, country names, and special cases
 */
export function getCountryCodeForFlag(countryId: NumericCountryCode | string, countryName: CountryName): Alpha2CountryCode {
  // Check for special cases first
  const specialCase = handleSpecialCases(countryId, countryName);
  if (specialCase) {
    return specialCase.toLowerCase() as Alpha2CountryCode;
  }
  
  // Try numeric to alpha-2 conversion
  if (countryId && countryId !== 'undefined') {
    const alpha2 = numericToAlpha2(countryId);
    if (alpha2) {
      return alpha2.toLowerCase() as Alpha2CountryCode;
    }
  }
  
  // Try country name lookup
  if (countryName) {
    const alpha2 = getCountryCodeFromName(countryName);
    if (alpha2) {
      return alpha2.toLowerCase() as Alpha2CountryCode;
    }
  }
  
  // Universal resolver as final attempt
  const resolved = resolveCountryCode(countryId || countryName);
  if (resolved) {
    return resolved.toLowerCase() as Alpha2CountryCode;
  }
  
  // Final fallback
  if (countryId && countryId !== 'undefined') {
    return countryId.toLowerCase().slice(0, 2) as Alpha2CountryCode;
  }
  
  return 'unknown' as Alpha2CountryCode;
}

/**
 * Gets flag URL for a specific source
 */
export function getFlagUrl(countryCode: NumericCountryCode | Alpha2CountryCode, countryName: CountryName, source: keyof FlagSources = 'primary'): string {
  const code = getCountryCodeForFlag(countryCode, countryName);
  const pattern = FLAG_SOURCES[source];
  return pattern.replace('{code}', code).replace('{CODE}', code.toUpperCase());
}

/**
 * Handles flag loading with cascade fallbacks
 * Returns an onError handler that tries different flag sources
 */
export function createFlagErrorHandler(countryCode: NumericCountryCode | Alpha2CountryCode, countryName: CountryName) {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    const code = getCountryCodeForFlag(countryCode, countryName);
    
    if (img.src.includes('flagcdn.com')) {
      // Try Flagpedia as second option
      img.src = getFlagUrl(countryCode, countryName, 'secondary');
    } else if (img.src.includes('flagpedia.net')) {
      // Try Flagsapi as third option  
      img.src = getFlagUrl(countryCode, countryName, 'tertiary');
    } else if (img.src.includes('flagsapi.com')) {
      // Try Flagicons as fourth option
      img.src = getFlagUrl(countryCode, countryName, 'quaternary');
    } else {
      // Final fallback: check for special cases or hide
      if (code === 'aq') {
        // Antarctica: Show a snowflake or ice symbol instead of flag
        img.style.display = 'none';
        const parent = img.parentElement;
        if (parent) {
          parent.innerHTML = '<div class="w-6 h-4 bg-blue-100 rounded border flex items-center justify-center text-xs">❄️</div>';
        }
      } else {
        img.style.display = 'none';
      }
    }
  };
}