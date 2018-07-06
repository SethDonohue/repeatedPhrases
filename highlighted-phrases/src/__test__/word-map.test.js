const createWordMap = require('../lib/word-map');

describe('HIGHLIGHTER --- ', () => {
  test('CreateWordMap takes in a phrase map and correctly returns a word map where each key is a word and value is an array of the phrase\'s numbers that the key word is in, and there is a longestPhrase and shortestPhrase property...', () => {
    const phrases = {
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
    
    const expectedReturn = {
      i: [1, 4],
      woods: [1, 2, 7, 10],
      walked: [1, 7],
      through: [1, 7, 10],
      the: [1, 2, 4, 5, 6, 7, 9, 10],
      talked: [2, 3, 10],
      to: [2, 3],
      me: [2, 3],
      next: [4, 5],
      week: [4, 5],
      quick: [6, 8],
      brown: [6, 8],
      fox: [6, 8],
      lazy: [9],
      dog: [9],
      longestPhraseLength: 5,
      shortestPhraseLength: 3,
    };

    expect((createWordMap(phrases)).woods).toEqual(expectedReturn.woods);
    expect((createWordMap(phrases)).longestPhraseLength).toEqual(expectedReturn.longestPhraseLength); //eslint-disable-line
    expect((createWordMap(phrases)).shortestPhraseLength).toEqual(expectedReturn.shortestPhraseLength); //eslint-disable-line
  });
});
