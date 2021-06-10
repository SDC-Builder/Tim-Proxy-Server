const express = require('express');
const path = require('path');
const axios = require('axios').default;
// require('newrelic');

const app = express();
const PORT = 3000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(express.static(path.resolve(__dirname, '../public')));

app.get('/hi', (req, res) => {
  res.send('Hello World!');
});

app.get('/about/bundle.js', async (req, res) => {
  try {
    const { data } = await axios.get('http://localhost:3002/bundle.js');
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/about/:id', async (req, res) => {
  try {
    const { data } = await axios.get(`http://localhost:3002/api/about/${req.params.id}`);
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/:id', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Proxy listening at port ${PORT}`);
});
