const { getProfileInfo, fields, getProfileInfoSync, getProfileInfoAsync } = require('./profile-extractor');
const fs = require('fs');
const profiles = require('./profiles.json');

console.log('*************** Profile Extractor ***************');
console.log(`Found ${profiles.SearchResults.length} profiles`);

const csvData = fields.map(field => field.toUpperCase()).join(', ');

async function extractProfilesSync() {
    fs.writeFileSync('all-profiles.csv', csvData);

    for (let counter = 0; counter < profiles.SearchResults.length; counter++) {
        await getProfileInfoSync(profiles.SearchResults[counter].Url);
    }
};

function extractProfilesAsync() {
    // Run getProfileInfo one by one.
    // RUN THIS LINE ONLY FIRST TIME
    fs.writeFileSync('all-profiles.csv', csvData);

    console.log(`************************Processing 1st batch ************************`);
    for (let counter = 0; counter < 500; counter++) {
        getProfileInfoAsync(profiles.SearchResults[counter].Url);
    }
    console.log(`************************ 1st batch complete ************************`);


    console.log(`************************Processing 2nd batch ************************`);
    for (let counter = 500; counter < 1000; counter++) {
        // getProfileInfoAsync(profiles.SearchResults[counter].Url);
    }
    console.log(`************************ 2nd batch complete ************************`);

    console.log(`************************Processing 3rd batch ************************`);
    for (let counter = 1000; counter < 1500; counter++) {
        // getProfileInfoAsync(profiles.SearchResults[counter].Url);
    }
    console.log(`************************ 3rd batch complete ************************`);

    console.log(`************************Processing 4th batch ************************`);
    for (let counter = 1500; counter < profiles.SearchResults.length; counter++) {
        // getProfileInfoAsync(profiles.SearchResults[counter].Url);
    }
    console.log(`************************ 4th batch complete ************************`);
};

// Synchronous call -- Very Slow
extractProfilesSync();

// Asynchronous call -- Fast but need some twiking
// extractProfilesAsync();
