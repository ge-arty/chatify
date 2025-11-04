// src/lib/arcjet.ts
import { ENV } from '../lib/env';

type ArcjetPkg = typeof import('@arcjet/node');
type ArcjetInstance = Awaited<ReturnType<ArcjetPkg['default']>>;

let ajInstance: ArcjetInstance | null = null;
let ajInitPromise: Promise<ArcjetInstance> | null = null;

export async function initArcjet(): Promise<ArcjetInstance> {
  if (ajInstance) return ajInstance;
  if (ajInitPromise) return ajInitPromise;

  ajInitPromise = (async () => {
    const arcjetPkg: ArcjetPkg = await import('@arcjet/node');
    const arcjet = arcjetPkg.default;
    const { shield, detectBot, slidingWindow } = arcjetPkg;

    if (!ENV.ARCJET_KEY) throw new Error('ARCJET_KEY not defined');

    ajInstance = arcjet({
      key: ENV.ARCJET_KEY,
      rules: [
        shield({ mode: 'LIVE' }),
        detectBot({ mode: 'LIVE', allow: ['CATEGORY:SEARCH_ENGINE'] }),
        slidingWindow({ mode: 'LIVE', max: 100, interval: 60 }),
      ],
    });

    return ajInstance;
  })();

  return ajInitPromise;
}

export function getArcjet(): Promise<ArcjetInstance> {
  return initArcjet();
}
