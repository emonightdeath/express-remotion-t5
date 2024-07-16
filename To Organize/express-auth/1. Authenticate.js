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
    getChannel
} = require('./functions')

const {
    SCOPES,
    CREDENTIALS_DIR,
    CLIENT_PATH,
    TOKEN_PATH,
} = require('./constants')

fs.readFile(CLIENT_PATH, function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    
    // Authorize a client with the loaded credentials, then call the YouTube API.
    autho(JSON.parse(content), getChannel);
});

app.get('/oauthcallback', (req, res) => {
    //logFilesInDirectory(TOKEN_DIR);
    const authToken = req.query.code;
    res.send(`<html>
                <body style="margin: auto">
                  <h1>Authorization Token</h1>
                  <input type="text" value="${authToken}" id="authToken" readonly />
                  <button onclick="copyToken()">Copy Token</button>
                  <script>
                    function copyToken() {
                      const tokenField = document.getElementById('authToken');
                      tokenField.select();
                      document.execCommand('copy');
                      alert('Token copied to clipboard');
                    }
                  </script>
                </body>
              </html>`);
});

app.get('/', (req, res) => {
    res.send(`<html>
                <body>
                  <h1>Authorization Token</h1>
                  <a href="" id="authUrl">Hold horses/a>
                </body>
              </html>`);
});

app.post('/api/data', (req, res) => {
    const data = req.body;
    // Process data...
    res.json({ message: 'Data received', data });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});