'use strict';

import Controller from './lib/control';

console.log('Hello world...');

// Test Input
const originalLists = {
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

const testWordLists = {
  'red-list': [
    'action-oriented',
    'alarming',
    'candidates',
    'leave',
    'do not want',
    'actionable',
    'take',
    'we are cool',
    // 'unlikely',
  ],
  'green-list': [
    'adorable',
    'will take stuff',
    'creative',
    'love',
    'groundbreaking',
    'new technology',
    'cool to hang',
    // 'puppy',
  ],
  'blue-list': [
    'an adorable puppy',
    'aggressive',
    'arm',
    'very unlikely',
    // 'is not cool',
    // 'leave me alone',
  ],
  'purple-list': [
    'do not cross',
    'log file',
    'our team',
    'radio',
    'cool we are',
  ],
  'grey-list': [
    'will deliver new',
    'very unlikely to leave',
  ],
};

const testString = 'I\'m very unlikely to leave an adorable puppy. We do not want alarming or aggressive candidates, our candidates should be action-oriented otherwise they will be asked to leave. Here we are creative, love new technology, and our arm is very unlikely to go-to radio! We do not cross our team with a log file and we will deliver new technology with love as we are adorable.'

const testStringTwo = 'We expect our candidates to be action-oriented, aggressive and have creative ideas for our team. You will deliver new technology and groundbreaking designs.';

const shortTest = ' puppy an adorable. adorable an puppy. adorable puppy adorable. puppy. an adorable puppy.... adorable an puppy. puppy an adorable. an actionable item puppy actionable item an puppy';
const shortTestTwo = 'very unlikely to leave very unlikely to! leave very unlikely to. leave very unlikely to? leave leave very unlikely to. leave very unlikely to? unlikey to leave very. leave very unlikely to. very unlikely to leave me alone';
const shortTestThree = 'our arm';
const shortTestFive = 'will deliver new technology. is not cool we are!!!! we are cool to hang';

const controllerOne = new Controller('highlighter-target', testWordLists);
controllerOne.renderHighlights(testString);

const controllerTwo = new Controller('highlighter-target-two', testWordLists);
controllerTwo.renderHighlights(testStringTwo);

const controllerThree = new Controller('highlighter-target-three', testWordLists);
controllerThree.renderHighlights(shortTestTwo);

const controllerFour = new Controller('highlighter-target-four', testWordLists);
controllerFour.renderHighlights(shortTest);

const controllerFive = new Controller('highlighter-target-five', testWordLists);
controllerFive.renderHighlights(shortTestFive);

const controllerFINAL = new Controller('highlighter-target-final', originalLists);
controllerFINAL.renderHighlights(testString);
