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
    getPokemonData,
} = require('./functions')

const {
    SCOPES,
    CREDENTIALS_DIR,
    CLIENT_PATH,
    TOKEN_PATH,
} = require('./constants')

const date = new Date() // will change nomenclature
const fileName = `Pokemon Generated ${date.getMonth()}-${date.getDate()}-${date.getFullYear()} ${date.getHours()} ${date.getMinutes()}`;

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

        async function test() {
            try {
                var data = await getPokemonData(oauth2Client)
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }
        test();
        // console.log(getPokemonData(oauth2Client))
    })
});



// app.get('/generate-video', async (req, res) => {
//     const inputProps = {
//       fullString: await getWords(),
//     }
    
//     try {
//       const serveUrl = await bundle({
//         entryPoint: path.join(process.cwd(), './src/index.ts'),
//         webpackOverride: (config) => config,
//       });
  
//       const composition = await selectComposition({
//         serveUrl,
//         id: "TypeSpeedTest",
//         inputProps,
//       })
  
//       const filePath = path.join(process.cwd(), `public/${fileName}.mp4`);
//       const downloadLink = `/download/${fileName}.mp4`
  
//       await renderMedia({
//         composition,
//         serveUrl,
//         codec: 'h264',
//         outputLocation: filePath,
//         inputProps,
//       });
  
//       console.log('fuck yessssss!!!!')
//       res.render('success', {downloadLink});
//     } catch (error) {
//       console.error('Error generating video:', error);
//       res.status(500).send('Error generating video');
//     }
//   });