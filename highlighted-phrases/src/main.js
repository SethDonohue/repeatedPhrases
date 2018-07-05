'use strict';

import createWordMap from './lib/highlighter';
import spanWrapper from './lib/span-wrapper';

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

const wordMap = createWordMap(phraseList);

// Grab all the text associated with the chosen paragraphs
const allArticleParagraphs = document.querySelectorAll('.article-paragraph-target');

// Wrap each word in a span and update the dom
spanWrapper(wordMap, allArticleParagraphs);

