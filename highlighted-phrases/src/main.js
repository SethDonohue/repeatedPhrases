'use strict';

import createWordMap from './lib/word-map';
import highlighter from './lib/highlighter';
import spanWrapper from './lib/span-wrapper';

console.log('Hello world...');

const phraseMap = {
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

const wordMap = createWordMap(phraseMap);

// Get all the text associated with the chosen paragraphs
//  and wrap each word in a span with classes corresponding
//  to the phrases it is in and update the dom
const allArticleParagraphs = document.querySelectorAll('.article-paragraph-target');
spanWrapper.spanWrapAll(wordMap, allArticleParagraphs);

// Get all spans with the phrase-word class and add and
//  event listener to them
const phraseWordElements = document.querySelectorAll('.phrase-word');

phraseWordElements.forEach(element => {
  element.addEventListener('mouseover', highlighter.grabClassNames);
});
