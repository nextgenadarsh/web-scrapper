const { fields, getProfileInfoSync } = require('./profile-extractor');
const profiles = require('./profiles.json');
const fs = require('fs');

const allProfiles = profiles.SearchResults;
console.log(allProfiles.length);

const csvData = fields.map(field => field.toUpperCase()).join(', ');
fs.writeFileSync('all-profiles.csv', csvData);

const batchSize = 200;

const processBatch = (startIndex, endIndex) => {
    console.log(`Started Batch | Start: ${startIndex} | End: ${endIndex}`);

    const promises = profiles.SearchResults
        .slice(startIndex, endIndex)
        .map(profile => getProfileInfoSync(profile.Url));

    Promise.all(promises).then(() => {
        console.log(`Completed Batch | Start: ${startIndex} | End: ${endIndex}`);
        if(endIndex < allProfiles.length) {
            processBatch(startIndex+batchSize, endIndex+batchSize);
        } else {
            console.log(`All Finished: ${endIndex} >= ${allProfiles.length}`);
        }
    });
};

processBatch(0, batchSize-1);
