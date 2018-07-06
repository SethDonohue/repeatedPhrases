'use strict';

import Controller from './lib/control';
// import highlighter from './lib/highlighter';
// import spanWrapper from './lib/span-wrapper';

console.log('Hello world...');

// const phraseMap = {
//   1: {
//     phrase: 'i walked through the woods',
//     length: 5,
//   },
//   2: {
//     phrase: 'the woods talked to me',
//     length: 5,
//   },
//   3: {
//     phrase: 'talked to me',
//     length: 3,
//   },
//   4: {
//     phrase: 'the next week i',
//     length: 4,
//   },
//   5: {
//     phrase: 'the next week',
//     length: 3,
//   },
//   6: {
//     phrase: 'the quick brown fox',
//     length: 4,
//   },
//   7: {
//     phrase: 'walked through the woods',
//     length: 4,
//   },
//   8: {
//     phrase: 'quick brown fox',
//     length: 3,
//   },
//   9: {
//     phrase: 'the lazy dog',
//     length: 3,
//   },
//   10: {
//     phrase: 'through the woods talked',
//     length: 4,
//   },
// };

// const wordMap = createWordMap(phraseMap);

// // Get all the text associated with the chosen paragraphs
// //  and wrap each word in a span with classes corresponding
// //  to the phrases it is in and update the dom
// // const allArticleParagraphs = document.querySelectorAll('.article-paragraph-target');
// spanWrapper.spanWrapAll(wordMap, phraseMap);

// // Get all spans with the phrase-word class and add and
// //  event listener to them
// const phraseWordElements = document.querySelectorAll('.phrase-word');

// phraseWordElements.forEach(element => {
//   element.addEventListener('mouseover', highlighter.grabClassNames);
// });

// Test Input
const testWordLists = {
  redList: [
    'action-oriented',
    'alarming',
    'candidates',
    'leave',
    'do not want',
  ],
  greenList: [
    'adorable',
    'creative',
    'love',
    'new technology',
  ],
  blueList: [
    'an adorable puppy',
    'aggressive',
    'arm',
    'very unlikely',
  ],
  purpleList: [
    'do not cross',
    'log file',
    'our team',
    'radio',
  ],
  greyList: [
    'very unlikely to leave',
    'will deliver new',
  ],
};

const controllerOne = new Controller('hightlighter-target', testWordLists);

const wordMap = controllerOne.createWordMap(testWordLists);
