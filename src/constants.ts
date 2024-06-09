
/* IMPORT */

import {ENABLED} from 'tiny-colors';
import type {Stats} from './types';

/* MAIN */

const HAS_COLORS = ENABLED;

const NO_STATS: Stats = {
  atimeMs: 0,
  birthtimeMs: 0,
  mtimeMs: 0,
  size: 0
};

/* EXPORT */

export {HAS_COLORS, NO_STATS};
