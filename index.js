const { getProfileInfo, fieldMappings, fields } = require('./profile-extractor');

const profiles = require('./profiles.json');

console.log('*************** Profile Extractor ***************');

console.log(`Found ${profiles.SearchResults.length} profiles`);

const fs = require('fs');
const csvData = fields.map(field => field.toUpperCase()).join(', ');
fs.writeFileSync('all-profiles.csv', csvData);

for(let counter = 0; counter < profiles.SearchResults.length; counter++) {
    getProfileInfo(profiles.SearchResults[counter].Url);
}

