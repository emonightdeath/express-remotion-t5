const express = require('express');
const path = require('path');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
//const { MyComposition } = require('./src/HelloWorld'); // Ensure this is correctly exported
const app = express();
const port = 8080;

app.use(express.json()); // Ensure JSON request bodies are parsed

app.set('view engine', 'ejs');

const getWords = async function() {
  try {
    const response = await fetch("https://function-ee-upload-on-timer.1j0zonwxeqd3.us-east.codeengine.appdomain.cloud");
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data)
    console.log(typeof data.str);
    console.log(data.str);
    return data.str;
  } catch (error) {
    console.error('Error fetching API:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        error: 'Failed to fetch data from the API',
      },
    };
  }
};

const date = new Date() // will change nomenclature
const fileName = `TypeSpeed Generated ${date.getMonth()}-${date.getDate()}-${date.getFullYear()} ${date.getHours()} ${date.getMinutes()}`;

app.get('/', async (req, res) => {
  res.render('init')
})

// Route to trigger video generation
app.get('/generate-video', async (req, res) => {
  const inputProps = {
    fullString: await getWords(),
  }
  
  try {
    // Bundle the Remotion project
    const serveUrl = await bundle({
      entryPoint: path.join(process.cwd(), './src/index.ts'),
      webpackOverride: (config) => config,
    });

    const composition = await selectComposition({
      serveUrl,
      id: "TypeSpeedTest",
      inputProps,
    })

    const filePath = path.join(process.cwd(), `public/${fileName}.mp4`);
    const downloadLink = `/download/${fileName}.mp4`

    // Render the video
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation: filePath,
      inputProps,
    });

    console.log('fuck yessssss!!!!')
    res.render('success', {downloadLink});
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).send('Error generating video');
  }
});

app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const file = path.join(__dirname, 'public', filename);

  res.download(file, (err) => {
    if (err) {
      console.error(`Error downloading file ${file}:`, err);
      res.status(500).send('Error downloading file');
    }
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
