require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const shortid = require('shortid');

app.use(bodyParser.urlencoded({ extended: false }));

const urls = {};

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Endpoint to handle URL shortening
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;
  const parsedUrl = new URL(originalUrl);
  
  // Validate the URL
  dns.lookup(parsedUrl.hostname, function(err, address, family) {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      const shortUrl = shortid.generate();
      urls[shortUrl] = originalUrl;
      res.json({ original_url: originalUrl, short_url: shortUrl });
    }
  });
});

// Endpoint to handle redirection
app.get('/api/shorturl/:id', function(req, res) {
  const shortUrl = req.params.id;
  const originalUrl = urls[shortUrl];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
