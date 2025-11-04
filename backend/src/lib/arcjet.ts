const arcjet = require('@arcjet/node').default; // arcjet is the default export
const { shield, detectBot, slidingWindow } = require('@arcjet/node');
const { ENV } = require('./env');

if (!ENV.ARCJET_KEY) {
  throw new Error('ARCJET_KEY not defined in environment variables');
}

const aj = arcjet({
  key: ENV.ARCJET_KEY,
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE'],
    }),
    slidingWindow({
      mode: 'LIVE',
      max: 100,
      interval: 60,
    }),
  ],
});

module.exports = aj;
