// Script to verify country names match between data source and our mappings
const https = require('https');

async function fetchMapData() {
  return new Promise((resolve, reject) => {
    const url = 'https://cdn.jsdelivr.net/npm/world-atlas/countries-110m.json';
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

function extractCountryNames(mapData) {
  const countries = [];
  
  if (mapData.objects && mapData.objects.countries && mapData.objects.countries.geometries) {
    mapData.objects.countries.geometries.forEach(country => {
      const id = country.id;
      const properties = country.properties || {};
      const name = properties.NAME || properties.name || properties.NAME_EN || `Country ${id}`;
      
      countries.push({
        id,
        name,
        properties
      });
    });
  }
  
  return countries;
}

async function main() {
  try {
    console.log('🌍 Fetching map data from world-atlas...');
    const mapData = await fetchMapData();
    
    console.log('📊 Extracting country information...');
    const countries = extractCountryNames(mapData);
    
    console.log(`\n📋 Found ${countries.length} countries in map data:\n`);
    
    // Sort by ID for easier reading (handle both string and numeric IDs)
    countries.sort((a, b) => {
      const aId = String(a.id || '');
      const bId = String(b.id || '');
      return aId.localeCompare(bId, undefined, { numeric: true });
    });
    
    // Group by regions for better organization
    const regions = {
      'Africa': [],
      'Asia': [],
      'Europe': [],
      'North America': [],
      'South America': [],
      'Oceania': [],
      'Other': []
    };
    
    countries.forEach(country => {
      const id = String(country.id || '').padStart(3, ' ');
      console.log(`${id}: ${country.name}`);
      
      // Try to categorize (basic heuristics)
      const name = country.name.toLowerCase();
      if (name.includes('africa') || ['nigeria', 'egypt', 'south africa', 'kenya', 'ghana', 'morocco', 'algeria', 'tunisia', 'libya', 'sudan', 'ethiopia', 'uganda', 'tanzania'].some(c => name.includes(c))) {
        regions['Africa'].push(country);
      } else if (name.includes('asia') || ['china', 'japan', 'india', 'korea', 'thailand', 'vietnam', 'indonesia', 'malaysia', 'singapore', 'philippines', 'bangladesh', 'pakistan', 'iran', 'iraq', 'afghanistan'].some(c => name.includes(c))) {
        regions['Asia'].push(country);
      } else if (name.includes('europe') || ['germany', 'france', 'italy', 'spain', 'poland', 'romania', 'netherlands', 'belgium', 'greece', 'portugal', 'czech', 'hungary', 'sweden', 'norway', 'denmark', 'finland', 'russia', 'ukraine', 'united kingdom', 'britain'].some(c => name.includes(c))) {
        regions['Europe'].push(country);
      } else if (['united states', 'canada', 'mexico', 'guatemala', 'cuba', 'jamaica', 'haiti', 'dominican', 'costa rica', 'panama', 'nicaragua', 'honduras', 'el salvador', 'belize'].some(c => name.includes(c))) {
        regions['North America'].push(country);
      } else if (['brazil', 'argentina', 'chile', 'peru', 'colombia', 'venezuela', 'bolivia', 'paraguay', 'uruguay', 'ecuador', 'guyana', 'suriname'].some(c => name.includes(c))) {
        regions['South America'].push(country);
      } else if (['australia', 'new zealand', 'fiji', 'papua', 'samoa', 'tonga', 'vanuatu', 'solomon'].some(c => name.includes(c))) {
        regions['Oceania'].push(country);
      } else {
        regions['Other'].push(country);
      }
    });
    
    console.log('\n📊 Summary by regions:');
    Object.entries(regions).forEach(([region, countries]) => {
      console.log(`${region}: ${countries.length} countries`);
    });
    
    console.log('\n🔍 Countries that might need name mapping verification:');
    
    // Look for potential naming issues
    const potentialIssues = countries.filter(country => {
      const name = country.name.toLowerCase();
      return name.includes('dem.') || 
             name.includes('rep.') || 
             name.includes('eq.') ||
             name.includes('n.') ||
             name.includes('s.') ||
             name.length < 4 ||
             name.includes('(') ||
             name.includes('[');
    });
    
    potentialIssues.forEach(country => {
      console.log(`⚠️  ${country.id}: "${country.name}" - May need full name mapping`);
    });
    
    console.log(`\n✅ Verification complete! Found ${countries.length} total countries.`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();