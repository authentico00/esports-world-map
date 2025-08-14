/**
 * Unit tests for flag loading utilities
 * Tests country code mapping, URL generation, and error handling
 */

import { 
  getCountryCodeForFlag, 
  getFlagUrl, 
  createFlagErrorHandler, 
  FLAG_SOURCES 
} from '../flagUtils';

describe('Flag Loading Utils', () => {
  describe('getCountryCodeForFlag', () => {
    describe('Numeric country code mapping', () => {
      it('should map standard numeric codes to alpha-2 codes', () => {
        expect(getCountryCodeForFlag('840', 'United States')).toBe('us');
        expect(getCountryCodeForFlag('826', 'United Kingdom')).toBe('gb');
        expect(getCountryCodeForFlag('276', 'Germany')).toBe('de');
        expect(getCountryCodeForFlag('250', 'France')).toBe('fr');
        expect(getCountryCodeForFlag('392', 'Japan')).toBe('jp');
      });

      it('should handle Central Asian countries', () => {
        expect(getCountryCodeForFlag('398', 'Kazakhstan')).toBe('kz');
        expect(getCountryCodeForFlag('860', 'Uzbekistan')).toBe('uz');
        expect(getCountryCodeForFlag('762', 'Tajikistan')).toBe('tj');
        expect(getCountryCodeForFlag('417', 'Kyrgyzstan')).toBe('kg');
        expect(getCountryCodeForFlag('795', 'Turkmenistan')).toBe('tm');
      });

      it('should handle Southeast Asian countries', () => {
        expect(getCountryCodeForFlag('360', 'Indonesia')).toBe('id');
        expect(getCountryCodeForFlag('458', 'Malaysia')).toBe('my');
        expect(getCountryCodeForFlag('608', 'Philippines')).toBe('ph');
        expect(getCountryCodeForFlag('702', 'Singapore')).toBe('sg');
        expect(getCountryCodeForFlag('764', 'Thailand')).toBe('th');
      });

      it('should handle Pacific and Oceanic countries', () => {
        expect(getCountryCodeForFlag('242', 'Fiji')).toBe('fj');
        expect(getCountryCodeForFlag('598', 'Papua New Guinea')).toBe('pg');
        expect(getCountryCodeForFlag('882', 'Samoa')).toBe('ws');
        expect(getCountryCodeForFlag('090', 'Solomon Islands')).toBe('sb');
        expect(getCountryCodeForFlag('776', 'Tonga')).toBe('to');
      });

      it('should handle Caribbean countries', () => {
        expect(getCountryCodeForFlag('044', 'Bahamas')).toBe('bs');
        expect(getCountryCodeForFlag('052', 'Barbados')).toBe('bb');
        expect(getCountryCodeForFlag('192', 'Cuba')).toBe('cu');
        expect(getCountryCodeForFlag('388', 'Jamaica')).toBe('jm');
        expect(getCountryCodeForFlag('780', 'Trinidad and Tobago')).toBe('tt');
      });
    });

    describe('Country name fallback mapping', () => {
      it('should map standard country names to alpha-2 codes', () => {
        expect(getCountryCodeForFlag('unknown', 'United States')).toBe('us');
        expect(getCountryCodeForFlag('unknown', 'United Kingdom')).toBe('gb');
        expect(getCountryCodeForFlag('unknown', 'South Korea')).toBe('kr');
        expect(getCountryCodeForFlag('unknown', 'South Africa')).toBe('za');
        expect(getCountryCodeForFlag('unknown', 'Czech Republic')).toBe('cz');
      });

      it('should handle alternative country names', () => {
        expect(getCountryCodeForFlag('unknown', 'Dominican Republic')).toBe('do');
        expect(getCountryCodeForFlag('unknown', 'Costa Rica')).toBe('cr');
        expect(getCountryCodeForFlag('unknown', 'Saudi Arabia')).toBe('sa');
        expect(getCountryCodeForFlag('unknown', 'United Arab Emirates')).toBe('ae');
        expect(getCountryCodeForFlag('unknown', 'New Zealand')).toBe('nz');
      });

      it('should handle abbreviated country names', () => {
        expect(getCountryCodeForFlag('unknown', 'W. Sahara')).toBe('eh');
        expect(getCountryCodeForFlag('unknown', 'Dem. Rep. Congo')).toBe('cd');
        expect(getCountryCodeForFlag('unknown', 'Dominican Rep.')).toBe('do');
        expect(getCountryCodeForFlag('unknown', 'Central African Rep.')).toBe('cf');
        expect(getCountryCodeForFlag('unknown', 'Eq. Guinea')).toBe('gq');
      });
    });

    describe('Special case handling', () => {
      it('should handle Kosovo with undefined countryId', () => {
        expect(getCountryCodeForFlag(undefined, 'Kosovo')).toBe('xk');
        expect(getCountryCodeForFlag('undefined', 'Kosovo')).toBe('xk');
        expect(getCountryCodeForFlag('', 'Kosovo')).toBe('xk');
      });

      it('should handle Kosovo with different case variations', () => {
        expect(getCountryCodeForFlag(undefined, 'kosovo')).toBe('xk');
        expect(getCountryCodeForFlag(undefined, 'KOSOVO')).toBe('xk');
        expect(getCountryCodeForFlag(undefined, 'Kosovo')).toBe('xk');
      });

      it('should handle Kosovo with XK country codes', () => {
        expect(getCountryCodeForFlag('xk', 'Kosovo')).toBe('xk');
        expect(getCountryCodeForFlag('XK', 'Kosovo')).toBe('xk');
        expect(getCountryCodeForFlag('xk', 'Any Name')).toBe('xk');
      });

      it('should handle Antarctica special case', () => {
        expect(getCountryCodeForFlag('010', 'Antarctica')).toBe('aq');
        expect(getCountryCodeForFlag('unknown', 'Antarctica')).toBe('aq');
        expect(getCountryCodeForFlag('unknown', 'antarctica')).toBe('aq');
      });

      it('should handle Northern Cyprus and Somaliland', () => {
        expect(getCountryCodeForFlag('unknown', 'N. Cyprus')).toBe('cy');
        expect(getCountryCodeForFlag('unknown', 'Northern Cyprus')).toBe('cy');
        expect(getCountryCodeForFlag('unknown', 'Somaliland')).toBe('so');
      });
    });

    describe('Partial name matching', () => {
      it('should handle Democratic Republic variations', () => {
        expect(getCountryCodeForFlag('unknown', 'Democratic Republic of Congo')).toBe('cd');
        expect(getCountryCodeForFlag('unknown', 'Dem. Rep. Congo')).toBe('cd');
      });

      it('should handle Korea variations', () => {
        expect(getCountryCodeForFlag('unknown', 'South Korea Official Name')).toBe('kr');
        expect(getCountryCodeForFlag('unknown', 'North Korea Official Name')).toBe('kp');
      });

      it('should handle Guinea variations', () => {
        expect(getCountryCodeForFlag('unknown', 'Equatorial Guinea')).toBe('gq');
        expect(getCountryCodeForFlag('unknown', 'Guinea-Bissau')).toBe('gw');
        expect(getCountryCodeForFlag('unknown', 'Papua New Guinea')).toBe('pg'); // Should not match Guinea
      });

      it('should handle Sahara and Timor variations', () => {
        expect(getCountryCodeForFlag('unknown', 'Western Sahara')).toBe('eh');
        expect(getCountryCodeForFlag('unknown', 'East Timor')).toBe('tl');
        expect(getCountryCodeForFlag('unknown', 'Timor-Leste')).toBe('tl');
      });
    });

    describe('Fallback behavior', () => {
      it('should return fallback for unknown country codes and names', () => {
        const result = getCountryCodeForFlag('999', 'Unknown Country');
        expect(result).toBe('99'); // First two chars of unknown code
      });

      it('should return fallback for completely unknown inputs', () => {
        const result = getCountryCodeForFlag('abc', 'Fictional Country');
        expect(result).toBe('ab');
      });

      it('should handle undefined countryId gracefully', () => {
        const result = getCountryCodeForFlag(undefined, 'Unknown Country');
        expect(result).toBe('unknown');
      });

      it('should handle empty inputs gracefully', () => {
        const result = getCountryCodeForFlag('', '');
        expect(result).toBe('unknown');
      });
    });
  });

  describe('getFlagUrl', () => {
    it('should generate primary flag URLs correctly', () => {
      const url = getFlagUrl('840', 'United States');
      expect(url).toBe('https://flagcdn.com/w40/us.png');
    });

    it('should generate secondary flag URLs', () => {
      const url = getFlagUrl('826', 'United Kingdom', 'secondary');
      expect(url).toBe('https://flagpedia.net/data/flags/mini/gb.png');
    });

    it('should generate tertiary flag URLs with uppercase codes', () => {
      const url = getFlagUrl('276', 'Germany', 'tertiary');
      expect(url).toBe('https://flagsapi.com/DE/flat/32.png');
    });

    it('should generate quaternary SVG flag URLs', () => {
      const url = getFlagUrl('392', 'Japan', 'quaternary');
      expect(url).toBe('https://flagicons.lipis.dev/flags/4x3/jp.svg');
    });

    it('should handle Kosovo URLs correctly', () => {
      const primaryUrl = getFlagUrl(undefined, 'Kosovo');
      expect(primaryUrl).toBe('https://flagcdn.com/w40/xk.png');
      
      const tertiaryUrl = getFlagUrl(undefined, 'Kosovo', 'tertiary');
      expect(tertiaryUrl).toBe('https://flagsapi.com/XK/flat/32.png');
    });

    it('should handle alpha-2 codes as input', () => {
      const url = getFlagUrl('us', 'United States');
      expect(url).toBe('https://flagcdn.com/w40/us.png');
    });
  });

  describe('createFlagErrorHandler', () => {
    // Mock DOM elements and methods
    const createMockImage = (initialSrc: string) => {
      const img = {
        src: initialSrc,
        style: { display: 'block' },
        parentElement: {
          innerHTML: '<img>'
        }
      };
      return img as unknown as HTMLImageElement;
    };

    const createMockEvent = (img: HTMLImageElement) => ({
      target: img,
      currentTarget: img
    } as React.SyntheticEvent<HTMLImageElement>);

    it('should create error handler function', () => {
      const handler = createFlagErrorHandler('840', 'United States');
      expect(typeof handler).toBe('function');
    });

    it('should fallback from primary to secondary source', () => {
      const img = createMockImage('https://flagcdn.com/w40/us.png');
      const event = createMockEvent(img);
      const handler = createFlagErrorHandler('840', 'United States');
      
      handler(event);
      expect(img.src).toBe('https://flagpedia.net/data/flags/mini/us.png');
    });

    it('should fallback from secondary to tertiary source', () => {
      const img = createMockImage('https://flagpedia.net/data/flags/mini/us.png');
      const event = createMockEvent(img);
      const handler = createFlagErrorHandler('840', 'United States');
      
      handler(event);
      expect(img.src).toBe('https://flagsapi.com/US/flat/32.png');
    });

    it('should fallback from tertiary to quaternary source', () => {
      const img = createMockImage('https://flagsapi.com/US/flat/32.png');
      const event = createMockEvent(img);
      const handler = createFlagErrorHandler('840', 'United States');
      
      handler(event);
      expect(img.src).toBe('https://flagicons.lipis.dev/flags/4x3/us.svg');
    });

    it('should handle Antarctica special case on final fallback', () => {
      const mockParent = { innerHTML: '<img>' };
      const img = createMockImage('https://flagicons.lipis.dev/flags/4x3/aq.svg');
      img.parentElement = mockParent as any;
      const event = createMockEvent(img);
      const handler = createFlagErrorHandler('010', 'Antarctica');
      
      handler(event);
      expect(img.style.display).toBe('none');
      expect(mockParent.innerHTML).toContain('❄️');
    });

    it('should hide image on final fallback for regular countries', () => {
      const img = createMockImage('https://flagicons.lipis.dev/flags/4x3/us.svg');
      const event = createMockEvent(img);
      const handler = createFlagErrorHandler('840', 'United States');
      
      handler(event);
      expect(img.style.display).toBe('none');
    });

    it('should work with Kosovo undefined ID', () => {
      const img = createMockImage('https://flagcdn.com/w40/xk.png');
      const event = createMockEvent(img);
      const handler = createFlagErrorHandler(undefined, 'Kosovo');
      
      handler(event);
      expect(img.src).toBe('https://flagpedia.net/data/flags/mini/xk.png');
    });
  });

  describe('FLAG_SOURCES constant', () => {
    it('should contain all expected flag sources', () => {
      expect(FLAG_SOURCES.primary).toBe('https://flagcdn.com/w40/{code}.png');
      expect(FLAG_SOURCES.secondary).toBe('https://flagpedia.net/data/flags/mini/{code}.png');
      expect(FLAG_SOURCES.tertiary).toBe('https://flagsapi.com/{CODE}/flat/32.png');
      expect(FLAG_SOURCES.quaternary).toBe('https://flagicons.lipis.dev/flags/4x3/{code}.svg');
    });

    it('should have correct placeholder patterns', () => {
      expect(FLAG_SOURCES.primary).toContain('{code}');
      expect(FLAG_SOURCES.secondary).toContain('{code}');
      expect(FLAG_SOURCES.tertiary).toContain('{CODE}');
      expect(FLAG_SOURCES.quaternary).toContain('{code}');
    });
  });

  describe('Integration tests', () => {
    it('should work end-to-end for common countries', () => {
      const countries = [
        { id: '840', name: 'United States', expected: 'us' },
        { id: '826', name: 'United Kingdom', expected: 'gb' },
        { id: '276', name: 'Germany', expected: 'de' },
        { id: '392', name: 'Japan', expected: 'jp' },
        { id: undefined, name: 'Kosovo', expected: 'xk' }
      ];

      countries.forEach(({ id, name, expected }) => {
        const code = getCountryCodeForFlag(id, name);
        const url = getFlagUrl(id, name);
        const handler = createFlagErrorHandler(id, name);

        expect(code).toBe(expected);
        expect(url).toContain(expected);
        expect(typeof handler).toBe('function');
      });
    });

    it('should handle edge cases consistently', () => {
      const edgeCases = [
        { id: '010', name: 'Antarctica', expected: 'aq' },
        { id: 'unknown', name: 'Dem. Rep. Congo', expected: 'cd' },
        { id: '', name: 'N. Cyprus', expected: 'cy' },
        { id: undefined, name: 'Western Sahara', expected: 'eh' }
      ];

      edgeCases.forEach(({ id, name, expected }) => {
        const code = getCountryCodeForFlag(id, name);
        expect(code).toBe(expected);
      });
    });
  });
});