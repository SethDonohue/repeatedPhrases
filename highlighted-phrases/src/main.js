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


// IF there is a phrase that starts with the same word in the same color
//  section then it creates a bug where
// TODO: TEST Can these be sorted to help with the index issue? If the
//        longest phrases are last then the color index should be increased
//        and when we come across a shorter word than the index color then
//        the recursive call should stop once we reach the last word in th phrase.
const testWordLists = {
  'red-list': [
    'action-oriented',
    'alarming',
    'candidates',
    // 'very',
    'leave',
    'do not want',
    'do care',
    'actionable',
    'take',
    // 'we are cool',
    'unlikely',
  ],
  'green-list': [
    'adorable',
    'will take stuff',
    'creative',
    'love',
    'groundbreaking',
    // If the phrase begins with the same word as another lower priority
    //  phrase ends with it will work, but the opposite does not work.
    'new technology',
    // 'new technology dude',
    'three ten',
    'are not cool',
    // 'cool we are',
    // 'puppy',
  ],
  'blue-list': [
    'an adorable puppy',
    'very unlikely',
    'aggressive',
    'arm',
    // 'leave me', // Since it is first in the phrase it causes 
  ],
  'purple-list': [
    'do not cross',
    'log file',
    'our team',
    'radio',
    // 'are not cool',
    'cool we are',
  ],
  'grey-list': [
    'very unlikely to leave',
    'cool to hang',
    'deliver new',
    'one two three',
  ],
};

const testString = 'I\'m very unlikely to leave an adorable puppy. We do not want alarming or aggressive candidates, our candidates should be action-oriented otherwise they will be asked to leave. Here we are creative, love new technology, and our arm is very unlikely to go-to radio! We do not cross our team with a log file and we will deliver new technology with love as we are adorable... very unlikely... very unlikely to... very unlikely to leave .';

const testStringTwo = 'We expect our candidates to be action-oriented, aggressive and have creative ideas for our team. You will deliver new technology and groundbreaking designs.';

const shortTest = ' puppy an adorable. adorable an puppy. adorable puppy adorable. puppy. an adorable puppy.... adorable an puppy. puppy an adorable. an actionable item puppy actionable item an puppy';
const shortTestTwo = 'very unlikely to leave very unlikely to! leave very unlikely to. leave very unlikely to? leave leave very unlikely to. leave very unlikely to? unlikey to leave very. leave very unlikely to. very unlikely to leave me alone';
const shortTestThree = 'our arm';
const shortTestFive = 'will deliver new technology dude. is not cool we are!!!! we are cool to hang. are not cool we are. cool we are not cool. three one two three! one two three ten!';

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
