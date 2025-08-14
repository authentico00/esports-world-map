/**
 * Centralized country mapping utilities
 * Provides comprehensive, maintainable country code mappings and utilities
 */

import type { Alpha2CountryCode, NumericCountryCode, CountryName } from '@/types/country';

// ISO 3166-1 numeric to alpha-2 country code mappings
export const NUMERIC_TO_ALPHA2: Record<string, Alpha2CountryCode> = {
  // Major Countries
  '840': 'US', // United States
  '124': 'CA', // Canada
  '484': 'MX', // Mexico
  '276': 'DE', // Germany
  '250': 'FR', // France
  '826': 'GB', // United Kingdom
  '724': 'ES', // Spain
  '380': 'IT', // Italy
  '156': 'CN', // China
  '392': 'JP', // Japan
  '410': 'KR', // South Korea
  '356': 'IN', // India
  '036': 'AU', // Australia
  '076': 'BR', // Brazil
  '032': 'AR', // Argentina
  '643': 'RU', // Russia
  '792': 'TR', // Turkey
  '710': 'ZA', // South Africa
  '818': 'EG', // Egypt

  // Europe
  '004': 'AF', // Afghanistan
  '008': 'AL', // Albania
  '012': 'DZ', // Algeria
  '020': 'AD', // Andorra
  '024': 'AO', // Angola
  '028': 'AG', // Antigua and Barbuda
  '031': 'AZ', // Azerbaijan
  '040': 'AT', // Austria
  '044': 'BS', // Bahamas
  '048': 'BH', // Bahrain
  '050': 'BD', // Bangladesh
  '051': 'AM', // Armenia
  '052': 'BB', // Barbados
  '056': 'BE', // Belgium
  '060': 'BM', // Bermuda
  '064': 'BT', // Bhutan
  '068': 'BO', // Bolivia
  '070': 'BA', // Bosnia and Herzegovina
  '072': 'BW', // Botswana
  '084': 'BZ', // Belize
  '090': 'SB', // Solomon Islands
  '096': 'BN', // Brunei
  '100': 'BG', // Bulgaria
  '104': 'MM', // Myanmar
  '108': 'BI', // Burundi
  '112': 'BY', // Belarus
  '116': 'KH', // Cambodia
  '120': 'CM', // Cameroon
  '132': 'CV', // Cape Verde
  '136': 'KY', // Cayman Islands
  '140': 'CF', // Central African Republic
  '144': 'LK', // Sri Lanka
  '148': 'TD', // Chad
  '152': 'CL', // Chile
  '158': 'TW', // Taiwan
  '170': 'CO', // Colombia
  '174': 'KM', // Comoros
  '175': 'YT', // Mayotte
  '178': 'CG', // Congo
  '180': 'CD', // Democratic Republic of the Congo
  '184': 'CK', // Cook Islands
  '188': 'CR', // Costa Rica
  '191': 'HR', // Croatia
  '192': 'CU', // Cuba
  '196': 'CY', // Cyprus
  '203': 'CZ', // Czech Republic
  '204': 'BJ', // Benin
  '208': 'DK', // Denmark
  '212': 'DM', // Dominica
  '214': 'DO', // Dominican Republic
  '218': 'EC', // Ecuador
  '222': 'SV', // El Salvador
  '226': 'GQ', // Equatorial Guinea
  '231': 'ET', // Ethiopia
  '232': 'ER', // Eritrea
  '233': 'EE', // Estonia
  '234': 'FO', // Faroe Islands
  '238': 'FK', // Falkland Islands
  '242': 'FJ', // Fiji
  '246': 'FI', // Finland
  '254': 'GF', // French Guiana
  '258': 'PF', // French Polynesia
  '260': 'TF', // French Southern Territories
  '262': 'DJ', // Djibouti
  '266': 'GA', // Gabon
  '268': 'GE', // Georgia
  '270': 'GM', // Gambia
  '275': 'PS', // Palestine
  '288': 'GH', // Ghana
  '292': 'GI', // Gibraltar
  '296': 'KI', // Kiribati
  '300': 'GR', // Greece
  '304': 'GL', // Greenland
  '308': 'GD', // Grenada
  '312': 'GP', // Guadeloupe
  '316': 'GU', // Guam
  '320': 'GT', // Guatemala
  '324': 'GN', // Guinea
  '328': 'GY', // Guyana
  '332': 'HT', // Haiti
  '334': 'HM', // Heard Island and McDonald Islands
  '336': 'VA', // Vatican City
  '340': 'HN', // Honduras
  '344': 'HK', // Hong Kong
  '348': 'HU', // Hungary
  '352': 'IS', // Iceland
  '360': 'ID', // Indonesia
  '364': 'IR', // Iran
  '368': 'IQ', // Iraq
  '372': 'IE', // Ireland
  '376': 'IL', // Israel
  '384': 'CI', // Ivory Coast
  '388': 'JM', // Jamaica
  '398': 'KZ', // Kazakhstan
  '400': 'JO', // Jordan
  '404': 'KE', // Kenya
  '408': 'KP', // North Korea
  '414': 'KW', // Kuwait
  '417': 'KG', // Kyrgyzstan
  '418': 'LA', // Laos
  '422': 'LB', // Lebanon
  '426': 'LS', // Lesotho
  '428': 'LV', // Latvia
  '430': 'LR', // Liberia
  '434': 'LY', // Libya
  '438': 'LI', // Liechtenstein
  '440': 'LT', // Lithuania
  '442': 'LU', // Luxembourg
  '446': 'MO', // Macao
  '450': 'MG', // Madagascar
  '454': 'MW', // Malawi
  '458': 'MY', // Malaysia
  '462': 'MV', // Maldives
  '466': 'ML', // Mali
  '470': 'MT', // Malta
  '474': 'MQ', // Martinique
  '478': 'MR', // Mauritania
  '480': 'MU', // Mauritius
  '492': 'MC', // Monaco
  '496': 'MN', // Mongolia
  '498': 'MD', // Moldova
  '499': 'ME', // Montenegro
  '500': 'MS', // Montserrat
  '504': 'MA', // Morocco
  '508': 'MZ', // Mozambique
  '512': 'OM', // Oman
  '516': 'NA', // Namibia
  '520': 'NR', // Nauru
  '524': 'NP', // Nepal
  '528': 'NL', // Netherlands
  '540': 'NC', // New Caledonia
  '548': 'VU', // Vanuatu
  '554': 'NZ', // New Zealand
  '558': 'NI', // Nicaragua
  '562': 'NE', // Niger
  '566': 'NG', // Nigeria
  '570': 'NU', // Niue
  '574': 'NF', // Norfolk Island
  '578': 'NO', // Norway
  '580': 'MP', // Northern Mariana Islands
  '583': 'FM', // Micronesia
  '584': 'MH', // Marshall Islands
  '585': 'PW', // Palau
  '586': 'PK', // Pakistan
  '591': 'PA', // Panama
  '598': 'PG', // Papua New Guinea
  '600': 'PY', // Paraguay
  '604': 'PE', // Peru
  '608': 'PH', // Philippines
  '612': 'PN', // Pitcairn
  '616': 'PL', // Poland
  '620': 'PT', // Portugal
  '624': 'GW', // Guinea-Bissau
  '626': 'TL', // Timor-Leste
  '630': 'PR', // Puerto Rico
  '634': 'QA', // Qatar
  '638': 'RE', // Reunion
  '642': 'RO', // Romania
  '646': 'RW', // Rwanda
  '652': 'BL', // Saint Barthelemy
  '654': 'SH', // Saint Helena
  '659': 'KN', // Saint Kitts and Nevis
  '660': 'AI', // Anguilla
  '662': 'LC', // Saint Lucia
  '663': 'MF', // Saint Martin
  '666': 'PM', // Saint Pierre and Miquelon
  '670': 'VC', // Saint Vincent and the Grenadines
  '674': 'SM', // San Marino
  '678': 'ST', // Sao Tome and Principe
  '682': 'SA', // Saudi Arabia
  '686': 'SN', // Senegal
  '688': 'RS', // Serbia
  '690': 'SC', // Seychelles
  '694': 'SL', // Sierra Leone
  '702': 'SG', // Singapore
  '703': 'SK', // Slovakia
  '704': 'VN', // Vietnam
  '705': 'SI', // Slovenia
  '706': 'SO', // Somalia
  '716': 'ZW', // Zimbabwe
  '728': 'SS', // South Sudan
  '729': 'SD', // Sudan
  '732': 'EH', // Western Sahara
  '740': 'SR', // Suriname
  '744': 'SJ', // Svalbard and Jan Mayen
  '748': 'SZ', // Eswatini
  '752': 'SE', // Sweden
  '756': 'CH', // Switzerland
  '760': 'SY', // Syria
  '762': 'TJ', // Tajikistan
  '764': 'TH', // Thailand
  '768': 'TG', // Togo
  '772': 'TK', // Tokelau
  '776': 'TO', // Tonga
  '780': 'TT', // Trinidad and Tobago
  '784': 'AE', // United Arab Emirates
  '788': 'TN', // Tunisia
  '795': 'TM', // Turkmenistan
  '796': 'TC', // Turks and Caicos Islands
  '798': 'TV', // Tuvalu
  '800': 'UG', // Uganda
  '804': 'UA', // Ukraine
  '807': 'MK', // North Macedonia
  '834': 'TZ', // Tanzania
  '850': 'VI', // US Virgin Islands
  '854': 'BF', // Burkina Faso
  '858': 'UY', // Uruguay
  '860': 'UZ', // Uzbekistan
  '862': 'VE', // Venezuela
  '876': 'WF', // Wallis and Futuna
  '882': 'WS', // Samoa
  '887': 'YE', // Yemen
  '894': 'ZM', // Zambia

  // Special Cases
  '010': 'AQ', // Antarctica
  'xk': 'XK',  // Kosovo (user-assigned)
  'XK': 'XK',  // Kosovo (user-assigned)
} as const;

// Reverse mapping for alpha-2 to numeric
export const ALPHA2_TO_NUMERIC = Object.fromEntries(
  Object.entries(NUMERIC_TO_ALPHA2).map(([numeric, alpha2]) => [alpha2, numeric])
) as Record<Alpha2CountryCode, string>;

// Country name variations and alternative names
export const COUNTRY_NAME_MAPPINGS: Record<string, Alpha2CountryCode> = {
  // Standard Names
  'United States': 'US',
  'United States of America': 'US',
  'USA': 'US',
  'United Kingdom': 'GB',
  'Great Britain': 'GB',
  'Britain': 'GB',
  'UK': 'GB',
  'South Korea': 'KR',
  'Republic of Korea': 'KR',
  'Korea': 'KR',
  'North Korea': 'KP',
  'Democratic People\'s Republic of Korea': 'KP',
  'DPRK': 'KP',
  'South Africa': 'ZA',
  'Czech Republic': 'CZ',
  'Dominican Republic': 'DO',
  'Costa Rica': 'CR',
  'Puerto Rico': 'PR',
  'New Zealand': 'NZ',
  'Saudi Arabia': 'SA',
  'United Arab Emirates': 'AE',
  'UAE': 'AE',

  // Central Asian Countries
  'Kazakhstan': 'KZ',
  'Uzbekistan': 'UZ',
  'Tajikistan': 'TJ',
  'Kyrgyzstan': 'KG',
  'Turkmenistan': 'TM',
  'Azerbaijan': 'AZ',
  'Armenia': 'AM',
  'Georgia': 'GE',

  // European Countries
  'Ukraine': 'UA',
  'Belarus': 'BY',
  'Lithuania': 'LT',
  'Latvia': 'LV',
  'Estonia': 'EE',
  'Poland': 'PL',
  'Slovakia': 'SK',
  'Hungary': 'HU',
  'Romania': 'RO',
  'Bulgaria': 'BG',
  'Serbia': 'RS',
  'Montenegro': 'ME',
  'Bosnia and Herzegovina': 'BA',
  'Croatia': 'HR',
  'Slovenia': 'SI',
  'North Macedonia': 'MK',
  'Albania': 'AL',
  'Greece': 'GR',
  'Portugal': 'PT',
  'Ireland': 'IE',
  'Iceland': 'IS',
  'Norway': 'NO',
  'Sweden': 'SE',
  'Finland': 'FI',
  'Denmark': 'DK',
  'Netherlands': 'NL',
  'Belgium': 'BE',
  'Luxembourg': 'LU',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Moldova': 'MD',
  'Cyprus': 'CY',

  // Asian Countries
  'Afghanistan': 'AF',
  'Pakistan': 'PK',
  'Iran': 'IR',
  'Iraq': 'IQ',
  'Syria': 'SY',
  'Lebanon': 'LB',
  'Jordan': 'JO',
  'Israel': 'IL',
  'Palestine': 'PS',
  'Kuwait': 'KW',
  'Bahrain': 'BH',
  'Qatar': 'QA',
  'Oman': 'OM',
  'Yemen': 'YE',
  'Mongolia': 'MN',
  'Indonesia': 'ID',
  'Malaysia': 'MY',
  'Philippines': 'PH',
  'Singapore': 'SG',
  'Thailand': 'TH',
  'Vietnam': 'VN',
  'Cambodia': 'KH',
  'Laos': 'LA',
  'Myanmar': 'MM',
  'Brunei': 'BN',
  'Timor-Leste': 'TL',
  'East Timor': 'TL',
  'Bangladesh': 'BD',
  'Bhutan': 'BT',
  'Sri Lanka': 'LK',
  'Maldives': 'MV',
  'Nepal': 'NP',

  // South American Countries
  'Bolivia': 'BO',
  'Colombia': 'CO',
  'Ecuador': 'EC',
  'Guyana': 'GY',
  'Paraguay': 'PY',
  'Peru': 'PE',
  'Uruguay': 'UY',
  'Venezuela': 'VE',
  'Suriname': 'SR',
  'French Guiana': 'GF',
  'Falkland Islands': 'FK',

  // Caribbean & Central American Countries
  'Antigua and Barbuda': 'AG',
  'Bahamas': 'BS',
  'Barbados': 'BB',
  'Belize': 'BZ',
  'Cuba': 'CU',
  'Dominica': 'DM',
  'Guatemala': 'GT',
  'Haiti': 'HT',
  'Honduras': 'HN',
  'Jamaica': 'JM',
  'Nicaragua': 'NI',
  'Panama': 'PA',
  'Saint Kitts and Nevis': 'KN',
  'Saint Lucia': 'LC',
  'Saint Vincent and the Grenadines': 'VC',
  'Trinidad and Tobago': 'TT',

  // Pacific & Oceanic Countries
  'Fiji': 'FJ',
  'Kiribati': 'KI',
  'Marshall Islands': 'MH',
  'Micronesia': 'FM',
  'Nauru': 'NR',
  'Papua New Guinea': 'PG',
  'Samoa': 'WS',
  'Solomon Islands': 'SB',
  'Tonga': 'TO',
  'Tuvalu': 'TV',
  'Vanuatu': 'VU',

  // Special Cases and Territories
  'Kosovo': 'XK',
  'Antarctica': 'AQ',
  'Western Sahara': 'EH',
  'Greenland': 'GL',

  // Common Abbreviations and Alternative Names
  'W. Sahara': 'EH',
  'Dem. Rep. Congo': 'CD',
  'Dominican Rep.': 'DO',
  'Central African Rep.': 'CF',
  'Eq. Guinea': 'GQ',
  'Equatorial Guinea': 'GQ',
  'Guinea-Bissau': 'GW',
  'N. Cyprus': 'CY',
  'Northern Cyprus': 'CY',
  'Somaliland': 'SO',
  'Falkland Is.': 'FK',
  'Fr. S. Antarctic Lands': 'TF',
  'S. Sudan': 'SS',
  'Bosnia and Herz.': 'BA',
} as const;

// Comprehensive country name to numeric code lookup
export const COUNTRY_NAMES_TO_NUMERIC: Record<string, string> = {
  // Major Countries
  'United States': '840',
  'Canada': '124',
  'Mexico': '484',
  'Germany': '276',
  'France': '250',
  'United Kingdom': '826',
  'Spain': '724',
  'Italy': '380',
  'China': '156',
  'Japan': '392',
  'South Korea': '410',
  'India': '356',
  'Australia': '036',
  'Brazil': '076',
  'Argentina': '032',
  'Russia': '643',
  'Turkey': '792',
  'South Africa': '710',
  'Egypt': '818',
  
  // All other countries following ISO 3166-1 standard
  'Afghanistan': '004',
  'Albania': '008',
  'Algeria': '012',
  'Andorra': '020',
  'Angola': '024',
  'Antigua and Barbuda': '028',
  'Azerbaijan': '031',
  'Austria': '040',
  'Bahamas': '044',
  'Bahrain': '048',
  'Bangladesh': '050',
  'Armenia': '051',
  'Barbados': '052',
  'Belgium': '056',
  'Bermuda': '060',
  'Bhutan': '064',
  'Bolivia': '068',
  'Bosnia and Herzegovina': '070',
  'Botswana': '072',
  'Belize': '084',
  'Solomon Islands': '090',
  'Brunei': '096',
  'Bulgaria': '100',
  'Myanmar': '104',
  'Burundi': '108',
  'Belarus': '112',
  'Cambodia': '116',
  'Cameroon': '120',
  'Cape Verde': '132',
  'Cayman Islands': '136',
  'Central African Republic': '140',
  'Sri Lanka': '144',
  'Chad': '148',
  'Chile': '152',
  'Taiwan': '158',
  'Colombia': '170',
  'Comoros': '174',
  'Mayotte': '175',
  'Congo': '178',
  'Democratic Republic of the Congo': '180',
  'Cook Islands': '184',
  'Costa Rica': '188',
  'Croatia': '191',
  'Cuba': '192',
  'Cyprus': '196',
  'Czech Republic': '203',
  'Benin': '204',
  'Denmark': '208',
  'Dominica': '212',
  'Dominican Republic': '214',
  'Ecuador': '218',
  'El Salvador': '222',
  'Equatorial Guinea': '226',
  'Ethiopia': '231',
  'Eritrea': '232',
  'Estonia': '233',
  'Faroe Islands': '234',
  'Falkland Islands': '238',
  'Fiji': '242',
  'Finland': '246',
  'French Guiana': '254',
  'French Polynesia': '258',
  'French Southern Territories': '260',
  'Djibouti': '262',
  'Gabon': '266',
  'Georgia': '268',
  'Gambia': '270',
  'Palestine': '275',
  'Ghana': '288',
  'Gibraltar': '292',
  'Kiribati': '296',
  'Greece': '300',
  'Greenland': '304',
  'Grenada': '308',
  'Guadeloupe': '312',
  'Guam': '316',
  'Guatemala': '320',
  'Guinea': '324',
  'Guyana': '328',
  'Haiti': '332',
  'Heard Island and McDonald Islands': '334',
  'Vatican City': '336',
  'Honduras': '340',
  'Hong Kong': '344',
  'Hungary': '348',
  'Iceland': '352',
  'Indonesia': '360',
  'Iran': '364',
  'Iraq': '368',
  'Ireland': '372',
  'Israel': '376',
  'Ivory Coast': '384',
  'Jamaica': '388',
  'Kazakhstan': '398',
  'Jordan': '400',
  'Kenya': '404',
  'North Korea': '408',
  'Kuwait': '414',
  'Kyrgyzstan': '417',
  'Laos': '418',
  'Lebanon': '422',
  'Lesotho': '426',
  'Latvia': '428',
  'Liberia': '430',
  'Libya': '434',
  'Liechtenstein': '438',
  'Lithuania': '440',
  'Luxembourg': '442',
  'Macao': '446',
  'Madagascar': '450',
  'Malawi': '454',
  'Malaysia': '458',
  'Maldives': '462',
  'Mali': '466',
  'Malta': '470',
  'Martinique': '474',
  'Mauritania': '478',
  'Mauritius': '480',
  'Monaco': '492',
  'Mongolia': '496',
  'Moldova': '498',
  'Montenegro': '499',
  'Montserrat': '500',
  'Morocco': '504',
  'Mozambique': '508',
  'Oman': '512',
  'Namibia': '516',
  'Nauru': '520',
  'Nepal': '524',
  'Netherlands': '528',
  'New Caledonia': '540',
  'Vanuatu': '548',
  'New Zealand': '554',
  'Nicaragua': '558',
  'Niger': '562',
  'Nigeria': '566',
  'Niue': '570',
  'Norfolk Island': '574',
  'Norway': '578',
  'Northern Mariana Islands': '580',
  'Micronesia': '583',
  'Marshall Islands': '584',
  'Palau': '585',
  'Pakistan': '586',
  'Panama': '591',
  'Papua New Guinea': '598',
  'Paraguay': '600',
  'Peru': '604',
  'Philippines': '608',
  'Pitcairn': '612',
  'Poland': '616',
  'Portugal': '620',
  'Guinea-Bissau': '624',
  'Timor-Leste': '626',
  'Puerto Rico': '630',
  'Qatar': '634',
  'Reunion': '638',
  'Romania': '642',
  'Rwanda': '646',
  'Saint Barthelemy': '652',
  'Saint Helena': '654',
  'Saint Kitts and Nevis': '659',
  'Anguilla': '660',
  'Saint Lucia': '662',
  'Saint Martin': '663',
  'Saint Pierre and Miquelon': '666',
  'Saint Vincent and the Grenadines': '670',
  'San Marino': '674',
  'Sao Tome and Principe': '678',
  'Saudi Arabia': '682',
  'Senegal': '686',
  'Serbia': '688',
  'Seychelles': '690',
  'Sierra Leone': '694',
  'Singapore': '702',
  'Slovakia': '703',
  'Vietnam': '704',
  'Slovenia': '705',
  'Somalia': '706',
  'Zimbabwe': '716',
  'South Sudan': '728',
  'Sudan': '729',
  'Western Sahara': '732',
  'Suriname': '740',
  'Svalbard and Jan Mayen': '744',
  'Eswatini': '748',
  'Sweden': '752',
  'Switzerland': '756',
  'Syria': '760',
  'Tajikistan': '762',
  'Thailand': '764',
  'Togo': '768',
  'Tokelau': '772',
  'Tonga': '776',
  'Trinidad and Tobago': '780',
  'United Arab Emirates': '784',
  'Tunisia': '788',
  'Turkmenistan': '795',
  'Turks and Caicos Islands': '796',
  'Tuvalu': '798',
  'Uganda': '800',
  'Ukraine': '804',
  'North Macedonia': '807',
  'Tanzania': '834',
  'US Virgin Islands': '850',
  'Burkina Faso': '854',
  'Uruguay': '858',
  'Uzbekistan': '860',
  'Venezuela': '862',
  'Wallis and Futuna': '876',
  'Samoa': '882',
  'Yemen': '887',
  'Zambia': '894',

  // Special Cases
  'Antarctica': '010',
  'Kosovo': 'xk', // Kosovo uses a special code
} as const;

/**
 * Converts numeric country code to alpha-2 code
 */
export function numericToAlpha2(numericCode: NumericCountryCode): Alpha2CountryCode | null {
  if (!numericCode) return null;
  return NUMERIC_TO_ALPHA2[numericCode] || null;
}

/**
 * Converts alpha-2 country code to numeric code
 */
export function alpha2ToNumeric(alpha2Code: Alpha2CountryCode): string | null {
  return ALPHA2_TO_NUMERIC[alpha2Code.toUpperCase()] || null;
}

/**
 * Gets country code from country name with fuzzy matching
 */
export function getCountryCodeFromName(countryName: CountryName): Alpha2CountryCode | null {
  // Direct match
  if (COUNTRY_NAME_MAPPINGS[countryName]) {
    return COUNTRY_NAME_MAPPINGS[countryName];
  }

  // Case insensitive match
  const lowerName = countryName.toLowerCase();
  for (const [name, code] of Object.entries(COUNTRY_NAME_MAPPINGS)) {
    if (name.toLowerCase() === lowerName) {
      return code;
    }
  }

  // Partial matching for edge cases
  if (lowerName.includes('kosovo')) return 'XK';
  if (lowerName.includes('congo') && lowerName.includes('dem')) return 'CD';
  if (lowerName.includes('korea') && lowerName.includes('north')) return 'KP';
  if (lowerName.includes('korea') && lowerName.includes('south')) return 'KR';
  if (lowerName.includes('guinea') && lowerName.includes('equatorial')) return 'GQ';
  if (lowerName.includes('sahara')) return 'EH';
  if (lowerName.includes('timor')) return 'TL';
  if (lowerName.includes('antarctica')) return 'AQ';

  return null;
}

/**
 * Gets numeric code from country name
 */
export function getNumericCodeFromName(countryName: CountryName): string | null {
  return COUNTRY_NAMES_TO_NUMERIC[countryName] || null;
}

/**
 * Universal country code resolver - handles numeric, alpha-2, or names
 */
export function resolveCountryCode(
  input: NumericCountryCode | Alpha2CountryCode | CountryName
): Alpha2CountryCode | null {
  if (!input || input === 'undefined') return null;

  // Try as numeric code first
  if (/^\d+$/.test(input)) {
    return numericToAlpha2(input);
  }

  // Try as alpha-2 code
  if (input.length === 2 && /^[A-Za-z]{2}$/.test(input)) {
    const upperCode = input.toUpperCase() as Alpha2CountryCode;
    return NUMERIC_TO_ALPHA2[ALPHA2_TO_NUMERIC[upperCode]] ? upperCode : null;
  }

  // Try as country name
  return getCountryCodeFromName(input);
}

/**
 * Special case handler for edge cases and territories
 */
export function handleSpecialCases(
  countryId: NumericCountryCode | string | undefined,
  countryName: CountryName
): Alpha2CountryCode | null {
  // Kosovo special case
  if ((!countryId || countryId === 'undefined') && countryName?.toLowerCase().includes('kosovo')) {
    return 'XK';
  }

  // Antarctica
  if (countryId === '010' || countryName?.toLowerCase().includes('antarctica')) {
    return 'AQ';
  }

  // Northern Cyprus uses Cyprus flag
  if (countryName?.toLowerCase().includes('northern cyprus') || 
      countryName?.toLowerCase().includes('n. cyprus')) {
    return 'CY';
  }

  // Somaliland uses Somalia flag
  if (countryName?.toLowerCase().includes('somaliland')) {
    return 'SO';
  }

  return null;
}