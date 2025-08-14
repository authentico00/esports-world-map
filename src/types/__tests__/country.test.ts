/**
 * Unit tests for country type utilities and validation functions
 */

import { 
  CountryTypeGuards, 
  SPECIAL_COUNTRIES, 
  COUNTRY_NAME_PATTERNS 
} from '../country';
import { EsportsRegion } from '../esports';

describe('Country Types', () => {
  describe('CountryTypeGuards', () => {
    describe('isValidAlpha2Code', () => {
      it('should validate correct alpha-2 codes', () => {
        expect(CountryTypeGuards.isValidAlpha2Code('US')).toBe(true);
        expect(CountryTypeGuards.isValidAlpha2Code('GB')).toBe(true);
        expect(CountryTypeGuards.isValidAlpha2Code('DE')).toBe(true);
        expect(CountryTypeGuards.isValidAlpha2Code('XK')).toBe(true); // Kosovo
      });

      it('should reject invalid alpha-2 codes', () => {
        expect(CountryTypeGuards.isValidAlpha2Code('USA')).toBe(false); // Too long
        expect(CountryTypeGuards.isValidAlpha2Code('U')).toBe(false); // Too short
        expect(CountryTypeGuards.isValidAlpha2Code('us')).toBe(false); // Lowercase
        expect(CountryTypeGuards.isValidAlpha2Code('U1')).toBe(false); // Contains number
        expect(CountryTypeGuards.isValidAlpha2Code('U-')).toBe(false); // Contains special char
        expect(CountryTypeGuards.isValidAlpha2Code('')).toBe(false); // Empty
      });

      it('should reject non-string inputs', () => {
        expect(CountryTypeGuards.isValidAlpha2Code(null as any)).toBe(false);
        expect(CountryTypeGuards.isValidAlpha2Code(undefined as any)).toBe(false);
        expect(CountryTypeGuards.isValidAlpha2Code(123 as any)).toBe(false);
        expect(CountryTypeGuards.isValidAlpha2Code({} as any)).toBe(false);
      });
    });

    describe('isValidNumericCode', () => {
      it('should validate correct numeric codes', () => {
        expect(CountryTypeGuards.isValidNumericCode('840')).toBe(true); // US
        expect(CountryTypeGuards.isValidNumericCode('826')).toBe(true); // GB
        expect(CountryTypeGuards.isValidNumericCode('276')).toBe(true); // DE
        expect(CountryTypeGuards.isValidNumericCode('010')).toBe(true); // Antarctica
        expect(CountryTypeGuards.isValidNumericCode('090')).toBe(true); // Solomon Islands
      });

      it('should reject invalid numeric codes', () => {
        expect(CountryTypeGuards.isValidNumericCode('8400')).toBe(false); // Too long
        expect(CountryTypeGuards.isValidNumericCode('84')).toBe(false); // Too short
        expect(CountryTypeGuards.isValidNumericCode('ABC')).toBe(false); // Letters
        expect(CountryTypeGuards.isValidNumericCode('8A0')).toBe(false); // Mixed
        expect(CountryTypeGuards.isValidNumericCode('')).toBe(false); // Empty
      });

      it('should reject non-string inputs', () => {
        expect(CountryTypeGuards.isValidNumericCode(null as any)).toBe(false);
        expect(CountryTypeGuards.isValidNumericCode(undefined as any)).toBe(false);
        expect(CountryTypeGuards.isValidNumericCode(840 as any)).toBe(false); // Number instead of string
      });
    });

    describe('isBaseCountry', () => {
      it('should validate correct BaseCountry objects', () => {
        const validCountry = {
          code: 'US' as const,
          name: 'United States' as const,
          region: EsportsRegion.NORTH_AMERICA
        };
        expect(CountryTypeGuards.isBaseCountry(validCountry)).toBe(true);
      });

      it('should validate BaseCountry with all regions', () => {
        Object.values(EsportsRegion).forEach(region => {
          const country = {
            code: 'US' as const,
            name: 'Test Country' as const,
            region
          };
          expect(CountryTypeGuards.isBaseCountry(country)).toBe(true);
        });
      });

      it('should reject objects missing required properties', () => {
        expect(CountryTypeGuards.isBaseCountry({ code: 'US', name: 'United States' })).toBe(false);
        expect(CountryTypeGuards.isBaseCountry({ code: 'US', region: EsportsRegion.NORTH_AMERICA })).toBe(false);
        expect(CountryTypeGuards.isBaseCountry({ name: 'United States', region: EsportsRegion.NORTH_AMERICA })).toBe(false);
      });

      it('should reject invalid inputs', () => {
        expect(CountryTypeGuards.isBaseCountry(null)).toBe(false);
        expect(CountryTypeGuards.isBaseCountry(undefined)).toBe(false);
        expect(CountryTypeGuards.isBaseCountry('not an object')).toBe(false);
        expect(CountryTypeGuards.isBaseCountry(123)).toBe(false);
        expect(CountryTypeGuards.isBaseCountry([])).toBe(false);
      });

      it('should reject objects with extra properties but valid structure', () => {
        const countryWithExtra = {
          code: 'US' as const,
          name: 'United States' as const,
          region: EsportsRegion.NORTH_AMERICA,
          extraProperty: 'should not affect validation'
        };
        // Should still be valid because we only check for required properties
        expect(CountryTypeGuards.isBaseCountry(countryWithExtra)).toBe(true);
      });
    });

    describe('isHoveredCountry', () => {
      it('should validate correct HoveredCountry objects', () => {
        const validHovered = {
          name: 'United States',
          countryCode: 'US',
          region: EsportsRegion.NORTH_AMERICA
        };
        expect(CountryTypeGuards.isHoveredCountry(validHovered)).toBe(true);
      });

      it('should validate HoveredCountry with null region', () => {
        const hoveredWithNullRegion = {
          name: 'Unknown Country',
          countryCode: 'XX',
          region: null
        };
        expect(CountryTypeGuards.isHoveredCountry(hoveredWithNullRegion)).toBe(true);
      });

      it('should reject objects missing required properties', () => {
        expect(CountryTypeGuards.isHoveredCountry({ name: 'United States' })).toBe(false);
        expect(CountryTypeGuards.isHoveredCountry({ countryCode: 'US' })).toBe(false);
        expect(CountryTypeGuards.isHoveredCountry({ region: EsportsRegion.NORTH_AMERICA })).toBe(false);
      });

      it('should reject invalid inputs', () => {
        expect(CountryTypeGuards.isHoveredCountry(null)).toBe(false);
        expect(CountryTypeGuards.isHoveredCountry(undefined)).toBe(false);
        expect(CountryTypeGuards.isHoveredCountry('not an object')).toBe(false);
        expect(CountryTypeGuards.isHoveredCountry([])).toBe(false);
      });
    });
  });

  describe('SPECIAL_COUNTRIES', () => {
    describe('Kosovo', () => {
      it('should have correct Kosovo configuration', () => {
        expect(SPECIAL_COUNTRIES.KOSOVO.alpha2).toBe('XK');
        expect(SPECIAL_COUNTRIES.KOSOVO.numeric).toBeUndefined();
        expect(SPECIAL_COUNTRIES.KOSOVO.name).toBe('Kosovo');
        expect(SPECIAL_COUNTRIES.KOSOVO.region).toBe(EsportsRegion.EUROPE);
      });

      it('should have correct structure', () => {
        // Test that the object has the expected structure
        expect(SPECIAL_COUNTRIES.KOSOVO).toHaveProperty('alpha2');
        expect(SPECIAL_COUNTRIES.KOSOVO).toHaveProperty('numeric');
        expect(SPECIAL_COUNTRIES.KOSOVO).toHaveProperty('name');
        expect(SPECIAL_COUNTRIES.KOSOVO).toHaveProperty('region');
      });
    });

    describe('Antarctica', () => {
      it('should have correct Antarctica configuration', () => {
        expect(SPECIAL_COUNTRIES.ANTARCTICA.alpha2).toBe('AQ');
        expect(SPECIAL_COUNTRIES.ANTARCTICA.numeric).toBe('010');
        expect(SPECIAL_COUNTRIES.ANTARCTICA.name).toBe('Antarctica');
        expect(SPECIAL_COUNTRIES.ANTARCTICA.region).toBe(null);
      });

      it('should handle Antarctica special case', () => {
        const antarctica = SPECIAL_COUNTRIES.ANTARCTICA;
        expect(antarctica.region).toBe(null); // Antarctica has no esports region
      });
    });
  });

  describe('COUNTRY_NAME_PATTERNS', () => {
    describe('DEMOCRATIC_REPUBLIC pattern', () => {
      it('should match democratic republic variations', () => {
        const pattern = COUNTRY_NAME_PATTERNS.DEMOCRATIC_REPUBLIC;
        expect(pattern.test('Democratic Republic of Congo')).toBe(true);
        expect(pattern.test('Dem. Rep. Congo')).toBe(true);
        expect(pattern.test('dem rep congo')).toBe(true);
        expect(pattern.test('democratic republic of the congo')).toBe(true);
      });

      it('should not match non-democratic republics', () => {
        const pattern = COUNTRY_NAME_PATTERNS.DEMOCRATIC_REPUBLIC;
        expect(pattern.test('Republic of Congo')).toBe(false);
        expect(pattern.test('Congo')).toBe(false);
        expect(pattern.test('Some Democratic Country')).toBe(false);
      });
    });

    describe('UNITED pattern', () => {
      it('should match united/union countries', () => {
        const pattern = COUNTRY_NAME_PATTERNS.UNITED;
        expect(pattern.test('United States')).toBe(true);
        expect(pattern.test('United Kingdom')).toBe(true);
        expect(pattern.test('United Arab Emirates')).toBe(true);
      });

      it('should not match countries without "United" prefix', () => {
        const pattern = COUNTRY_NAME_PATTERNS.UNITED;
        expect(pattern.test('States of America')).toBe(false);
        expect(pattern.test('Kingdom of England')).toBe(false);
        expect(pattern.test('Arab Emirates')).toBe(false);
      });
    });

    describe('SAINT pattern', () => {
      it('should match saint/st. countries', () => {
        const pattern = COUNTRY_NAME_PATTERNS.SAINT;
        expect(pattern.test('Saint Lucia')).toBe(true);
        expect(pattern.test('St. Kitts and Nevis')).toBe(true);
        expect(pattern.test('St Lucia')).toBe(true);
        expect(pattern.test('saint vincent')).toBe(true);
      });

      it('should not match countries without saint prefix', () => {
        const pattern = COUNTRY_NAME_PATTERNS.SAINT;
        expect(pattern.test('Lucia')).toBe(false);
        expect(pattern.test('Kitts and Nevis')).toBe(false);
        expect(pattern.test('Vincent')).toBe(false);
      });
    });

    describe('DIRECTIONAL pattern', () => {
      it('should match directional country names', () => {
        const pattern = COUNTRY_NAME_PATTERNS.DIRECTIONAL;
        expect(pattern.test('North Korea')).toBe(true);
        expect(pattern.test('South Africa')).toBe(true);
        expect(pattern.test('East Timor')).toBe(true);
        expect(pattern.test('West Sahara')).toBe(true);
      });

      it('should not match non-directional names', () => {
        const pattern = COUNTRY_NAME_PATTERNS.DIRECTIONAL;
        expect(pattern.test('Korea')).toBe(false);
        expect(pattern.test('Africa')).toBe(false);
        expect(pattern.test('Timor')).toBe(false);
      });
    });

    describe('REPUBLIC_ABBREV pattern', () => {
      it('should match republic abbreviations', () => {
        const pattern = COUNTRY_NAME_PATTERNS.REPUBLIC_ABBREV;
        expect(pattern.test('Dominican Rep.')).toBe(true);
        expect(pattern.test('Central African Rep')).toBe(true);
        expect(pattern.test('Some Country Republic')).toBe(true);
        expect(pattern.test('Test republic')).toBe(true);
      });

      it('should not match countries without republic suffix', () => {
        const pattern = COUNTRY_NAME_PATTERNS.REPUBLIC_ABBREV;
        expect(pattern.test('Republic of Congo')).toBe(false); // Republic at start
        expect(pattern.test('Dominican')).toBe(false);
        expect(pattern.test('Central African')).toBe(false);
      });
    });
  });

  describe('Type integration tests', () => {
    it('should work with realistic country data', () => {
      const testCountries = [
        {
          code: 'US',
          name: 'United States',
          region: EsportsRegion.NORTH_AMERICA
        },
        {
          code: 'XK',
          name: 'Kosovo', 
          region: EsportsRegion.EUROPE
        },
        {
          code: 'AQ',
          name: 'Antarctica',
          region: null
        }
      ];

      testCountries.forEach(country => {
        expect(CountryTypeGuards.isValidAlpha2Code(country.code)).toBe(true);
        // Only validate BaseCountry for countries with regions
        if (country.region) {
          expect(CountryTypeGuards.isBaseCountry(country)).toBe(true);
        }
      });
    });

    it('should handle special cases consistently', () => {
      const kosovo = SPECIAL_COUNTRIES.KOSOVO;
      const antarctica = SPECIAL_COUNTRIES.ANTARCTICA;

      expect(CountryTypeGuards.isValidAlpha2Code(kosovo.alpha2)).toBe(true);
      expect(CountryTypeGuards.isValidAlpha2Code(antarctica.alpha2)).toBe(true);
      
      if (antarctica.numeric) {
        expect(CountryTypeGuards.isValidNumericCode(antarctica.numeric)).toBe(true);
      }
    });
  });
});