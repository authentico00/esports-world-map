'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { geoCentroid } from 'd3-geo';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { EsportsRegion, REGION_COLORS } from '@/types/esports';
import { COUNTRY_REGIONS } from '@/data/countries';
import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/utils/themes';
import { NUMERIC_TO_ALPHA2, COUNTRY_NAMES_TO_NUMERIC, alpha2ToNumeric } from '@/utils/countryMappings';
import type { 
  GeographyData, 
  CountryTarget, 
  NumericCountryCode, 
  CountryName, 
  Alpha2CountryCode,
  CountryEventHandlers 
} from '@/types/country';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas/countries-110m.json";

interface WorldMapProps {
  selectedRegions: EsportsRegion[];
  hoveredCountry: CountryName | null;
  onCountryHover: CountryEventHandlers['onCountryHover'];
  searchZoomTarget?: CountryTarget | null;
  highlightedCountry?: CountryTarget | null;
}

export default function WorldMap({ selectedRegions, hoveredCountry, onCountryHover, searchZoomTarget, highlightedCountry }: WorldMapProps) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  
  // Mobile detection for responsive map settings
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  
  // Zoom and pan state
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  
  // Store loaded geographies for search functionality
  const [loadedGeographies, setLoadedGeographies] = useState<GeographyData[]>([]);
  const currentGeographiesRef = useRef<GeographyData[]>([]);
  
  // Remove click processing state - no longer needed
  
  // Handle zoom
  const handleZoomIn = useCallback(() => {
    if (position.zoom >= 4) return;
    setPosition(prev => ({ ...prev, zoom: prev.zoom * 2 }));
  }, [position.zoom]);

  const handleZoomOut = useCallback(() => {
    if (position.zoom <= 1) return;
    setPosition(prev => ({ ...prev, zoom: prev.zoom / 2 }));
  }, [position.zoom]);

  const handleMoveEnd = useCallback((position: any) => {
    setPosition(position);
  }, []);

  const resetPosition = useCallback(() => {
    setPosition({ coordinates: [0, 0], zoom: 1 });
  }, []);

  // Zoom to specific country on double-click
  const zoomToCountry = useCallback((geography: any) => {
    const centroid = geoCentroid(geography);
    
    // Determine appropriate zoom level based on country size
    const bounds = geography.geometry?.coordinates?.flat(2) || [];
    let targetZoom = 2; // Default zoom
    
    // Adjust zoom based on rough country size estimation
    if (bounds.length < 50) {
      targetZoom = 4; // Small countries/islands - zoom in more
    } else if (bounds.length < 200) {
      targetZoom = 3; // Medium countries 
    } else {
      targetZoom = 2; // Large countries - moderate zoom
    }
    
    setPosition({
      coordinates: centroid,
      zoom: Math.min(targetZoom, 4) // Cap at max zoom level
    });
  }, []);

  // Handle search zoom requests
  useEffect(() => {
    if (!searchZoomTarget) return;
    
    if (loadedGeographies.length === 0) {
      return;
    }

    const { countryCode, countryName } = searchZoomTarget;
    
    // Find the geography that matches the search target
    const targetGeography = loadedGeographies.find(geo => {
      const geoId = geo.id;
      const geoName = geo.properties?.NAME || geo.properties?.name || geo.properties?.NAME_EN || getCountryNameFromId(geoId);
      
      // Use centralized mapping for country code conversion
      const expectedNumericId = alpha2ToNumeric(countryCode.toUpperCase() as Alpha2CountryCode);
      if (expectedNumericId && geoId === expectedNumericId) {
        return true;
      }
      
      // Check by name
      if (geoName?.toLowerCase().includes(countryName.toLowerCase()) || 
          countryName.toLowerCase().includes(geoName?.toLowerCase() || '')) {
        return true;
      }
      
      // Special case for Kosovo - search uses XK but map has undefined ID
      if (countryCode.toLowerCase() === 'xk' && 
          (geoName?.toLowerCase().includes('kosovo') || countryName.toLowerCase().includes('kosovo')) &&
          geoId === undefined) {
        return true;
      }
      
      return false;
    });

    if (targetGeography) {
      zoomToCountry(targetGeography);
    }
  }, [searchZoomTarget, loadedGeographies, zoomToCountry]);

  // Effect to store geographies when they become available
  useEffect(() => {
    const updateGeographies = () => {
      if (loadedGeographies.length === 0 && currentGeographiesRef.current.length > 0) {
        setLoadedGeographies(currentGeographiesRef.current);
      }
    };
    
    // Check immediately
    updateGeographies();
    
    // Also check with a small delay to catch async geography loading
    const timer = setTimeout(updateGeographies, 100);
    return () => clearTimeout(timer);
  }, [loadedGeographies.length]);

  // Function to get country name from numeric ID using centralized mappings
  const getCountryNameFromId = (countryId: NumericCountryCode): CountryName | null => {
    try {
      if (!countryId) return null;
      
      // First try to get alpha-2 code from numeric
      const alpha2Code = NUMERIC_TO_ALPHA2[countryId];
      if (alpha2Code) {
        // Then look up the name from our comprehensive mappings
        for (const [name, code] of Object.entries(COUNTRY_NAMES_TO_NUMERIC)) {
          if (COUNTRY_NAMES_TO_NUMERIC[name] === countryId) {
            return name as CountryName;
          }
        }
      }
      
      // Handle special cases
      if (countryId === 'xk' || countryId === 'XK' || countryId === '0' || countryId === '-1') {
        return 'Kosovo';
      }
      
      return null;
    } catch (error) {
      console.error('Error in getCountryNameFromId:', error, 'for countryId:', countryId);
      return null;
    }
  };

  // The geography data uses numeric ISO 3166-1 country codes, map them to 2-letter codes
  const getRegionFromCountryId = (countryId: NumericCountryCode, countryName: CountryName | undefined): EsportsRegion | null => {
    try {
      // Special case for Kosovo with undefined countryCode - ONLY if name actually contains kosovo
      if (!countryId && countryName?.toLowerCase() === 'kosovo') {
        return EsportsRegion.EUROPE;
      }
      
      if (!countryId) return null;
      
      // Use centralized mapping to get alpha-2 code
      const twoLetterCode = NUMERIC_TO_ALPHA2[countryId];
      if (twoLetterCode && COUNTRY_REGIONS[twoLetterCode]) {
        return COUNTRY_REGIONS[twoLetterCode];
      }
      
      // Special case for Kosovo - comprehensive detection
      if (countryName?.toLowerCase().includes('kosovo') || 
          countryId?.toLowerCase() === 'xk' || 
          countryId === 'XK' ||
          countryId === '0' ||
          countryId === '-1' ||
          countryName?.toLowerCase().includes('kosov')) {
        return COUNTRY_REGIONS['XK'] || EsportsRegion.EUROPE;
      }
      
      return null;
    } catch (error) {
      console.error('Error in getRegionFromCountryId:', error, 'for countryId:', countryId, 'countryName:', countryName);
      return null;
    }
  };

  // Function to check if a country's region matches the selected filters
  const isCountrySelected = (countryRegion: EsportsRegion): boolean => {
    // If no regions are selected, show no countries as selected (all gray)
    if (selectedRegions.length === 0) return false;
    
    // If the country's region is directly selected
    if (selectedRegions.includes(countryRegion)) return true;
    
    // Check if a main region is selected that includes this sub-region
    for (const selectedRegion of selectedRegions) {
      if (selectedRegion === EsportsRegion.AMERICAS && 
          (countryRegion === EsportsRegion.NORTH_AMERICA || countryRegion === EsportsRegion.SOUTH_AMERICA)) {
        return true;
      }
      if (selectedRegion === EsportsRegion.EUROPE && 
          (countryRegion === EsportsRegion.EUROPE || countryRegion === EsportsRegion.MENA)) {
        return true;
      }
      if (selectedRegion === EsportsRegion.ASIA_PACIFIC && 
          (countryRegion === EsportsRegion.ASIA || countryRegion === EsportsRegion.OCEANIA || countryRegion === EsportsRegion.AFRICA_NON_MENA)) {
        return true;
      }
    }
    
    return false;
  };

  // Check if a country is highlighted (from search)
  const isCountryHighlighted = useCallback((countryId: NumericCountryCode, countryName: CountryName | undefined) => {
    if (!highlightedCountry) return false;
    
    const { countryCode: searchCountryCode, countryName: searchName } = highlightedCountry;
    
    
    // Use centralized mapping for country code conversion
    const expectedNumericId = alpha2ToNumeric(searchCountryCode.toUpperCase() as Alpha2CountryCode);
    if (expectedNumericId && countryId === expectedNumericId) {
      return true;
    }
    
    // Check if this country matches the search target by name
    const searchNameLower = searchName.toLowerCase().trim();
    const currentCountryNameLower = (countryName?.toLowerCase() || '').trim();
    
    // Name mappings to handle abbreviated names in map data
    const nameExpansions: Record<string, string[]> = {
      'solomon islands': ['solomon is.', 'solomon is'],
      'central african republic': ['central african rep.', 'central african rep', 'car'],
      'democratic republic of congo': ['dem. rep. congo', 'dem rep congo', 'drc', 'dr congo'],
      'democratic republic of the congo': ['dem. rep. congo', 'dem rep congo', 'drc', 'dr congo'],
      'dominican republic': ['dominican rep.', 'dominican rep'],
      'equatorial guinea': ['eq. guinea', 'eq guinea'],
      'falkland islands': ['falkland is.', 'falkland is'],
      'french southern and antarctic lands': ['fr. s. antarctic lands', 'french southern territories'],
      'south sudan': ['s. sudan', 's sudan'],
      'bosnia and herzegovina': ['bosnia and herz.', 'bosnia and herz', 'bosnia'],
      'western sahara': ['w. sahara', 'w sahara'],
      'north cyprus': ['n. cyprus', 'n cyprus', 'northern cyprus'],
      'northern cyprus': ['n. cyprus', 'n cyprus'],
      'united states of america': ['united states', 'usa', 'us'],
      'united kingdom': ['uk', 'great britain', 'britain'],
      'south korea': ['korea', 'republic of korea'],
      'north korea': ['korea', 'democratic people\'s republic of korea', 'dprk']
    };
    
    // Check if the current country matches the searched country by name
    if (currentCountryNameLower === searchNameLower) {
      return true;
    }
    
    // Handle abbreviated names - check if search target matches current country's abbreviations
    const expansions = nameExpansions[searchNameLower] || [];
    if (expansions.some(abbrev => abbrev === currentCountryNameLower)) {
      return true;
    }
    
    // Handle abbreviated names - check if current country is abbreviation of search target
    const reverseMatch = Object.entries(nameExpansions).find(([fullName, abbrevs]) => 
      fullName === searchNameLower && abbrevs.includes(currentCountryNameLower)
    );
    if (reverseMatch) {
      return true;
    }
    
    // Special case for Kosovo - search uses "XK" code but map has undefined ID
    if ((searchNameLower === 'kosovo' || searchCountryCode === 'XK') && 
        currentCountryNameLower === 'kosovo' && countryId === undefined) {
      return true;
    }
    
    // General Kosovo fallback - if searching for Kosovo, match any country named Kosovo
    if (searchNameLower.includes('kosovo') && currentCountryNameLower.includes('kosovo')) {
      return true;
    }
    
    
    return false;
  }, [highlightedCountry]);

  const getCountryColor = useCallback((countryId: NumericCountryCode, countryName: CountryName | undefined) => {
    const region = getRegionFromCountryId(countryId, countryName);
    const isHighlighted = isCountryHighlighted(countryId, countryName);
    
    // Theme-aware default colors for unassigned countries
    const unassignedColor = theme === 'dark' ? '#E5E7EB' : '#F1F5F9';
    const filteredColor = theme === 'dark' ? '#D1D5DB' : '#E2E8F0';
    
    // Highlighted country gets a bright color
    if (isHighlighted) {
      return theme === 'dark' ? '#FCD34D' : '#F59E0B'; // Bright amber/yellow
    }
    
    if (!region) return unassignedColor;
    
    if (isCountrySelected(region)) {
      return REGION_COLORS[region];
    }
    
    return filteredColor;
  }, [theme, selectedRegions, isCountryHighlighted]); // Add dependencies

  const getCountryOpacity = useCallback((countryId: NumericCountryCode, countryName: CountryName | undefined) => {
    const region = getRegionFromCountryId(countryId, countryName);
    const isHighlighted = isCountryHighlighted(countryId, countryName);
    
    // Highlighted countries are always highly visible
    if (isHighlighted) {
      return hoveredCountry === countryId ? 1.0 : 0.9;
    }
    
    if (!region) return 0.25; // Slightly higher for better visibility during transitions
    
    if (isCountrySelected(region)) {
      return hoveredCountry === countryId ? 0.95 : 0.75; // Slightly higher opacity for better effect
    }
    
    return 0.15; // Lower opacity for unselected regions to make selection more dramatic
  }, [hoveredCountry, selectedRegions, isCountryHighlighted]); // Add dependencies
  
  // Memoize stroke styles for performance
  const strokeStyles = useMemo(() => ({
    stroke: theme === 'dark' ? '#1F2937' : '#111827',
    strokeWidth: theme === 'dark' ? 0.5 : 0.7
  }), [theme]);
  
  // Optimize pattern opacity based on zoom level for better performance
  const patternOpacity = useMemo(() => {
    // Reduce pattern visibility at higher zoom levels for better performance
    if (position.zoom >= 3) return currentTheme.oceanDots.opacity * 0.3;
    if (position.zoom >= 2) return currentTheme.oceanDots.opacity * 0.6;
    return currentTheme.oceanDots.opacity;
  }, [position.zoom, currentTheme.oceanDots.opacity]);

  return (
    <div className="w-full h-full flex items-stretch justify-center relative overflow-hidden">
      {/* Zoom Controls */}
      <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 z-10 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          disabled={position.zoom >= 4}
          className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600' 
              : 'bg-slate-200/95 border-gray-300 text-gray-700 hover:bg-slate-300/95 disabled:bg-gray-100 disabled:text-gray-400'
          }`}
          title="Zoom In"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        
        <button
          onClick={handleZoomOut}
          disabled={position.zoom <= 1}
          className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600' 
              : 'bg-slate-200/95 border-gray-300 text-gray-700 hover:bg-slate-300/95 disabled:bg-gray-100 disabled:text-gray-400'
          }`}
          title="Zoom Out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
        
        <button
          onClick={resetPosition}
          disabled={position.zoom === 1 && position.coordinates[0] === 0 && position.coordinates[1] === 0}
          className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600' 
              : 'bg-slate-200/95 border-gray-300 text-gray-700 hover:bg-slate-300/95 disabled:bg-gray-100 disabled:text-gray-400'
          }`}
          title="Reset View"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{
          scale: isMobile ? 180 : 200,
          center: [0, isMobile ? 5 : 10]
        }}
        width={isMobile ? 800 : 1100}
        height={isMobile ? 400 : 600}
        className="w-full h-full max-w-full"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      >
        <defs>
          {/* Ultra-optimized ocean dot pattern */}
          <pattern 
            id="oceanDots" 
            patternUnits="userSpaceOnUse" 
            width="32" 
            height="32"
            patternTransform="scale(1)"
          >
            {/* Single optimized dot using rect for better GPU performance */}
            <rect 
              x="15" 
              y="15" 
              width="2" 
              height="2" 
              fill={currentTheme.oceanDots.color} 
              fillOpacity={patternOpacity}
              rx="1"
            />
          </pattern>
          
          {/* Optimized land pattern for countries - very sparse for performance */}
          <pattern 
            id="landTexture" 
            patternUnits="userSpaceOnUse" 
            width="80" 
            height="80"
            patternTransform="scale(0.5)"
          >
            <rect 
              x="39" 
              y="39" 
              width="2" 
              height="2" 
              fill="currentColor" 
              fillOpacity="0.03"
              rx="1"
            />
          </pattern>
        </defs>
        
        {/* Ocean background with optimized dots */}
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#oceanDots)"
        />
        
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          onDoubleClick={(event) => {
            // Only zoom in normally if double-click is on ocean (not on a country)
            const target = event.target as SVGElement;
            // Check if the click was on the ocean background (rect with oceanDots pattern)
            if (target.tagName === 'rect' && (
              target.getAttribute('fill')?.includes('oceanDots') || 
              target.getAttribute('fill') === 'url(#oceanDots)'
            )) {
              handleZoomIn();
            }
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              // Store geographies reference for search functionality
              if (geographies && geographies.length > 0) {
                currentGeographiesRef.current = geographies;
              }
              
              // Performance optimization: Show all countries at default zoom, filter only at very high zoom
              const shouldFilterTinyTerritories = position.zoom >= 3;
              
              // Safety check for geographies array
              if (!geographies || !Array.isArray(geographies)) {
                return null;
              }
              
              return geographies
                .filter((geo) => {
                  // Show all countries at normal zoom levels (1x-2.9x)
                  if (!shouldFilterTinyTerritories) return true;
                  
                  // At 3x+ zoom, hide only the tiniest territories for performance
                  const countryCode = geo.id;
                  const tinyTerritories = ['660', '092', '336', '831', '833', '292', '674', '239', '612', '540'];
                  return !tinyTerritories.includes(countryCode);
                })
                .map((geo) => {
                const countryCode = geo.id;
                // Try multiple property names for country name
                const countryName = geo.properties?.NAME || 
                                   geo.properties?.name || 
                                   geo.properties?.NAME_EN ||
                                   getCountryNameFromId(countryCode) ||
                                   `Country ${countryCode}`;
                const region = getRegionFromCountryId(countryCode, countryName);
                
                // Create staggered animation delay based on country code hash
                const hashCode = (str: string | undefined) => {
                  if (!str) return 0;
                  let hash = 0;
                  for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32-bit integer
                  }
                  return Math.abs(hash);
                };
                const animationDelay = (hashCode(countryCode || 'default') % 200) + 'ms';
                
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryColor(countryCode, countryName)}
                    stroke={strokeStyles.stroke}
                    strokeWidth={strokeStyles.strokeWidth}
                    opacity={getCountryOpacity(countryCode, countryName)}
                    onMouseEnter={(e) => {
                      onCountryHover(countryCode, countryName, region, e);
                    }}
                    onMouseLeave={() => onCountryHover(null)}
                    // Remove onClick handler - no longer supporting click selection
                    onDoubleClick={() => {
                      if (region) {
                        zoomToCountry(geo);
                      }
                    }}
                    style={{
                      default: {
                        outline: "none",
                        cursor: region ? "pointer" : "default",
                        transition: `opacity 0.5s cubic-bezier(0.4, 0.0, 0.2, 1) ${animationDelay}, fill 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) ${animationDelay}, filter 0.25s ease-out`
                      },
                      hover: {
                        outline: "none",
                        filter: region ? "brightness(1.1)" : "none",
                        transition: `opacity 0.5s cubic-bezier(0.4, 0.0, 0.2, 1) ${animationDelay}, fill 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) ${animationDelay}, filter 0.25s ease-out`
                      },
                      pressed: {
                        outline: "none",
                        transition: `opacity 0.5s cubic-bezier(0.4, 0.0, 0.2, 1) ${animationDelay}, fill 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) ${animationDelay}, filter 0.25s ease-out`
                      },
                    }}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}