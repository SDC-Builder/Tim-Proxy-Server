const express = require('express');
const path = require('path');
const axios = require('axios').default;
const fs = require('fs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { promisify } = require('util');

const app = express();
const PORT = 3000;

// cache setup
const redis = require('redis');

const client = redis.createClient({
  host: '172.31.10.128',
  port: 6379,
});
const getCache = promisify(client.get).bind(client);
const setCache = promisify(client.set).bind(client);

// import About component
const { About } = require('../src/About');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/hi', (req, res) => {
  res.send('Hello World!');
});

// Loader.io test routes
app.get('/loaderio-b5cce8ed78056fea633f38082af3c119', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'token.txt'));
});
app.get('/loaderio-0f0b671c71fa00f9eb121a3dd31083a5', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'token2.txt'));
});
app.get('/loaderio-1d93b97eba634c38967bbb88d2ac85cb', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'token3.txt'));
});

// valid route still exists for depricated proxy servers
app.get('/about/bundle.js', async (req, res) => {
  try {
    const { data } = await axios.get('http://172.31.5.204:3002/bundle.js');
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/about/:id', async (req, res) => {
  try {
    const { data } = await axios.get(`http://172.31.5.204:3002/api/about/${req.params.id}`);
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Server Side Rendering, check cache for previously rendered HTML
app.get('/:id', async (req, res) => {
  const cachedHTML = await getCache(req.params.id);
  if (cachedHTML) { return res.send(cachedHTML); }
  let indexHTML = fs.readFileSync(path.resolve(__dirname, '../public', 'index.html'), {
    encoding: 'utf8',
  });
  const { data } = await axios.get(`http://172.31.5.204:3002/api/about/${req.params.id}`);
  const appHTML = ReactDOMServer.renderToString(<About state={data} />);
  indexHTML = indexHTML.replace('<div id="about" class="spaced"></div>', `<div id="about" class="spaced"> ${appHTML} </div><script>window.__INITIAL__DATA__ = ${JSON.stringify(data)}</script>`);
  res.send(indexHTML);
  return setCache(req.params.id, indexHTML, 'EX', 60);
});

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Proxy listening at port ${PORT}`);
});
