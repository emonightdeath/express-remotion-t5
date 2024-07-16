const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const {
    SCOPES,
    CREDENTIALS_DIR,
    CLIENT_PATH,
    TOKEN_PATH,
} = require('./constants')

function logFilesInDirectory(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            return console.error(`Unable to scan directory: ${err}`);
        }
        console.log(`Files in ${directory}:`);
        files.forEach(file => {
            console.log(file);
        });
    });
}

function autho(credentials) { // function consolidates the generation of auth link and prompt for token
    
    var clientSecret = credentials.web.client_secret;
    var clientId = credentials.web.client_id;
    var redirectUrl = credentials.web.redirect_uris[0];
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });

    console.log(`Authorize this app by visiting this url:\n\n%c${authUrl}\n\n`, "color: blue; text-decoration: underline;");

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            console.log('Successfully authenticated.');
            //listFiles(oauth2Client);
            //callback(oauth2Client);
        });
    });

}

function storeToken(token) {
    try {
        fs.mkdirSync(CREDENTIALS_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
        throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) throw err;
        console.log('Token stored to ' + TOKEN_PATH);
    });
}

function listFiles(auth) {
    const service = google.drive({version: 'v3', auth: auth});
    service.files.list({}, function(err1, response1) {
        if (err1) {
            console.log('The API returned an error: ' + err1);
            return;
        }

        var fileId = response1.data.files[0].id
        console.log(fileId);
        const dest = fs.createWriteStream(process.cwd() + '/downloads/momo.mov');
        
        service.files.get({
            fileId: fileId,
            alt: "media"
        }, 
        {
            responseType: "stream"
        },
        function(err2, response2) {
            if (err2) {
                console.log('The API returned an error: ' + err2);
                return;
            }
            console.log(response2);
            response2.data
                .on('end', () => {
                    console.log('File download complete.');
                })
                .on('error', (err) => {
                    console.log('Error during download', err);
                })
                .pipe(dest);
        })
    })    
}

function insertYouTube(auth) {
    const driveService = google.drive({ version: 'v3', auth });
    const youtubeService = google.youtube('v3');
    //var service = google.youtube('v3');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Paste Drive ID Here: ', function(code) {
        rl.close();
        const fileId = code;

        driveService.files.get({
            fileId: fileId,
            alt: "media"
        }, {
            responseType: "stream"
        }, function(err2, response2) {
            if (err2) {
                console.log('The API returned an error: ' + err2);
                return;
            }
    
            youtubeService.videos.insert({
                auth: auth,
                part: 'snippet,status',
                requestBody: {
                    snippet: {
                        title: "test title2",
                        description: "test description2",
                        tags: [],
                    },
                    status: {
                        privacyStatus: "private"
                    }
                },
                media: {
                    body: response2.data
                }
            }, function(err3, response3) {
                if (err3) {
                    console.log('The API returned an error: ' + err3);
                    return;
                }
                console.log('Upload successful! Video ID: ' + response3.data.id);
            });
        });
    });
}

function listFilesAndUploadToYouTube(auth) {
    const driveService = google.drive({ version: 'v3', auth });
    const youtubeService = google.youtube('v3');

    driveService.files.list({}, function(err1, response1) {
        if (err1) {
            console.log('The API returned an error: ' + err1);
            return;
        }

        const fileId = "1jhSs3znHS-dnIVj11t_Aw3SmSy55zmJu"; // momo.mov

        driveService.files.get({
            fileId: fileId,
            alt: "media"
        }, {
            responseType: "stream"
        }, function(err2, response2) {
            if (err2) {
                console.log('The API returned an error: ' + err2);
                return;
            }

            youtubeService.videos.insert({
                auth: auth,
                part: 'snippet,status',
                requestBody: {
                    snippet: {
                        title: "test title",
                        description: "test description",
                        tags: [],
                    },
                    status: {
                        privacyStatus: "private"
                    }
                },
                media: {
                    body: response2.data
                }
            }, function(err3, response3) {
                if (err3) {
                    console.log('The API returned an error: ' + err3);
                    return;
                }
                console.log('Upload successful! Video ID: ' + response3.data.id);
            });
        });
    });
}

// Ensure you have your authentication code here to call listFilesAndUploadToYouTube with the auth object


function getChannel(auth) {
    var service = google.youtube('v3');
    service.channels.list({
        auth: auth,
        part: 'snippet,contentDetails,statistics',
        forUsername: 'GoogleDevelopers'
    }, function(err, response) {
        if (err) {
        console.log('The API returned an error: ' + err);
        return;
        }
        var channels = response.data.items;
        if (channels.length == 0) {
        console.log('No channel found.');
        } else {
        console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                    'it has %s views.',
                    channels[0].id,
                    channels[0].snippet.title,
                    channels[0].statistics.viewCount);
        }
    });
}

async function getPokemonData(auth, dexArr) {
    var service = google.sheets({version: 'v4', auth});

    try {
        var fullSheet = await service.spreadsheets.values.get({
            spreadsheetId: "1Sc9k7Y01tSCKTR_mk5dJ8iljG4jqUihgaoe-BzsV_dU",
            range: 'Reorder!A2:P',
        })
        var values = fullSheet.data.values;
        console.log(fullSheet.data.values[569]);
        console.log(fullSheet.data.values[26]);
        console.log(fullSheet.data.values[372]);
        console.log(fullSheet.data.values[751]);
        console.log(fullSheet.data.values[252]);
        console.log(fullSheet.data.values[161]);

        return [
            values[569][15],
            values[26][15],
            values[372][15],
            values[751][15],
            values[252][15],
            values[161][15]
        ]
    } catch (error) {
        console.log(error)
    }

    
}

module.exports = {
    logFilesInDirectory,
    storeToken,
    getChannel,
    autho,
    listFiles,
    listFilesAndUploadToYouTube,
    insertYouTube,
    getPokemonData,
}