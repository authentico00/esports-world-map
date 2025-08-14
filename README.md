# Esports World Map

An interactive esports world map visualization for Valve's VRS regional assignments for the Counter-Strike 2 professional circuit, built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🗺️ Interactive World Map

- SVG-based world map using react-simple-maps
- Mouse hover interactions showing country details
- Smooth animations and responsive design

### 🎮 Esports Region System

Color-coded regional assignments based on **Valve's Regional Standings (VRS)** for Counter-Strike 2:

- **North America** (Red) - USA, Canada, Mexico
- **Europe** (Teal) - Major European countries including UK, Germany, France, etc.
- **Asia** (Blue) - China, Japan, Korea, Southeast Asia, India
- **South America** (Orange) - Brazil, Argentina, Chile, Colombia, etc.
- **Oceania** (Light Green) - Australia, New Zealand, Pacific Islands
- **MENA** (Yellow) - Turkey, Saudi Arabia, Israel, UAE, etc.
- **Africa (Non-MENA)** (Purple) - South Africa and other African countries

Regional data sourced from Valve's official [Counter-Strike Regional Standings](https://github.com/ValveSoftware/counter-strike_regional_standings) repository.

### 🎛️ Interactive Controls

- **Region Checkboxes** - Toggle individual regions on/off
- **Select All/Clear All** - Bulk region management
- **Country Information Panel** - Real-time hover details

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Map Library**: react-simple-maps + d3-geo
- **State Management**: React useState hooks

## Project Structure

```
src/
├── types/esports.ts          # TypeScript interfaces and enums
├── data/countries.ts         # Country-region mappings and tournaments
├── components/
│   ├── WorldMap.tsx         # Interactive map component
│   └── ControlPanel.tsx     # Filters and country info display
└── app/page.tsx             # Main application page
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd esports-world-map
```

2. Install dependencies:

```bash
npm install
npm install react-simple-maps d3-geo --legacy-peer-deps
```

3. Start the development server:

```bash
npm run dev
# or
npx next dev --turbopack
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Basic Interaction

1. **Hover over countries** to see their name and regional assignment
2. **Use tournament filters** to quickly select regions for specific tournaments
3. **Toggle individual regions** using the checkboxes in the control panel
4. **Select/Clear All** buttons for bulk region management


## Development

### Building for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Known Issues

- react-simple-maps compatibility with React 19 requires `--legacy-peer-deps` flag
- Map projection is optimized for desktop viewing
- Some smaller countries may be difficult to hover on mobile

## Attribution

### Regional Data

This project uses regional assignment data from [Valve Corporation's Counter-Strike Regional Standings](https://github.com/ValveSoftware/counter-strike_regional_standings) repository, integrated via Git submodule. The regional assignments reflect Valve's official Valve Regional Standings (VRS) system for Counter-Strike 2 professional tournaments.

### Map Data

World map geographic data provided by [react-simple-maps](https://github.com/zcreativelabs/react-simple-maps), which uses Natural Earth map data.

## License

This project is open source and available under the [MIT License](LICENSE).

**Note**: While this project is MIT licensed, the regional data is sourced from Valve's repository and remains subject to their terms. Please refer to the [Valve Counter-Strike Regional Standings repository](https://github.com/ValveSoftware/counter-strike_regional_standings) for their licensing terms.
