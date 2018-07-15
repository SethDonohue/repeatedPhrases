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
    'is it good',
    'nine',
  ],
  'green-list': [
    'adorable',
    'what is it good for',
    'will take stuff',
    'creative',
    'love',
    'groundbreaking',
    // If the phrase begins with the same word as another lower priority
    //  phrase ends with it will work, but the opposite does not work.
    'new technology',
    // 'will deliver new',
    'new technology dude bro yah man sweet as all heck awesome sick coolio yeah',
    // 'three ten',
    'are not cool',
    // 'cool we are',
    // 'puppy',
    'thousand nine hundred',
  ],
  'blue-list': [
    'ten twenty',
    'an adorable puppy',
    'very unlikely',
    'aggressive',
    'arm',
    // 'leave me', // Since it is first in the phrase it causes 
    'three thousand nine hundred fifty',
  ],
  'purple-list': [
    'do not cross',
    'log file',
    'our team',
    'radio',
    // 'are not cool',
    // 'cool we are',
    'million three thousand nine hundred fifty eight',
  ],
  'grey-list': [
    'very unlikely to leave',
    'cool to hang',
    'will deliver new',
    // 'new technology',
    'we are the best company and this company is the company that can and will deliver new technology dude bro',
    // 'one two three',
    'one million three thousand nine hundred fifty eight point two',
  ],
};

const testWordListsTwo = {
  'green-list': [
    'we are the best company and this company is the company that can and will deliver new technology dude bro',
  ],
  'grey-list': [
    'bro yah man sweet as all heck awesome sick coolio yeah',
  ],
};

const testWordListsThree = {
  'red-list': [
    'we the',
  ],
  'purple-list': [
    'the best',
  ],
};

const testString = 'we\'re very unlikely to leave an adorable puppy. We do not want alarming or aggressive candidates, our candidates should be action-oriented otherwise they will be asked to leave. At this company we are creative, love new technology, and our arm is very unlikely to go-to radio! We do not cross with our team do not cross our team with a log file and we will deliver new technology with love as we are adorable...';

const testStringTwo = 'We expect our candidates to be action-oriented, aggressive and have creative ideas for our team. You will deliver new technology and groundbreaking designs.';

const shortTest = ' puppy an adorable. adorable an puppy. adorable puppy adorable. puppy. an adorable puppy.... adorable an puppy. puppy an adorable. an actionable item puppy actionable item an puppy';

const repetativeTest = 'very unlikely to leave very unlikely to! leave very unlikely to. leave very unlikely leave? leave leave very unlikely to. leave leave unlikey to unlikely to very unlike very unlikely to? unlikey to leave very. leave very unlikely to. very unlikely to leave me alone';

const multipleInclusivePhrases = 'what is it good for... ?! one million three thousand nine hundred fifty eight point two?';

const longPhrasesTest = 'we are the best company and this company is the company that can and will deliver new technology dude bro yah man sweet as all heck awesome sick coolio yeah!';

const shortHighPriorityOverLowPhrases = 'we the best!';

const controllerOne = new Controller('highlighter-target', testWordLists);
controllerOne.renderHighlights(testString);

const controllerTwo = new Controller('highlighter-target-two', originalLists);
controllerTwo.renderHighlights(testStringTwo);

const controllerThree = new Controller('highlighter-target-three', testWordLists);
controllerThree.renderHighlights(repetativeTest);

const controllerFour = new Controller('highlighter-target-four', testWordLists);
controllerFour.renderHighlights(shortTest);

const controllerFiveOne = new Controller('highlighter-target-five-one', testWordLists);
controllerFiveOne.renderHighlights(longPhrasesTest);

const controllerFiveTwo = new Controller('highlighter-target-five-two', testWordListsTwo);
controllerFiveTwo.renderHighlights(longPhrasesTest);

const controllerFiveThree = new Controller('highlighter-target-five-three', testWordListsThree);
controllerFiveThree.renderHighlights(shortHighPriorityOverLowPhrases);

const controllerSix = new Controller('highlighter-target-six', testWordLists);
controllerSix.renderHighlights(multipleInclusivePhrases);

const controllerFINAL = new Controller('highlighter-target-final', originalLists);
controllerFINAL.renderHighlights(testString);
