'use client';

import React, { useState } from 'react';
import { EsportsRegion, REGION_COLORS } from '@/types/esports';
import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/utils/themes';

interface ControlPanelProps {
  selectedRegions: EsportsRegion[];
  onRegionToggle: (region: EsportsRegion) => void;
  onClearAll: () => void;
  hoveredCountry: {
    name: string;
    region: EsportsRegion | null;
  } | null;
  isMobile?: boolean;
}

export default function ControlPanel({
  selectedRegions,
  onRegionToggle,
  onClearAll,
  isMobile = false
}: ControlPanelProps) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const [showSubRegional, setShowSubRegional] = useState(false);
  
  const regionalFilters = [
    EsportsRegion.AMERICAS,
    EsportsRegion.EUROPE,
    EsportsRegion.ASIA_PACIFIC
  ];
  
  const subRegionalFilters = [
    EsportsRegion.NORTH_AMERICA,
    EsportsRegion.SOUTH_AMERICA,
    EsportsRegion.MENA,
    EsportsRegion.OCEANIA,
    EsportsRegion.ASIA,
    EsportsRegion.ANTARCTICA,
    EsportsRegion.AFRICA_NON_MENA
  ];
  
  const allRegions = [...new Set([...regionalFilters, ...subRegionalFilters])];

  return (
    <div className={`${currentTheme.controlPanel} border ${currentTheme.controlPanelBorder} p-3 rounded-xl shadow-lg text-sm ${isMobile ? 'w-full max-w-none' : 'max-w-[280px]'} backdrop-blur-sm`}>
      {/* Legend Title */}
      <div className="mb-2">
        <h3 className={`text-sm font-heading font-bold ${currentTheme.primaryText} flex items-center gap-2`}>
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
          Region Filters
        </h3>
      </div>

      {/* Main Regional Filters */}
      <div className="mb-2">
        <div className={isMobile ? "grid grid-cols-2 gap-2" : "space-y-1"}>
          {regionalFilters.map(region => (
            <label key={region} className={`flex items-center cursor-pointer group ${currentTheme.hoverBg} ${isMobile ? 'p-1 text-xs' : 'p-1.5'} rounded-lg transition-colors duration-150`} onClick={() => onRegionToggle(region)}>
              {/* Custom Framer-style Checkbox */}
              <div 
                className={`relative ${isMobile ? 'w-3 h-3 mr-1.5' : 'w-4 h-4 mr-2'} rounded border-2 transition-all duration-200 cursor-pointer ${
                  selectedRegions.includes(region)
                    ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/25'
                    : theme === 'dark' 
                      ? 'border-gray-600 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-400/20' 
                      : 'border-gray-300 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-400/20'
                }`}
              >
                {selectedRegions.includes(region) && (
                  <svg 
                    className="absolute inset-0 w-full h-full text-white p-0.5 transition-all duration-200"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div 
                className={`${isMobile ? 'w-2 h-2 mr-1.5' : 'w-2.5 h-2.5 mr-2'} rounded ring-1 ring-white/30`}
                style={{ backgroundColor: REGION_COLORS[region] }}
              />
              <span className={`text-xs ${currentTheme.secondaryText} font-sans font-medium group-hover:${currentTheme.primaryText} transition-colors`}>{region}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sub-Regional Filters */}
      <div>
        <div 
          className={`flex items-center justify-between cursor-pointer mb-2 p-1.5 rounded-lg ${currentTheme.hoverBg} transition-colors group`}
          onClick={() => setShowSubRegional(!showSubRegional)}
        >
          <h3 className={`text-xs font-heading font-bold ${currentTheme.secondaryText} group-hover:${currentTheme.primaryText} transition-colors`}>Sub-Regional</h3>
          <svg
            className={`w-3 h-3 ${currentTheme.tertiaryText} group-hover:${currentTheme.primaryText} transition-all duration-200 ${showSubRegional ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        <div 
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            showSubRegional ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className={isMobile ? "grid grid-cols-2 gap-2 mb-3" : "space-y-1 mb-3"}>
            {subRegionalFilters.map(region => (
              <label key={region} className={`flex items-center cursor-pointer group ${currentTheme.hoverBg} ${isMobile ? 'p-1 text-xs' : 'p-1.5'} rounded-lg transition-colors duration-150`} onClick={() => onRegionToggle(region)}>
                {/* Custom Framer-style Checkbox */}
                <div 
                  className={`relative ${isMobile ? 'w-3 h-3 mr-1.5' : 'w-4 h-4 mr-2'} rounded border-2 transition-all duration-200 cursor-pointer ${
                    selectedRegions.includes(region)
                      ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/25'
                      : theme === 'dark' 
                        ? 'border-gray-600 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-400/20' 
                        : 'border-gray-300 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-400/20'
                  }`}
                >
                  {selectedRegions.includes(region) && (
                    <svg 
                      className="absolute inset-0 w-full h-full text-white p-0.5 transition-all duration-200"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={3} 
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <div 
                  className="w-2.5 h-2.5 rounded mr-2 ring-1 ring-white/30"
                  style={{ backgroundColor: REGION_COLORS[region] }}
                />
                <span className={`text-xs ${currentTheme.tertiaryText} font-sans font-medium group-hover:${currentTheme.primaryText} transition-colors`}>{region}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Clear/Select All */}
        <div className={`mt-2 pt-2 border-t ${currentTheme.controlPanelBorder}`}>
          <div className="flex gap-1.5">
            <button
              onClick={() => allRegions.forEach(region => {
                if (!selectedRegions.includes(region)) {
                  onRegionToggle(region);
                }
              })}
              className="flex-1 px-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 rounded-lg text-xs font-heading font-medium transition-colors duration-150 text-white cursor-pointer"
            >
              All
            </button>
            <button
              onClick={onClearAll}
              className="flex-1 px-2 py-1.5 bg-red-600 hover:bg-red-500 border border-red-500 rounded-lg text-xs font-heading font-medium transition-colors duration-150 text-white cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}