const { getProfileInfo, fields } = require('./profile-extractor');

const profiles = require('./profiles.json');

console.log('*************** Profile Extractor ***************');

console.log(`Found ${profiles.SearchResults.length} profiles`);

const fs = require('fs');
const csvData = fields.map(field => field.toUpperCase()).join(', ');
fs.writeFileSync('all-profiles.csv', csvData);

// console.log(`************************Processing 1st batch ************************`);
// for(let counter = 0; counter < 500; counter++) {
//     getProfileInfo(profiles.SearchResults[counter].Url);
// }
// console.log(`************************ 1st batch complete ************************`);


// setTimeout(() => {
//     console.log(`************************Processing 2nd batch ************************`);
//     for(let counter = 500; counter < 1000; counter++) {
//         getProfileInfo(profiles.SearchResults[counter].Url);
//     }
//     console.log(`************************ 2nd batch complete ************************`);
// }, 20000);

// setTimeout(() => {
//     console.log(`************************Processing 3rd batch ************************`);
//     for(let counter = 1000; counter < 1500; counter++) {
//         getProfileInfo(profiles.SearchResults[counter].Url);
//     }
//     console.log(`************************ 3rd batch complete ************************`);
// }, 40000);

// setTimeout(() => {
//     console.log(`************************Processing 4th batch ************************`);
//     for(let counter = 1500; counter < profiles.SearchResults.length; counter++) {
//         getProfileInfo(profiles.SearchResults[counter].Url);
//     }
//     console.log(`************************ 4th batch complete ************************`);
// }, 60000);

async function extractProfiles() {
    // Below code causes timeout
    for (let counter = 0; counter < profiles.SearchResults.length; counter++) {
        await getProfileInfo(profiles.SearchResults[counter].Url);
    }
};

console.log(`*********** Started Profile Extraction *********************`);

extractProfiles();

console.log(`*********** Completed Profile Extraction *********************`);
