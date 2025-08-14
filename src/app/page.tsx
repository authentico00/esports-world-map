'use client';

import React, { useState, useEffect } from 'react';
import WorldMap from '@/components/WorldMap';
import ControlPanel from '@/components/ControlPanel';
import CountrySearch from '@/components/CountrySearch';
import { EsportsRegion, REGION_COLORS } from '@/types/esports';
import { COUNTRY_REGIONS } from '@/data/countries';
import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/utils/themes';
import { getCountryCodeForFlag, getFlagUrl, createFlagErrorHandler } from '@/utils/flagUtils';
import ErrorBoundary from '@/components/ErrorBoundary';
import MapErrorBoundary from '@/components/MapErrorBoundary';
import SearchErrorBoundary from '@/components/SearchErrorBoundary';
import ErrorTester from '@/components/ErrorTester';
import { errorReporter } from '@/utils/errorReporting';
import type { 
  HoveredCountry, 
  CountryTarget, 
  SearchModalState,
  NumericCountryCode, 
  Alpha2CountryCode, 
  CountryName 
} from '@/types/country';

export default function Home() {
  const { theme, toggleTheme, isDark } = useTheme();
  const currentTheme = themes[theme];
  const [selectedRegions, setSelectedRegions] = useState<EsportsRegion[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<HoveredCountry | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchZoomTarget, setSearchZoomTarget] = useState<CountryTarget | null>(null);
  const [highlightedCountry, setHighlightedCountry] = useState<CountryTarget | null>(null);
  const [isZoomTransitioning, setIsZoomTransitioning] = useState(false);
  
  // Mobile detection for responsive layout
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Search modal state management
  const [searchModal, setSearchModal] = useState<SearchModalState | null>(null);
  
  // Preload flags for frequently viewed countries in esports
  useEffect(() => {
    // Tier 1: Most common esports countries (immediate preload)
    const tier1Countries = ['us', 'gb', 'de', 'fr', 'br', 'kr', 'jp', 'cn', 'au', 'ca'];
    
    // Tier 2: Popular esports regions (delayed preload)
    const tier2Countries = ['se', 'dk', 'no', 'fi', 'nl', 'be', 'ch', 'at', 'it', 'es', 'pl', 'cz', 'ua', 'ru', 'tr'];
    
    // Tier 3: Emerging esports markets (further delayed preload)
    const tier3Countries = ['mx', 'ar', 'cl', 'pe', 'co', 'in', 'th', 'vn', 'ph', 'id', 'my', 'sg', 'za', 'eg', 'il'];
    
    const preloadTier = (countries: string[], delay: number) => {
      const timer = setTimeout(() => {
        countries.forEach(countryCode => {
          const img = new Image();
          img.src = `https://flagcdn.com/w40/${countryCode}.png`;
          // Preload silently - don't add to DOM
        });
      }, delay);
      return timer;
    };
    
    // Staggered preloading to avoid bandwidth spikes
    const timer1 = preloadTier(tier1Countries, 1000);    // Load after 1s
    const timer2 = preloadTier(tier2Countries, 3000);    // Load after 3s  
    const timer3 = preloadTier(tier3Countries, 6000);    // Load after 6s
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  
  // Intelligent preloading based on selected regions
  useEffect(() => {
    if (selectedRegions.length === 0) return;
    
    const regionCountries: Record<EsportsRegion, string[]> = {
      [EsportsRegion.NORTH_AMERICA]: ['us', 'ca', 'mx'],
      [EsportsRegion.SOUTH_AMERICA]: ['br', 'ar', 'cl', 'pe', 'co', 'uy', 've', 'ec', 'bo', 'py'],
      [EsportsRegion.EUROPE]: ['de', 'gb', 'fr', 'se', 'dk', 'no', 'fi', 'nl', 'be', 'ch', 'at', 'it', 'es', 'pl', 'cz', 'ua', 'ru'],
      [EsportsRegion.ASIA]: ['kr', 'jp', 'cn', 'in', 'th', 'vn', 'ph', 'id', 'my', 'sg', 'kz', 'uz', 'mn'],
      [EsportsRegion.OCEANIA]: ['au', 'nz', 'fj', 'pg', 'sb', 'vu', 'to', 'ws', 'ki', 'tv'],
      [EsportsRegion.MENA]: ['tr', 'za', 'eg', 'il', 'ae', 'sa', 'qa', 'kw', 'bh', 'om', 'ye'],
      [EsportsRegion.AFRICA_NON_MENA]: ['ng', 'gh', 'ke', 'tz', 'ug', 'rw', 'zm', 'zw', 'bw', 'na'],
      [EsportsRegion.AMERICAS]: [], // Meta-region, handled by NA + SA
      [EsportsRegion.ASIA_PACIFIC]: [], // Meta-region, handled by AS + OC
      [EsportsRegion.ANTARCTICA]: ['aq'] // Just in case!
    };
    
    const preloadRegionFlags = () => {
      const countriesToPreload = new Set<string>();
      
      selectedRegions.forEach(region => {
        if (region === EsportsRegion.AMERICAS) {
          regionCountries[EsportsRegion.NORTH_AMERICA].forEach(c => countriesToPreload.add(c));
          regionCountries[EsportsRegion.SOUTH_AMERICA].forEach(c => countriesToPreload.add(c));
        } else if (region === EsportsRegion.ASIA_PACIFIC) {
          regionCountries[EsportsRegion.ASIA].forEach(c => countriesToPreload.add(c));
          regionCountries[EsportsRegion.OCEANIA].forEach(c => countriesToPreload.add(c));
        } else {
          regionCountries[region]?.forEach(c => countriesToPreload.add(c));
        }
      });
      
      // Preload flags for selected regions
      Array.from(countriesToPreload).forEach(countryCode => {
        const img = new Image();
        img.src = `https://flagcdn.com/w40/${countryCode}.png`;
      });
    };
    
    // Small delay to avoid blocking region selection interaction
    const timer = setTimeout(preloadRegionFlags, 500);
    return () => clearTimeout(timer);
  }, [selectedRegions]);

  const handleRegionToggle = (region: EsportsRegion) => {
    setSelectedRegions(prev => {
      if (prev.includes(region)) {
        // Deselecting a region - need to handle hierarchy
        let newRegions = prev.filter(r => r !== region);
        
        // If deselecting AMERICAS, also deselect North and South America
        if (region === EsportsRegion.AMERICAS) {
          newRegions = newRegions.filter(r => 
            r !== EsportsRegion.NORTH_AMERICA && r !== EsportsRegion.SOUTH_AMERICA
          );
        }
        
        // If deselecting EUROPE, also deselect MENA
        if (region === EsportsRegion.EUROPE) {
          newRegions = newRegions.filter(r => r !== EsportsRegion.MENA);
        }
        
        // If deselecting ASIA_PACIFIC, also deselect Asia, Oceania, and Africa (non-MENA)
        if (region === EsportsRegion.ASIA_PACIFIC) {
          newRegions = newRegions.filter(r => 
            r !== EsportsRegion.ASIA && 
            r !== EsportsRegion.OCEANIA && 
            r !== EsportsRegion.AFRICA_NON_MENA
          );
        }
        
        // If going from one main regional filter to none, also deselect Antarctica
        const mainRegionalFilters = [EsportsRegion.AMERICAS, EsportsRegion.EUROPE, EsportsRegion.ASIA_PACIFIC];
        const prevMainRegions = prev.filter(r => mainRegionalFilters.includes(r));
        const newMainRegions = newRegions.filter(r => mainRegionalFilters.includes(r));
        
        if (prevMainRegions.length === 1 && newMainRegions.length === 0) {
          newRegions = newRegions.filter(r => r !== EsportsRegion.ANTARCTICA);
        }
        
        return newRegions;
      } else {
        // Selecting a region - just add it
        return [...prev, region];
      }
    });
  };

  const handleClearAllRegions = () => {
    setSelectedRegions([]);
  };

  const openFullscreen = () => {
    setIsAnimating(true); // Start with animation state
    setIsFullscreen(true);
    // Allow the modal to mount, then animate in
    setTimeout(() => setIsAnimating(false), 50);
  };

  const closeFullscreen = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsFullscreen(false);
      setIsAnimating(false);
    }, 300);
  };

  const handleCountryHover = (
    countryCode: NumericCountryCode | null, 
    countryName?: CountryName, 
    region?: EsportsRegion | null,
    event?: React.MouseEvent
  ) => {
    
    // Allow hover for countries with countryName even if countryCode is undefined (e.g., Kosovo)
    if (countryName && (countryCode || countryName.toLowerCase() === 'kosovo')) {
      
      // Handle search modal interactions
      if (searchModal) {
        const hoveringOverSearchedCountry = searchModal.name === countryName || 
          (searchModal.name.toLowerCase() === 'kosovo' && countryName.toLowerCase() === 'kosovo');
        
        if (searchModal.isProtected && !hoveringOverSearchedCountry) {
          // During protected period, don't override the search modal or highlighting
          return;
        }
        
        if (searchModal.isPersistent && !hoveringOverSearchedCountry) {
          // Clear persistent search modal and highlighting when hovering over a different country
          setSearchModal(null);
          setHighlightedCountry(null);
        }
        
        if (hoveringOverSearchedCountry) {
          // Still hovering over the searched country - keep search modal and highlighting active
          return;
        }
      }
      
      // Clear any existing highlight when hovering over a different country (only if no protected search)
      if (highlightedCountry && 
          highlightedCountry.countryCode !== (countryCode || 'xk') && 
          highlightedCountry.countryName !== countryName) {
        setHighlightedCountry(null);
      }
      
      setHoveredCountry({ 
        name: countryName, 
        region: region || null,
        countryCode: countryCode || 'xk' // Use 'xk' for Kosovo when countryCode is undefined
      });
      if (event) {
        setMousePosition({ x: event.clientX, y: event.clientY });
      }
    } else {
      // Hovering outside any country
      if (searchModal && searchModal.isPersistent) {
        // Clear persistent search modal and highlighting when hovering outside
        setSearchModal(null);
        setHighlightedCountry(null);
      }
      setHoveredCountry(null);
    }
  };

  const handleCountrySearch = (countryCode: Alpha2CountryCode, countryName: CountryName) => {
    setSearchZoomTarget({ countryCode, countryName });
    setHighlightedCountry({ countryCode, countryName });
    
    // Create search modal - first get region info
    const region = COUNTRY_REGIONS[countryCode.toUpperCase()] as EsportsRegion | undefined;
    const finalRegion = region || (countryName.toLowerCase() === 'kosovo' ? EsportsRegion.EUROPE : null);
    
    // Set search modal with protection for 5 seconds
    setSearchModal({
      name: countryName,
      region: finalRegion,
      countryCode: countryCode,
      isProtected: true,
      isPersistent: false
    });
    
    // After 5 seconds, make it persistent but no longer protected
    setTimeout(() => {
      setSearchModal(prev => prev ? {
        ...prev,
        isProtected: false,
        isPersistent: true
      } : null);
    }, 5000);
    
    // Don't auto-clear highlighting - let it follow modal logic
    // highlighting will be managed by hover interactions
    
    // Clear the search target after a short delay to allow the zoom to complete
    setTimeout(() => setSearchZoomTarget(null), 1000);
  };

  // Function to get the main region for a sub-region
  const getMainRegion = (subRegion: EsportsRegion): string => {
    switch (subRegion) {
      case EsportsRegion.NORTH_AMERICA:
      case EsportsRegion.SOUTH_AMERICA:
        return 'Americas';
      case EsportsRegion.EUROPE:
      case EsportsRegion.MENA:
        return 'Europe';
      case EsportsRegion.ASIA:
      case EsportsRegion.OCEANIA:
      case EsportsRegion.AFRICA_NON_MENA:
        return 'Asia-Pacific';
      case EsportsRegion.ANTARCTICA:
        return 'None';
      default:
        return subRegion;
    }
  };

  // Function to get country code for flag API (convert from numeric or country name)
  // Flag loading logic moved to @/utils/flagUtils

  return (
    <ErrorBoundary 
      level="app" 
      name="Esports World Map" 
      onError={(error, errorInfo) => {
        errorReporter.reportBoundaryError(error, errorInfo, 'app', 'Main App');
      }}
    >
      <div className={`min-h-screen ${currentTheme.mainBg} relative`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-3 right-3 md:top-6 md:right-6 z-50 p-2 md:p-3 ${currentTheme.buttons} rounded-xl md:rounded-2xl transition-colors duration-200 group`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <svg className={`w-4 h-4 md:w-5 md:h-5 ${currentTheme.primaryText} group-hover:text-yellow-400 transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className={`w-4 h-4 md:w-5 md:h-5 ${currentTheme.primaryText} group-hover:text-blue-400 transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
      
      {/* Framer-style Dot Pattern Background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${currentTheme.pageDots.color}' fill-opacity='${currentTheme.pageDots.opacity}'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="relative max-w-7xl mx-auto p-2 md:p-4">
        <header className="text-center mb-4 md:mb-6">
          {/* Simplified Badge */}
          <div className={`inline-flex items-center gap-2 ${currentTheme.badge} rounded-full px-3 py-1 mb-3 shadow-sm ${isDark ? 'bg-gradient-to-br from-gray-800/96 to-gray-850/85 border border-gray-700/50' : 'bg-gradient-to-br from-orange-50/96 to-orange-100/75 border border-orange-200/60'}`}>
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-sm shadow-emerald-400/50"></div>
            <span className={`text-xs font-medium ${currentTheme.badgeText} font-mono tracking-wider uppercase`}>Live Interactive Map</span>
          </div>
          
          {/* Hero Title */}
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${currentTheme.gradientText} bg-clip-text text-transparent mb-2 leading-tight font-display tracking-tight`}>
            Valve Regional <span className={`${currentTheme.emeraldAccent} font-heading font-black`}>Assignment Map</span>
          </h1>
          
          {/* Search Component */}
          <div className="max-w-md mx-auto mb-3 md:mb-4 mt-2 md:mt-3">
            <SearchErrorBoundary>
              <CountrySearch 
                onCountrySelect={handleCountrySearch}
                className="w-full"
              />
            </SearchErrorBoundary>
          </div>
        </header>

        {/* Optimized Map Container */}
        <div className={`${currentTheme.mapContainer} border ${currentTheme.mapContainerBorder} rounded-2xl md:rounded-3xl h-[60vh] sm:h-[65vh] md:h-[75vh] flex items-center justify-center relative shadow-lg overflow-hidden`}>
          {/* Optimized Maximize Button */}
          <button
            onClick={openFullscreen}
            className={`absolute top-2 right-2 md:top-4 md:right-4 p-2 md:p-3 ${currentTheme.buttons} rounded-xl md:rounded-2xl transition-colors duration-200 z-20 group`}
            title="Maximize Map"
          >
            <svg
              className={`w-4 h-4 md:w-5 md:h-5 ${currentTheme.secondaryText} group-hover:${currentTheme.primaryText} transition-colors`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          {/* Enhanced Legend Control Panel - Desktop Only */}
          {!isMobile && (
            <div className="absolute bottom-6 left-6 z-20">
              <ControlPanel
                selectedRegions={selectedRegions}
                onRegionToggle={handleRegionToggle}
                onClearAll={handleClearAllRegions}
                hoveredCountry={hoveredCountry}
                isMobile={false}
              />
            </div>
          )}

          <MapErrorBoundary>
            <WorldMap
              selectedRegions={selectedRegions}
              hoveredCountry={hoveredCountry?.name || null}
              onCountryHover={handleCountryHover}
              searchZoomTarget={searchZoomTarget}
              highlightedCountry={highlightedCountry}
            />
          </MapErrorBoundary>
        </div>

        {/* Mobile Control Panel - Below Map */}
        {isMobile && (
          <div className="mt-4">
            <ControlPanel
              selectedRegions={selectedRegions}
              onRegionToggle={handleRegionToggle}
              onClearAll={handleClearAllRegions}
              hoveredCountry={hoveredCountry}
              isMobile={true}
            />
          </div>
        )}
      </div>

      {/* Enhanced Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className={`fixed inset-0 ${currentTheme.mainBg} z-50 flex items-center justify-center transition-all duration-300 ease-in-out ${
            isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <div 
            className={`w-full h-full relative flex items-center justify-center transition-all duration-300 ease-in-out ${
              isAnimating ? 'scale-95' : 'scale-100'
            }`}
          >
            {/* Framer-style Background Pattern for Fullscreen */}
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${currentTheme.pageDots.color}' fill-opacity='${currentTheme.pageDots.opacity}'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
            
            {/* Optimized Close Button */}
            <button
              onClick={closeFullscreen}
              className={`absolute top-2 right-2 md:top-6 md:right-6 p-3 md:p-4 ${currentTheme.closeButton} rounded-xl md:rounded-2xl transition-colors duration-200 z-20 group`}
              title="Exit Fullscreen"
            >
              <svg
                className={`w-5 h-5 md:w-6 md:h-6 ${currentTheme.secondaryText} group-hover:${currentTheme.primaryText} transition-colors`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Search in Fullscreen */}
            <div className="absolute top-2 left-2 md:top-6 md:left-6 z-20">
              <SearchErrorBoundary>
                <CountrySearch 
                  onCountrySelect={handleCountrySearch}
                  className="w-48 md:w-64"
                />
              </SearchErrorBoundary>
            </div>

            {/* Enhanced Legend in Fullscreen */}
            <div className="absolute bottom-2 left-2 md:bottom-6 md:left-6 z-20">
              <ControlPanel
                selectedRegions={selectedRegions}
                onRegionToggle={handleRegionToggle}
                onClearAll={handleClearAllRegions}
                hoveredCountry={hoveredCountry}
                isMobile={isMobile}
              />
            </div>
            
            {/* Fullscreen Map with Glass Container */}
            <div 
              className={`w-full h-full flex items-center justify-center p-2 transition-all duration-500 ease-in-out delay-150 relative ${
                isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
            >
              <div className={`w-full h-full ${currentTheme.mapContainer} rounded-3xl border ${currentTheme.mapContainerBorder} flex items-center justify-center overflow-hidden`}>
                <MapErrorBoundary>
                  <WorldMap
                    selectedRegions={selectedRegions}
                    hoveredCountry={hoveredCountry?.name || null}
                    onCountryHover={handleCountryHover}
                    searchZoomTarget={searchZoomTarget}
                    highlightedCountry={highlightedCountry}
                  />
                </MapErrorBoundary>
              </div>
              
              {/* Hover Modal inside Fullscreen */}
              {(searchModal || hoveredCountry) && (() => {
                // Prioritize search modal over hover modal for fullscreen too
                const modalData = searchModal || hoveredCountry;
                if (!modalData) return null;
                
                return (
                  <div 
                    className="absolute pointer-events-none z-10 bg-white rounded-2xl shadow-lg border border-gray-300 p-4 min-w-[220px]"
                    style={{
                      left: mousePosition.x + 15,
                      top: mousePosition.y - 10,
                      transform: mousePosition.x > (typeof window !== 'undefined' ? window.innerWidth - 250 : 1000) ? 'translateX(-100%)' : 'none'
                    }}
                  >
                  <div className="flex items-start gap-3">
                    {/* Country Flag */}
                    <div className="flex-shrink-0">
                      <img
                        src={getFlagUrl(modalData.countryCode, modalData.name)}
                        alt={`${modalData.name} flag`}
                        className="rounded w-6 h-4 object-cover"
                        loading="lazy"
                        onError={createFlagErrorHandler(modalData.countryCode, modalData.name)}
                      />
                    </div>
                    
                    {/* Country Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-gray-900 text-base">{modalData.name}</h3>
                      {modalData.region ? (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm text-gray-700">
                            <span className="font-heading font-semibold">Region:</span>
                            <span className="ml-2 text-gray-600 font-sans">{getMainRegion(modalData.region)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <span className="font-heading font-semibold">Sub-region:</span>
                            <span className="ml-2 text-gray-600 font-sans">{modalData.region}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 mt-2 font-sans">Not assigned to any region</div>
                      )}
                    </div>
                  </div>
                </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Optimized Country Hover Modal - Only show when not fullscreen */}
      {(searchModal || hoveredCountry) && !isFullscreen && (() => {
        // Prioritize search modal over hover modal
        const modalData = searchModal || hoveredCountry;
        if (!modalData) return null;
        
        return (
          <div 
            className="fixed pointer-events-none z-30 bg-white rounded-2xl shadow-lg border border-gray-300 p-4 min-w-[220px]"
            style={{
              left: mousePosition.x + 15,
              top: mousePosition.y - 10,
              transform: mousePosition.x > (typeof window !== 'undefined' ? window.innerWidth - 250 : 1000) ? 'translateX(-100%)' : 'none'
            }}
          >
            <div className="flex items-start gap-3">
              {/* Country Flag */}
              <div className="flex-shrink-0">
                <img
                  src={getFlagUrl(modalData.countryCode, modalData.name)}
                  alt={`${modalData.name} flag`}
                className="rounded w-6 h-4 object-cover"
                loading="lazy"
                onError={createFlagErrorHandler(modalData.countryCode, modalData.name)}
              />
            </div>
            
            {/* Country Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-bold text-gray-900 text-base">{modalData.name}</h3>
              {modalData.region ? (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="font-heading font-semibold">Region:</span>
                    <span className="ml-2 text-gray-600 font-sans">{getMainRegion(modalData.region)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="font-heading font-semibold">Sub-region:</span>
                    <span className="ml-2 text-gray-600 font-sans">{modalData.region}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 mt-2 font-sans">Not assigned to any region</div>
              )}
            </div>
          </div>
        </div>
        );
      })()}
      </div>
      
      {/* Development Error Testing */}
      <ErrorTester />
    </ErrorBoundary>
  );
}
