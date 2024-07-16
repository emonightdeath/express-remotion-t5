const fs = require('fs');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const readline = require('readline');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const { 
    logFilesInDirectory,
    autho,
    getChannel,
    listFiles,
    listFilesAndUploadToYouTube,
    insertYouTube,
} = require('./functions')

const {
    SCOPES,
    CREDENTIALS_DIR,
    CLIENT_PATH,
    TOKEN_PATH,
} = require('./constants')

fs.readFile(CLIENT_PATH, function (err1, content1) {
    if (err1) {
      console.log('Error1 loading client: ' + err1);
      return;
    }

    const credentials = JSON.parse(content1);
    
    fs.readFile('./credentials/auth_token.json', function (err2, content2) {
        if (err2) {
            console.log('Error2 loading token: ' + err2);
            return;
        }

        var clientSecret = credentials.web.client_secret;
        var clientId = credentials.web.client_id;
        var redirectUrl = credentials.web.redirect_uris[0];
        var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
        oauth2Client.credentials = JSON.parse(content2);

        //listFiles(oauth2Client);
        //listFilesAndUploadToYouTube(oauth2Client);
        insertYouTube(oauth2Client);
    })
});