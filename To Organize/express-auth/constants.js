const fs = require('fs');

var SCOPES = [
    'https://www.googleapis.com/auth/youtube', // 4 Youtube Scopes
    'https://www.googleapis.com/auth/youtubepartner',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/spreadsheets', // 2 Spreadsheet Scopes?
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/drive', // 3 Drive Scopes?
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file'
];
var CREDENTIALS_DIR = process.cwd() + '/credentials/';
var CLIENT_PATH = CREDENTIALS_DIR + 'client_secret.json';
var TOKEN_PATH = CREDENTIALS_DIR + 'auth_token.json';

module.exports = {
    SCOPES,
    CREDENTIALS_DIR,
    CLIENT_PATH,
    TOKEN_PATH,
}