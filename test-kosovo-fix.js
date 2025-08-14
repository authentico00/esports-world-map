// Test Kosovo search fix logic
console.log('Testing Kosovo search fix logic...\n');

// Simulate the highlighting function logic
function testKosovoMatch(searchCountryCode, searchName, countryId, countryName) {
  const searchNameLower = searchName?.toLowerCase() || '';
  const currentCountryNameLower = countryName?.toLowerCase() || '';
  
  console.log(`Testing: search="${searchName}" (${searchCountryCode}) vs map="${countryName}" (${countryId})`);
  
  // Special case for Kosovo - search uses "XK" code but map has undefined ID
  if ((searchNameLower === 'kosovo' || searchCountryCode === 'XK') && 
      currentCountryNameLower === 'kosovo' && countryId === undefined) {
    console.log(`✅ Kosovo match: searching "${searchNameLower}" (code: ${searchCountryCode}) found Kosovo with undefined ID`);
    return true;
  }
  
  console.log(`❌ No match found`);
  return false;
}

// Test the exact case we're dealing with
console.log('=== Test Case 1: Kosovo search from search component ===');
const result1 = testKosovoMatch('XK', 'Kosovo', undefined, 'Kosovo');
console.log(`Result: ${result1}\n`);

console.log('=== Test Case 2: Different search term (should not match) ===');
const result2 = testKosovoMatch('US', 'United States', undefined, 'Kosovo');
console.log(`Result: ${result2}\n`);

console.log('=== Test Case 3: Kosovo with different ID (should not match) ===');
const result3 = testKosovoMatch('XK', 'Kosovo', '999', 'Kosovo');
console.log(`Result: ${result3}\n`);

console.log('Kosovo fix test completed!');