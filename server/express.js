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

const state = {
  course_id: 1,
  recent_views: 5089115,
  description: 'Dicta doloremque illum voluptatibus voluptatem ipsam cumque. Voluptas ad excepturi nihil sit provident omnis veritatis in officiis. Illo libero voluptas vel hic at unde et aut ducimus. Praesentium ipsa repellat adipisci vitae aut neque. Ab id voluptatum qui ducimus quia. Libero nostrum soluta dolorem aut non voluptas nihil dolores cupiditate. Quia explicabo fugit rerum. Tempore quo unde animi qui. Voluptatem et aspernatur amet et aut. Vel consequatur accusantium adipisci aut rerum dolor cum error. Inventore adipisci debitis fuga molestias. Sint consequuntur veritatis officiis provident adipisci hic. Aperiam ratione sit voluptas perspiciatis doloremque. Odit voluptatum eveniet repudiandae distinctio illum harum voluptates consequuntur. Sint illum tenetur animi nam consequatur necessitatibus placeat sunt. Repellendus adipisci pariatur praesentium dolores. Sed aperiam eum placeat. In consequatur fugiat. Ipsam ab aperiam sapiente enim. Ad vitae veritatis dolorum culpa eos aliquid quas inc',
  learner_career_outcomes: [
    {
      icon: 'careerDirectionSVG',
      pct: 0.88,
      outcome: 'started a new career after completing these courses'
    },
    {
      icon: 'careerBenefitSVG',
      pct: 0.93,
      outcome: 'got a tangible career benefit from this course'
    },
    {
      icon: 'careerPromotionSVG',
      pct: 0.77,
      outcome: 'got a pay increase or promotion'
    }
  ],
  metadata: [
    {
      icon: 'sharableCertificateSVG',
      title: 'Shareable Certificate',
      subtitle: 'Earn a Certificate upon completion'
    },
    {
      icon: 'onlineSVG',
      title: '100% online',
      subtitle: 'Start instantly and learn at your own schedule'
    },
    {
      icon: 'deadlinesSVG',
      title: 'Flexible deadlines',
      subtitle: 'Reset deadlines in accordance to your schedule'
    },
    {
      icon: 'hoursSVG',
      title: 'Approx. 60 hours to complete',
      subtitle: ''
    },
    {
      icon: 'languagesSVG',
      title: 'English',
      subtitle: 'Subtitles: Italian, Vietnamese, German, Russian, English, Hebrew, Spanish, Hindi, Japanese, Turkish'
    }
  ],
  what_you_will_learn: [
    'Aut dolorem ea placeat consequuntur laudantium et ducimus esse cumque. Laboriosam aperiam cum et unde laudantium voluptatem praesentium repellat id.',
    'Laudantium ullam porro aut et vitae eos eligendi. Eveniet incidunt quia quas asperiores ipsa unde.',
    'Voluptatem ratione non qui nulla est commodi. Facere est quo.',
    'Illo non praesentium delectus eos ut dignissimos. Sit et suscipit.'
  ],
  skills_you_will_gain: [
    'Doloremque excepturi occaecati',
    'Sapiente et occaecati libero.',
    'Dignissimos vitae',
    'Perspiciatis eos consectetur',
    'Ut cupiditate',
    'Odio esse',
    'Modi nam odio delectus.',
    'Excepturi sed'
  ]
}

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
app.get('/:id', (req, res) => {
  let indexHTML = fs.readFileSync(path.resolve(__dirname, '../public', 'index.html'), {
    encoding: 'utf8',
  });

  const css = new Set() // CSS for all rendered React components
  const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()))
  let appHTML = ReactDOMServer.renderToString(
      <StyleContext.Provider value={{ insertCss }}>
        <About state={state}/>
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
