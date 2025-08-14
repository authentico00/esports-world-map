'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { EsportsRegion } from '@/types/esports';
import { COUNTRY_REGIONS } from '@/data/countries';
import type { CountrySearchOption, Alpha2CountryCode, CountryName } from '@/types/country';

interface CountrySearchProps {
  onCountrySelect: (countryCode: Alpha2CountryCode, countryName: CountryName) => void;
  className?: string;
}

// Using the new CountrySearchOption type
type CountryOption = CountrySearchOption;

export default function CountrySearch({ onCountrySelect, className = '' }: CountrySearchProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Country list with names
  const countries = useMemo(() => {
    const countryList: CountryOption[] = [
      // Major esports countries first
      { code: 'US', name: 'United States', region: EsportsRegion.NORTH_AMERICA },
      { code: 'CA', name: 'Canada', region: EsportsRegion.NORTH_AMERICA },
      { code: 'DE', name: 'Germany', region: EsportsRegion.EUROPE },
      { code: 'FR', name: 'France', region: EsportsRegion.EUROPE },
      { code: 'GB', name: 'United Kingdom', region: EsportsRegion.EUROPE },
      { code: 'KR', name: 'South Korea', region: EsportsRegion.ASIA },
      { code: 'JP', name: 'Japan', region: EsportsRegion.ASIA },
      { code: 'CN', name: 'China', region: EsportsRegion.ASIA },
      { code: 'BR', name: 'Brazil', region: EsportsRegion.SOUTH_AMERICA },
      { code: 'AU', name: 'Australia', region: EsportsRegion.OCEANIA },
      
      // All other countries alphabetically
      { code: 'AF', name: 'Afghanistan', region: EsportsRegion.ASIA },
      { code: 'AL', name: 'Albania', region: EsportsRegion.EUROPE },
      { code: 'DZ', name: 'Algeria', region: EsportsRegion.MENA },
      { code: 'AD', name: 'Andorra', region: EsportsRegion.EUROPE },
      { code: 'AO', name: 'Angola', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'AR', name: 'Argentina', region: EsportsRegion.SOUTH_AMERICA },
      { code: 'AM', name: 'Armenia', region: EsportsRegion.EUROPE },
      { code: 'AT', name: 'Austria', region: EsportsRegion.EUROPE },
      { code: 'AZ', name: 'Azerbaijan', region: EsportsRegion.EUROPE },
      { code: 'BH', name: 'Bahrain', region: EsportsRegion.MENA },
      { code: 'BD', name: 'Bangladesh', region: EsportsRegion.ASIA },
      { code: 'BY', name: 'Belarus', region: EsportsRegion.EUROPE },
      { code: 'BE', name: 'Belgium', region: EsportsRegion.EUROPE },
      { code: 'BZ', name: 'Belize', region: EsportsRegion.NORTH_AMERICA },
      { code: 'BJ', name: 'Benin', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'BT', name: 'Bhutan', region: EsportsRegion.ASIA },
      { code: 'BO', name: 'Bolivia', region: EsportsRegion.SOUTH_AMERICA },
      { code: 'BA', name: 'Bosnia and Herzegovina', region: EsportsRegion.EUROPE },
      { code: 'BW', name: 'Botswana', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'BN', name: 'Brunei', region: EsportsRegion.ASIA },
      { code: 'BG', name: 'Bulgaria', region: EsportsRegion.EUROPE },
      { code: 'BF', name: 'Burkina Faso', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'BI', name: 'Burundi', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'KH', name: 'Cambodia', region: EsportsRegion.ASIA },
      { code: 'CM', name: 'Cameroon', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'CV', name: 'Cape Verde', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'CF', name: 'Central African Republic', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'TD', name: 'Chad', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'CL', name: 'Chile', region: EsportsRegion.SOUTH_AMERICA },
      { code: 'CO', name: 'Colombia', region: EsportsRegion.SOUTH_AMERICA },
      { code: 'KM', name: 'Comoros', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'CG', name: 'Congo', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'CD', name: 'Democratic Republic of Congo', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'CR', name: 'Costa Rica', region: EsportsRegion.NORTH_AMERICA },
      { code: 'CI', name: 'Ivory Coast', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'HR', name: 'Croatia', region: EsportsRegion.EUROPE },
      { code: 'CU', name: 'Cuba', region: EsportsRegion.NORTH_AMERICA },
      { code: 'CY', name: 'Cyprus', region: EsportsRegion.EUROPE },
      { code: 'CZ', name: 'Czech Republic', region: EsportsRegion.EUROPE },
      { code: 'DK', name: 'Denmark', region: EsportsRegion.EUROPE },
      { code: 'DJ', name: 'Djibouti', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'DO', name: 'Dominican Republic', region: EsportsRegion.NORTH_AMERICA },
      { code: 'EC', name: 'Ecuador', region: EsportsRegion.SOUTH_AMERICA },
      { code: 'EG', name: 'Egypt', region: EsportsRegion.MENA },
      { code: 'SV', name: 'El Salvador', region: EsportsRegion.NORTH_AMERICA },
      { code: 'GQ', name: 'Equatorial Guinea', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'ER', name: 'Eritrea', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'EE', name: 'Estonia', region: EsportsRegion.EUROPE },
      { code: 'ET', name: 'Ethiopia', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'FJ', name: 'Fiji', region: EsportsRegion.OCEANIA },
      { code: 'FI', name: 'Finland', region: EsportsRegion.EUROPE },
      { code: 'GA', name: 'Gabon', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'GM', name: 'Gambia', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'GE', name: 'Georgia', region: EsportsRegion.EUROPE },
      { code: 'GH', name: 'Ghana', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'GR', name: 'Greece', region: EsportsRegion.EUROPE },
      { code: 'GT', name: 'Guatemala', region: EsportsRegion.NORTH_AMERICA },
      { code: 'GN', name: 'Guinea', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'GW', name: 'Guinea-Bissau', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'GY', name: 'Guyana', region: EsportsRegion.SOUTH_AMERICA },
      { code: 'HT', name: 'Haiti', region: EsportsRegion.NORTH_AMERICA },
      { code: 'HN', name: 'Honduras', region: EsportsRegion.NORTH_AMERICA },
      { code: 'HU', name: 'Hungary', region: EsportsRegion.EUROPE },
      { code: 'IS', name: 'Iceland', region: EsportsRegion.EUROPE },
      { code: 'IN', name: 'India', region: EsportsRegion.ASIA },
      { code: 'ID', name: 'Indonesia', region: EsportsRegion.ASIA },
      { code: 'IR', name: 'Iran', region: EsportsRegion.MENA },
      { code: 'IQ', name: 'Iraq', region: EsportsRegion.MENA },
      { code: 'IE', name: 'Ireland', region: EsportsRegion.EUROPE },
      { code: 'IL', name: 'Israel', region: EsportsRegion.MENA },
      { code: 'IT', name: 'Italy', region: EsportsRegion.EUROPE },
      { code: 'JM', name: 'Jamaica', region: EsportsRegion.NORTH_AMERICA },
      { code: 'JO', name: 'Jordan', region: EsportsRegion.MENA },
      { code: 'KZ', name: 'Kazakhstan', region: EsportsRegion.ASIA },
      { code: 'KE', name: 'Kenya', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'KI', name: 'Kiribati', region: EsportsRegion.OCEANIA },
      { code: 'XK', name: 'Kosovo', region: EsportsRegion.EUROPE },
      { code: 'KW', name: 'Kuwait', region: EsportsRegion.MENA },
      { code: 'KG', name: 'Kyrgyzstan', region: EsportsRegion.ASIA },
      { code: 'LA', name: 'Laos', region: EsportsRegion.ASIA },
      { code: 'LV', name: 'Latvia', region: EsportsRegion.EUROPE },
      { code: 'LB', name: 'Lebanon', region: EsportsRegion.MENA },
      { code: 'LS', name: 'Lesotho', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'LR', name: 'Liberia', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'LY', name: 'Libya', region: EsportsRegion.MENA },
      { code: 'LI', name: 'Liechtenstein', region: EsportsRegion.EUROPE },
      { code: 'LT', name: 'Lithuania', region: EsportsRegion.EUROPE },
      { code: 'LU', name: 'Luxembourg', region: EsportsRegion.EUROPE },
      { code: 'MG', name: 'Madagascar', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'MW', name: 'Malawi', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'MY', name: 'Malaysia', region: EsportsRegion.ASIA },
      { code: 'MV', name: 'Maldives', region: EsportsRegion.ASIA },
      { code: 'ML', name: 'Mali', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'MT', name: 'Malta', region: EsportsRegion.EUROPE },
      { code: 'MH', name: 'Marshall Islands', region: EsportsRegion.OCEANIA },
      { code: 'MR', name: 'Mauritania', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'MU', name: 'Mauritius', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'MX', name: 'Mexico', region: EsportsRegion.NORTH_AMERICA },
      { code: 'FM', name: 'Micronesia', region: EsportsRegion.OCEANIA },
      { code: 'MD', name: 'Moldova', region: EsportsRegion.EUROPE },
      { code: 'MC', name: 'Monaco', region: EsportsRegion.EUROPE },
      { code: 'MN', name: 'Mongolia', region: EsportsRegion.ASIA },
      { code: 'ME', name: 'Montenegro', region: EsportsRegion.EUROPE },
      { code: 'MA', name: 'Morocco', region: EsportsRegion.MENA },
      { code: 'MZ', name: 'Mozambique', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'MM', name: 'Myanmar', region: EsportsRegion.ASIA },
      { code: 'NA', name: 'Namibia', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'NR', name: 'Nauru', region: EsportsRegion.OCEANIA },
      { code: 'NP', name: 'Nepal', region: EsportsRegion.ASIA },
      { code: 'NL', name: 'Netherlands', region: EsportsRegion.EUROPE },
      { code: 'NZ', name: 'New Zealand', region: EsportsRegion.OCEANIA },
      { code: 'NI', name: 'Nicaragua', region: EsportsRegion.NORTH_AMERICA },
      { code: 'NE', name: 'Niger', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'NG', name: 'Nigeria', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'KP', name: 'North Korea', region: EsportsRegion.ASIA },
      { code: 'MK', name: 'North Macedonia', region: EsportsRegion.EUROPE },
      { code: 'NO', name: 'Norway', region: EsportsRegion.EUROPE },
      { code: 'OM', name: 'Oman', region: EsportsRegion.MENA },
      { code: 'PK', name: 'Pakistan', region: EsportsRegion.ASIA },
      { code: 'PW', name: 'Palau', region: EsportsRegion.OCEANIA },
      { code: 'PA', name: 'Panama', region: EsportsRegion.NORTH_AMERICA },
      { code: 'PG', name: 'Papua New Guinea', region: EsportsRegion.OCEANIA },
      { code: 'PY', name: 'Paraguay', region: EsportsRegion.SOUTH_AMERICA },
      { code: 'PE', name: 'Peru', region: EsportsRegion.SOUTH_AMERICA },
      { code: 'PH', name: 'Philippines', region: EsportsRegion.ASIA },
      { code: 'PL', name: 'Poland', region: EsportsRegion.EUROPE },
      { code: 'PT', name: 'Portugal', region: EsportsRegion.EUROPE },
      { code: 'QA', name: 'Qatar', region: EsportsRegion.MENA },
      { code: 'RO', name: 'Romania', region: EsportsRegion.EUROPE },
      { code: 'RU', name: 'Russia', region: EsportsRegion.EUROPE },
      { code: 'RW', name: 'Rwanda', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'WS', name: 'Samoa', region: EsportsRegion.OCEANIA },
      { code: 'SM', name: 'San Marino', region: EsportsRegion.EUROPE },
      { code: 'SA', name: 'Saudi Arabia', region: EsportsRegion.MENA },
      { code: 'SN', name: 'Senegal', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'RS', name: 'Serbia', region: EsportsRegion.EUROPE },
      { code: 'SC', name: 'Seychelles', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'SL', name: 'Sierra Leone', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'SG', name: 'Singapore', region: EsportsRegion.ASIA },
      { code: 'SK', name: 'Slovakia', region: EsportsRegion.EUROPE },
      { code: 'SI', name: 'Slovenia', region: EsportsRegion.EUROPE },
      { code: 'SB', name: 'Solomon Islands', region: EsportsRegion.OCEANIA },
      { code: 'SO', name: 'Somalia', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'ZA', name: 'South Africa', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'SS', name: 'South Sudan', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'ES', name: 'Spain', region: EsportsRegion.EUROPE },
      { code: 'LK', name: 'Sri Lanka', region: EsportsRegion.ASIA },
      { code: 'SD', name: 'Sudan', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'SR', name: 'Suriname', region: EsportsRegion.SOUTH_AMERICA },
      { code: 'SE', name: 'Sweden', region: EsportsRegion.EUROPE },
      { code: 'CH', name: 'Switzerland', region: EsportsRegion.EUROPE },
      { code: 'SY', name: 'Syria', region: EsportsRegion.MENA },
      { code: 'TW', name: 'Taiwan', region: EsportsRegion.ASIA },
      { code: 'TJ', name: 'Tajikistan', region: EsportsRegion.ASIA },
      { code: 'TZ', name: 'Tanzania', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'TH', name: 'Thailand', region: EsportsRegion.ASIA },
      { code: 'TL', name: 'Timor-Leste', region: EsportsRegion.ASIA },
      { code: 'TG', name: 'Togo', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'TO', name: 'Tonga', region: EsportsRegion.OCEANIA },
      { code: 'TT', name: 'Trinidad and Tobago', region: EsportsRegion.NORTH_AMERICA },
      { code: 'TN', name: 'Tunisia', region: EsportsRegion.MENA },
      { code: 'TR', name: 'Turkey', region: EsportsRegion.EUROPE },
      { code: 'TM', name: 'Turkmenistan', region: EsportsRegion.ASIA },
      { code: 'TV', name: 'Tuvalu', region: EsportsRegion.OCEANIA },
      { code: 'UG', name: 'Uganda', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'UA', name: 'Ukraine', region: EsportsRegion.EUROPE },
      { code: 'AE', name: 'United Arab Emirates', region: EsportsRegion.MENA },
      { code: 'UY', name: 'Uruguay', region: EsportsRegion.SOUTH_AMERICA },
      { code: 'UZ', name: 'Uzbekistan', region: EsportsRegion.ASIA },
      { code: 'VU', name: 'Vanuatu', region: EsportsRegion.OCEANIA },
      { code: 'VE', name: 'Venezuela', region: EsportsRegion.SOUTH_AMERICA },
      { code: 'VN', name: 'Vietnam', region: EsportsRegion.ASIA },
      { code: 'YE', name: 'Yemen', region: EsportsRegion.MENA },
      { code: 'ZM', name: 'Zambia', region: EsportsRegion.AFRICA_NON_MENA },
      { code: 'ZW', name: 'Zimbabwe', region: EsportsRegion.AFRICA_NON_MENA },
    ];

    return countryList;
  }, []);

  // Filter countries based on search term
  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return countries
      .filter(country => 
        country.name.toLowerCase().includes(term) ||
        country.code.toLowerCase().includes(term)
      )
      .slice(0, 8); // Limit to 8 results for performance
  }, [searchTerm, countries]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredCountries.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCountries.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredCountries.length) {
          const country = filteredCountries[highlightedIndex];
          handleSelectCountry(country);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectCountry = (country: CountryOption) => {
    onCountrySelect(country.code, country.name);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(value.trim().length > 0);
    setHighlightedIndex(-1);
  };

  const getRegionBadgeColor = (region: EsportsRegion) => {
    const colors = {
      [EsportsRegion.NORTH_AMERICA]: theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800',
      [EsportsRegion.SOUTH_AMERICA]: theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800',
      [EsportsRegion.EUROPE]: theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-800',
      [EsportsRegion.ASIA]: theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800',
      [EsportsRegion.OCEANIA]: theme === 'dark' ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-100 text-teal-800',
      [EsportsRegion.AFRICA_NON_MENA]: theme === 'dark' ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-800',
      [EsportsRegion.MENA]: theme === 'dark' ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      [EsportsRegion.AMERICAS]: theme === 'dark' ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-800',
      [EsportsRegion.ASIA_PACIFIC]: theme === 'dark' ? 'bg-pink-900/30 text-pink-300' : 'bg-pink-100 text-pink-800',
      [EsportsRegion.ANTARCTICA]: theme === 'dark' ? 'bg-gray-900/30 text-gray-300' : 'bg-gray-100 text-gray-800'
    };
    return colors[region] || (theme === 'dark' ? 'bg-gray-900/30 text-gray-300' : 'bg-gray-100 text-gray-800');
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.trim().length > 0 && setIsOpen(true)}
          placeholder="Search countries..."
          className={`w-full px-4 py-2 pl-10 rounded-lg border transition-all duration-200 font-sans font-medium shadow-sm ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-gray-800 to-gray-850/90 border-gray-600/80 text-gray-200 placeholder-gray-400 focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/20 focus:shadow-lg focus:shadow-blue-500/10'
              : 'bg-gradient-to-br from-white to-gray-50/60 border-gray-300/80 text-gray-900 placeholder-gray-500 focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/20 focus:shadow-lg focus:shadow-blue-500/10'
          }`}
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && filteredCountries.length > 0 && (
        <div className={`absolute z-50 w-full mt-1 rounded-lg border shadow-lg max-h-80 overflow-y-auto ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-600'
            : 'bg-white border-gray-300'
        }`}>
          {filteredCountries.map((country, index) => (
            <button
              key={country.code}
              onClick={() => handleSelectCountry(country)}
              className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-opacity-50 transition-colors ${
                index === highlightedIndex
                  ? theme === 'dark'
                    ? 'bg-gray-700'
                    : 'bg-gray-100'
                  : ''
              } ${
                theme === 'dark'
                  ? 'text-gray-200 hover:bg-gray-700'
                  : 'text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-sm font-sans font-medium">
                  {country.name}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getRegionBadgeColor(country.region)}`}>
                  {country.region.replace('_', ' ')}
                </span>
                <span className={`text-xs font-mono ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {country.code}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}