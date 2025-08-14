export interface Country {
  id: string;
  name: string;
  region: EsportsRegion | null;
  isActive: boolean;
}

export enum EsportsRegion {
  AMERICAS = 'Americas',
  EUROPE = 'Europe',
  ASIA_PACIFIC = 'Asia-Pacific',
  NORTH_AMERICA = 'North America',
  SOUTH_AMERICA = 'South America',
  MENA = 'MENA',
  OCEANIA = 'Oceania',
  ASIA = 'Asia',
  ANTARCTICA = 'Antarctica',
  AFRICA_NON_MENA = 'Africa (non-MENA)'
}

export interface Tournament {
  id: string;
  name: string;
  regions: EsportsRegion[];
  countries: string[];
}

export const REGION_COLORS: Record<EsportsRegion, string> = {
  [EsportsRegion.AMERICAS]: '#FF6B6B',
  [EsportsRegion.EUROPE]: '#4ECDC4',
  [EsportsRegion.ASIA_PACIFIC]: '#45B7D1',
  [EsportsRegion.NORTH_AMERICA]: '#FF8C42',
  [EsportsRegion.SOUTH_AMERICA]: '#FFA07A',
  [EsportsRegion.MENA]: '#F7DC6F',
  [EsportsRegion.OCEANIA]: '#98D8C8',
  [EsportsRegion.ASIA]: '#6A5ACD',
  [EsportsRegion.ANTARCTICA]: '#87CEEB',
  [EsportsRegion.AFRICA_NON_MENA]: '#228B22'
};