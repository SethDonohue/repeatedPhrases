'use strict';

import spanWrapper from './span-wrapper';

// Test to use a hashmap insde another hashmap
// const selectorsMap = {
//   sentenceOne : {
//     keyOne: 10,
//     keyTwo: 20,
//     keyThree: 30,
//   },
//   sentenceTwo : {
//     keyOne: 100,
//     keyTwo: 200,
//     keyThree: 300,
//   }
// }

// const phrasePriority = {
//   phraseOne: 1,
//   phraseTwo: 2,
//   phraseThree: 3,
//   phraseFour: 4,
//   phraseFive: 5,
//   phraseSix: 6,
//   phraseSeven: 7,
//   phraseEight: 8,
//   phraseNine: 9,
//   phraseTen: 10,
// }

// can create this dynamically depending on how the phrase list is given by taking phrase list and making each phrase a key and addinge a value of `phrase${i}`
// const phraseSelectors = {
//   phraseOne: 'phrase1',
//   phraseTwo: 'phrase2',
//   phraseThree: 'phrase3',
//   phraseFour: 'phrase4',
//   phraseFive: 'phrase5',
//   phraseSix: 'phrase6',
//   phraseSeven: 'phrase7',
//   phraseEight: 'phrase8',
//   phraseNine: 'phrase9',
//   phraseTen: 'phrase10',
// }

// These phrase keys should be the same as the css selectors given to them.
// the phrase.keys are all the words that each phrase contains
// const phraseWords = {
//   phrase1: {
//     'the': true,
//     'quick': true,
//     'brown': true,
//     'fox': true,
//   },
//   phrase1: {
//     'the': true,
//     'quick': true,
//     'brown': true,
//     'fox': true,
//   }
// }

// const wordsToPhrasesSelectorsToAdd = {
//   'the': {
//     'phrase1 phrase2 phrase3':true,
//   },
//   'quick': {
//     'phrase1 phrase2 ': true,
//   },
//   'brown': {
//     'phrase1 phrase2 phrase 3',
//   },
//   'fox': {
//     'phrase1 phrase2 phrase 3',
//   },
// }

// console.log(map['hashmapTwo']['keyOne'])
// console.log(map['hashmapOne']['keyOne'])


// Example Page

const inputString = 'I walked through the woods talked to me. The next week I walked through the woods the next week. The quick brown fox walked through the woods and talked to me. Another quick brown fox jumped over the lazy dog while the woods talked to me. The lazy dog walked through the woods the next week.'

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

const phraseMapCHECKER = {
  word: ['ohrases word is in'],
  'i': [1, 4],
  'walked': [1, 7],
  'through': [1, 7, 10],
  'the': [1, 2, 4, 5, 6, 7, 9, 10],
  'woods': [1, 2, 7, 10],
  'lazy': [9],
};

const wordToPhraseMap ={
  'i': [1],
  'woods': [2,7],
}

// convert phrase list wordMap
// phraseListKeys = Object.keys(phraseList);

// const longestPhraseLength = 5;
// const shortestPhraseLength = 3;


const createWordMap = (phraseMap, wordMap = {}) => {
  wordMap['longestPhraseLength'] = 0;
  wordMap['shortestPhraseLength'] = 100000;

  Object.keys(phraseMap).forEach(key => {
    
    const parsedKey = parseInt(key, 10);
    const words = phraseMap[key].split(' ');
    // Check if phrase is longest and set it
    if (words.length > wordMap.longestPhraseLength){
      wordMap['longestPhraseLength'] = words.length;
    }
    // Check if phrase is shortest and set it
    if (words.length < wordMap.shortestPhraseLength){
      wordMap['shortestPhraseLength'] = words.length;
    }

    words.forEach(word => {
      if (!wordMap[word]) {
        wordMap[word] = [parsedKey];
      } else {
        if (!wordMap[word].includes(parsedKey)){
          wordMap[word].push(parsedKey);
        }
      }
    })
  });
  return wordMap;
}

// console.log('wordMap: ');
// console.log(createWordMap(Object.keys(phraseList)));

// Notes

// For Each sentence
//   For Each word
//   - Compare phrases word is in with next 4 neighrbors (4 comes from max possible phrase length - 1)
  //  - Apply common phrases to all words
  //  - Store seen phrases in map/array
  //  - Move to next word
  // - Stop when min phrase length - 1 away from end of sentence
    
  
module.exports = createWordMap;
// export { createWordMap }