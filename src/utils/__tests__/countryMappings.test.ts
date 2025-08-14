/**
 * Unit tests for centralized country mapping utilities
 */

import {
  NUMERIC_TO_ALPHA2,
  ALPHA2_TO_NUMERIC,
  COUNTRY_NAME_MAPPINGS,
  numericToAlpha2,
  alpha2ToNumeric,
  getCountryCodeFromName,
  resolveCountryCode,
  handleSpecialCases
} from '../countryMappings';

describe('Country Mapping Utilities', () => {
  describe('NUMERIC_TO_ALPHA2', () => {
    it('should contain major country mappings', () => {
      expect(NUMERIC_TO_ALPHA2['840']).toBe('US');
      expect(NUMERIC_TO_ALPHA2['826']).toBe('GB');
      expect(NUMERIC_TO_ALPHA2['276']).toBe('DE');
      expect(NUMERIC_TO_ALPHA2['392']).toBe('JP');
      expect(NUMERIC_TO_ALPHA2['156']).toBe('CN');
    });

    it('should handle special cases', () => {
      expect(NUMERIC_TO_ALPHA2['010']).toBe('AQ'); // Antarctica
      expect(NUMERIC_TO_ALPHA2['xk']).toBe('XK'); // Kosovo
    });
  });

  describe('ALPHA2_TO_NUMERIC', () => {
    it('should provide reverse mappings', () => {
      expect(ALPHA2_TO_NUMERIC['US']).toBe('840');
      expect(ALPHA2_TO_NUMERIC['GB']).toBe('826');
      expect(ALPHA2_TO_NUMERIC['DE']).toBe('276');
      expect(ALPHA2_TO_NUMERIC['XK']).toBe('XK'); // Kosovo special case
    });
  });

  describe('numericToAlpha2', () => {
    it('should convert numeric codes to alpha-2', () => {
      expect(numericToAlpha2('840')).toBe('US');
      expect(numericToAlpha2('826')).toBe('GB');
      expect(numericToAlpha2('276')).toBe('DE');
    });

    it('should return null for invalid codes', () => {
      expect(numericToAlpha2('999')).toBeNull();
      expect(numericToAlpha2('abc')).toBeNull();
    });

    it('should handle Kosovo special case', () => {
      expect(numericToAlpha2('xk')).toBe('XK');
    });
  });

  describe('alpha2ToNumeric', () => {
    it('should convert alpha-2 codes to numeric', () => {
      expect(alpha2ToNumeric('US')).toBe('840');
      expect(alpha2ToNumeric('GB')).toBe('826');
      expect(alpha2ToNumeric('DE')).toBe('276');
    });

    it('should handle case insensitive input', () => {
      expect(alpha2ToNumeric('us')).toBe('840');
      expect(alpha2ToNumeric('gb')).toBe('826');
    });

    it('should return null for invalid codes', () => {
      expect(alpha2ToNumeric('ZZ')).toBeNull();
      expect(alpha2ToNumeric('123')).toBeNull();
    });
  });

  describe('getCountryCodeFromName', () => {
    it('should convert standard country names', () => {
      expect(getCountryCodeFromName('United States')).toBe('US');
      expect(getCountryCodeFromName('United Kingdom')).toBe('GB');
      expect(getCountryCodeFromName('South Korea')).toBe('KR');
    });

    it('should handle case variations', () => {
      expect(getCountryCodeFromName('united states')).toBe('US');
      expect(getCountryCodeFromName('UNITED KINGDOM')).toBe('GB');
    });

    it('should handle alternative names', () => {
      expect(getCountryCodeFromName('USA')).toBe('US');
      expect(getCountryCodeFromName('UK')).toBe('GB');
      expect(getCountryCodeFromName('Great Britain')).toBe('GB');
    });

    it('should handle partial matching for edge cases', () => {
      expect(getCountryCodeFromName('Kosovo')).toBe('XK');
      expect(getCountryCodeFromName('Democratic Republic of Congo')).toBe('CD');
    });

    it('should return null for unknown countries', () => {
      expect(getCountryCodeFromName('Unknown Country')).toBeNull();
    });
  });

  describe('resolveCountryCode', () => {
    it('should resolve numeric codes', () => {
      expect(resolveCountryCode('840')).toBe('US');
      expect(resolveCountryCode('826')).toBe('GB');
    });

    it('should resolve alpha-2 codes', () => {
      expect(resolveCountryCode('US')).toBe('US');
      expect(resolveCountryCode('GB')).toBe('GB');
      expect(resolveCountryCode('us')).toBe('US'); // case insensitive
    });

    it('should resolve country names', () => {
      expect(resolveCountryCode('United States')).toBe('US');
      expect(resolveCountryCode('United Kingdom')).toBe('GB');
    });

    it('should return null for invalid input', () => {
      expect(resolveCountryCode('Invalid')).toBeNull();
      expect(resolveCountryCode('')).toBeNull();
    });
  });

  describe('handleSpecialCases', () => {
    it('should handle Kosovo with undefined ID', () => {
      expect(handleSpecialCases(undefined, 'Kosovo')).toBe('XK');
      expect(handleSpecialCases('undefined', 'Kosovo')).toBe('XK');
      expect(handleSpecialCases('', 'kosovo')).toBe('XK');
    });

    it('should handle Antarctica', () => {
      expect(handleSpecialCases('010', 'Antarctica')).toBe('AQ');
      expect(handleSpecialCases(undefined, 'Antarctica')).toBe('AQ');
    });

    it('should handle Northern Cyprus', () => {
      expect(handleSpecialCases(undefined, 'Northern Cyprus')).toBe('CY');
      expect(handleSpecialCases(undefined, 'N. Cyprus')).toBe('CY');
    });

    it('should handle Somaliland', () => {
      expect(handleSpecialCases(undefined, 'Somaliland')).toBe('SO');
    });

    it('should return null for non-special cases', () => {
      expect(handleSpecialCases('840', 'United States')).toBeNull();
      expect(handleSpecialCases('826', 'United Kingdom')).toBeNull();
    });
  });

  describe('COUNTRY_NAME_MAPPINGS consistency', () => {
    it('should have consistent mappings with NUMERIC_TO_ALPHA2', () => {
      // Test a few key countries to ensure consistency
      expect(COUNTRY_NAME_MAPPINGS['United States']).toBe('US');
      expect(NUMERIC_TO_ALPHA2['840']).toBe('US');
      
      expect(COUNTRY_NAME_MAPPINGS['United Kingdom']).toBe('GB');
      expect(NUMERIC_TO_ALPHA2['826']).toBe('GB');
      
      expect(COUNTRY_NAME_MAPPINGS['South Korea']).toBe('KR');
      expect(NUMERIC_TO_ALPHA2['410']).toBe('KR');
    });
  });

  describe('Integration tests', () => {
    it('should work end-to-end for common workflows', () => {
      // Test the full workflow: name → alpha-2 → numeric → alpha-2
      const originalName = 'United States';
      const alpha2 = getCountryCodeFromName(originalName);
      const numeric = alpha2ToNumeric(alpha2!);
      const backToAlpha2 = numericToAlpha2(numeric!);
      
      expect(alpha2).toBe('US');
      expect(numeric).toBe('840');
      expect(backToAlpha2).toBe('US');
    });

    it('should handle complex special cases consistently', () => {
      // Kosovo workflow
      expect(handleSpecialCases(undefined, 'Kosovo')).toBe('XK');
      expect(getCountryCodeFromName('Kosovo')).toBe('XK');
      expect(resolveCountryCode('Kosovo')).toBe('XK');
      
      // Antarctica workflow
      expect(handleSpecialCases('010', 'Antarctica')).toBe('AQ');
      expect(getCountryCodeFromName('Antarctica')).toBe('AQ');
      expect(numericToAlpha2('010')).toBe('AQ');
    });
  });
});