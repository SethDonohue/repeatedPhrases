
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

const inputString = 'I walked through the woods talked to me. The next week I walked through the woods the next week. The quick brown fox walked through the woods and talked to me. Another quick brown fox jumped over the lazy dog while the woods talked to me. The lazy dog walked through the woods the next week.';

const phraseMapCHECKER = {
  word: ['phrases word is in'],
  i: [1, 4],
  walked: [1, 7],
  through: [1, 7, 10],
  the: [1, 2, 4, 5, 6, 7, 9, 10],
  woods: [1, 2, 7, 10],
  lazy: [9],
};

const wordToPhraseMap = {
  i: [1],
  woods: [2, 7],
};