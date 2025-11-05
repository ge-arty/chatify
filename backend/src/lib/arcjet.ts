import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';
import { ENV } from './env.js';

if (!ENV.ARCJET_KEY) {
  throw new Error('ARCJET_KEY not defined in environment variables');
}

const aj = arcjet({
  key: ENV.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks (e.g. SQL injection)
    shield({ mode: 'LIVE' }),

    // Bot detection
    detectBot({
      mode: 'LIVE', // or "DRY_RUN" to test
      allow: [
        'CATEGORY:SEARCH_ENGINE',
        // "CATEGORY:MONITOR",
        // "CATEGORY:PREVIEW",
      ],
    }),

    // Rate limiting: 100 requests per minute
    slidingWindow({
      mode: 'LIVE',
      max: 100,
      interval: 60,
    }),
  ],
});

export default aj;
