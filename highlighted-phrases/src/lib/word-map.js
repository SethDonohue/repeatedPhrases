// Creating a word map from the list of phrases in order to
//  know which classes to apply to which words on the page 
const createWordMap = (phraseMap, wordMap = {}) => {
  wordMap.longestPhraseLength = 0;
  wordMap.shortestPhraseLength = 100000;

  Object.keys(phraseMap).forEach(key => {
    const parsedKey = parseInt(key, 10);
    const words = phraseMap[key].phrase.split(' ');
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
  console.log(wordMap);
  return wordMap;
};

module.exports = createWordMap;
