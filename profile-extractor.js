const request = require('request');
const fs = require('fs');
const { parse } = require('node-html-parser');

const fields = ['name', 'designation', 'org', 'location', 'directPhone', 'officePhone', 'email', 'officePage', 'gender', 'service'];

exports.fields = fields;

const fieldMappings = {
    name: {
        pattern: 'FN:'
    },
    designation: {
        pattern: 'TITLE:'
    },
    org: {
        pattern: 'ORG:'
    },
    location: {
        pattern: 'ADR;TYPE=WORK:'
    },
    directPhone: {
        pattern: 'TEL;TYPE=CELL:'
    },
    officePhone: {
        pattern: 'TEL;TYPE=WORK:'
    },
    email: {
        pattern: 'EMAIL;TYPE=INTERNET:'
    },
    officePage: {
        pattern: ''
    },
    gender: {
        pattern: 'GENDER:'
    },
    service: {
        pattern: ''
    }
};

exports.fieldMappings = fieldMappings;

const formatPhone = (phone) => {
    return phone && (new RegExp("^[\\d]+$").test(phone)) ? `(${phone.substr(0,3)}) ${phone.substr(3,3)}-${phone.substr(6)}` : '';
};

const fromVCardToObject = (vCard) => {
    const lines = vCard.split('\r\n');
    const newProfileInfo = {};
     fields.forEach(key => {
         const matchedLine = lines.find(line => line.startsWith(fieldMappings[key].pattern || '`'));
         newProfileInfo[key] = matchedLine ? matchedLine.replace(fieldMappings[key].pattern, '').replace(/[;\\]/g, ' ').trim() : '';
    });
    newProfileInfo.directPhone = formatPhone(newProfileInfo.directPhone);
    newProfileInfo.officePhone = formatPhone(newProfileInfo.officePhone);
    newProfileInfo.location = `"${newProfileInfo.location}"`;
    
    return newProfileInfo;
}

exports.getProfileInfoSync = (profileUrl) => {
    return new Promise((resolve, reject) => {
        // console.log(`Retrieving profile information for :  ${profileUrl}`);
        this.getProfileInfoAsync(profileUrl, resolve);
    });
};

exports.getProfileInfoAsync = (profileUrl, callback) => {
    request(profileUrl, (error, response, html) => {
        if (response && response.statusCode === 200) {
            const vCardUrl = `https://www.marcusmillichap.com/${html.match(/\/downloadmmvcard\/\d+/g)}`;
            // console.log('Url: ' + vCardUrl);
            request(vCardUrl, (vCardError, vCardResponse, vCard) => {
                if (vCardResponse && vCardResponse.statusCode === 200) {
                    const root = parse(html);

                    const newProfileInfo = fromVCardToObject(vCard);
                    newProfileInfo.officePage = profileUrl;
                    newProfileInfo.service = root.querySelector('.mm-agent-hero h3')?.textContent;

                    const csvData = Object.keys(newProfileInfo).map(key => newProfileInfo[key]).join(',');

                    fs.appendFileSync('all-profiles.csv', "\r\n" + csvData);
                    callback && callback(null);
                } else if (vCardError) {
                    console.log('VCardError' + vCardError);
                    callback && callback(null);
                }
            });
        } else if (error) {
            console.log('Err ' + error + ' ' + profileUrl);
            callback && callback(null);
        }
    });
};