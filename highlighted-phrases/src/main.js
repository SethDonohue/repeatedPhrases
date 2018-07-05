'use strict';

import createWordMap from './lib/highlighter';

console.log('Hello world...');

const phraseList = {
  1: 'i walked through the woods',
  2: 'the woods talked to me',
  3: 'talked to me',
  4: 'the next week i',
  5: 'the next week',
  6: 'the quick brown fox',
  7: 'walked through the woods',
  8: 'quick brown fox',
  9: 'the lazy dog',
  10: 'through the woods talked',
};

console.log(createWordMap(phraseList));
