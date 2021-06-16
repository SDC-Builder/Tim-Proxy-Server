const express = require('express');
const path = require('path');
const axios = require('axios').default;
const fs = require('fs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
import StyleContext from 'isomorphic-style-loader/StyleContext'
// require('newrelic');

const app = express();
const PORT = 3000;

// import About component
const { About } = require('../src/About');

console.log(About);

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

// No SSR
// app.get('/:id', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
// });

// SSR
app.get('/:id', async (req, res) => {
  // fetch data from service
  const { data } = await axios.get(`http://localhost:3002/api/about/${req.params.id}`);

  let indexHTML = fs.readFileSync(path.resolve(__dirname, '../public', 'index.html'), {
    encoding: 'utf8',
  });

  const css = new Set() // CSS for all rendered React components
  const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()))
  let appHTML = ReactDOMServer.renderToString(
      <StyleContext.Provider value={{ insertCss }}>
        <About state={data}/>
      </StyleContext.Provider>
    );

  console.log('this is the appHTML');
  console.log(appHTML);
  console.log(css);

  // indexHTML = indexHTML.replace('<style></style>', `<style>${[...css].join('')}</style>`);
  indexHTML = indexHTML.replace('<div id="about" class="spaced"></div>', `<div id="about" class="spaced"> ${appHTML} </div>`);

  res.contentType('text/html');
  res.status(200);
  return res.send(indexHTML);
});

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Proxy listening at port ${PORT}`);
});
