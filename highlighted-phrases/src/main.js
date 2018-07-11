'use strict';

import Controller from './lib/control';

console.log('Hello world...');

// Test Input
const testWordLists = {
  'red-list': [
    'action-oriented',
    'alarming',
    'candidates',
    'leave',
    'do not want',
  ],
  'green-list': [
    'adorable',
    'creative',
    'love',
    'new technology',
    'groundbreaking',
  ],
  'blue-list': [
    'an adorable puppy',
    'aggressive',
    'arm',
    'very unlikely',
  ],
  'purple-list': [
    'do not cross',
    'log file',
    'our team',
    'radio',
  ],
  'grey-list': [
    'very unlikely to leave',
    'will deliver new',
  ],
};

const testString = 'I\'m very unlikely to leave an adorable puppy. We do not want alarming or aggressive candidates, our candidates should be action-oriented otherwise they\'ll be asked to leave. Here we are creative, love new technology, and our arm is very unlikely to go-to radio! We do not cross our team with a log file and we deliver new technology with love and we are adorable.';

const testStringTwo = 'We expect our candidates to be action-oriented, aggressive and have creative ideas for our team. You will deliver new technology and groundbreaking designs.';

const shortTest = 'adorable puppy adorable. puppy';
const shortTestTwo = 'very unlikely to leave very unlikely to! leave very unlikely to. leave very unlikely to? leave';
const shortTestThree = 'our arm';

const controllerOne = new Controller('highlighter-target', testWordLists);
controllerOne.renderHighlights(testString);

// const controllerTwo = new Controller('highlighter-target-two', testWordLists);
// controllerTwo.renderHighlights(testStringTwo);

const controllerThree = new Controller('highlighter-target-three', testWordLists);
controllerThree.renderHighlights(shortTestTwo);

// const controllerFour = new Controller('highlighter-target-four', testWordLists);
// controllerFour.renderHighlights(shortTest);
