// Creating a word map from the list of phrases in order to
//  know which classes to apply to which words on the page 
const createWordMap = (phraseMap, wordMap = {}) => {
  wordMap.longestPhraseLength = 0;
  wordMap.shortestPhraseLength = 100000;

  Object.keys(phraseMap).forEach(key => {
    const parsedKey = parseInt(key, 10);
    const words = phraseMap[key].split(' ');
    // Check if phrase is longest and set it
    if (words.length > wordMap.longestPhraseLength) {
      wordMap.longestPhraseLength = words.length;
    }
    // Check if phrase is shortest and set it
    if (words.length < wordMap.shortestPhraseLength) {
      wordMap.shortestPhraseLength = words.length;
    }

    words.forEach(word => {
      if (!wordMap[word]) {
        wordMap[word] = [parsedKey];
      } else if (!wordMap[word].includes(parsedKey)) {
        wordMap[word].push(parsedKey);
      }
    });
  });
  return wordMap;
};
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// METHODS for determining which words to highlight depending on phrase.
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// For Each sentence - come back to this for now, not sure how file will be formatted...
//   For Each word
//  - Compare phrases word is in with next 4 neighrbors
//    (4 comes from max possible phrase length - 1)
//  - Apply common phrases to all words
//  - Store seen phrases in map/array
//  - Move to next word
// - Stop when min phrase length - 1 away from end of sentence

// TODO: Break the paragraph text into a sentence array
  
module.exports = createWordMap;
