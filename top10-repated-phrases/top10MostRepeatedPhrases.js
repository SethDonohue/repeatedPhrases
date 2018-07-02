// ASSUMPTIONS based on clarifying questions:
//  1.) Commas DO NOT need to be accountd for in phrases.
//    - It is more likely that they are a typo if a phrase that has 
//      been used once already has a comma in the middle of it. 
//      This can easily changed to allow phrases that have commas 
//      be a uniq phrase.
//
//  2.) Return array should be sorted by most repeated to least 
//      repeated phrase.
//  3.) Return an array of objects with each element having a shape 
//      of: 
//      { 
//        phrase: 'a repeated phrase',
//        frequency: 3,
//      }
//  4.) Input is NOT sanitzied. ( I did not have time to sanitize 
//      the input, I considered it part of the phrase if it was in //      there and repeated).
//  5.) Sentences will be separated by . ! ?
// 


const mostRepeatedPhrases = (inputStr) => {
  const allWordsPhraseMap = {};
  const repeatedPhraseMap = {};

  // clean all the commas from the input
  const noCommaStr = inputStr.replace(/,/g, '');
  // Split Input into sentences
  const sentenceArr = noCommaStr.split(/[.!?]/);
  
  // Function to find all the phrases in a sentence at least 3 
  // words long
  const sentencePhraseFinder = (sentenceStr) => {
    // remove whitepsace as it interferes with future string 
    // comparison
    const trimmedSentence = sentenceStr.trim();
    const wordArr = trimmedSentence.split(' ');

    // Add phrase to All Words Map to keep track of all phrases,
    // then add to repeating map if phrase repeated
    const addToMap = (phraseToAdd) => {
      if (!allWordsPhraseMap[phraseToAdd]) {
        allWordsPhraseMap[phraseToAdd] = 1;
      } else if (repeatedPhraseMap[phraseToAdd]) {
        repeatedPhraseMap[phraseToAdd]++;
      } else if (allWordsPhraseMap[phraseToAdd]) {
        repeatedPhraseMap[phraseToAdd] = 2;
      }
    };

    // Make all possible phrases for each sentence
    for (let i = 0; i < wordArr.length - 2; i++) {
      for (let j = i + 2; j < wordArr.length; j++) {
        let currPhrase = `${wordArr[i]} `;
        for (let k = i + 1; k <= j; k++) {
          if (k === j) {
            currPhrase = `${currPhrase}${wordArr[k]}`;
          } else {
            currPhrase = `${currPhrase}${wordArr[k]} `;
          }
        }
        addToMap(currPhrase);
      }
    }
  };
  
  // If repeatedPhrase is empty then we stop the function and 
  // return and empty array
  if (repeatedPhraseMap === {}) {
    return [];
  }

  // Check for common phrases in each sentence
  for (let i = 0; i < sentenceArr.length; i++) {
    sentencePhraseFinder(sentenceArr[i].toLowerCase());
  }

  // In the top 10 repeated phrases, remove any phrase that is 
  // INCLUDED in another longer phrase
  const phraseMapKeysArr = Object.keys(repeatedPhraseMap);
  let result = {};
  const returnArr = [];

  // Sort the keys array so that it is easy to compare the longer 
  // elements against the shorter ones.
  phraseMapKeysArr.sort((a, b) => b.length - a.length);

  // Check if the map is only one repeated phrase
  if (phraseMapKeysArr.length < 2) {
    result = repeatedPhraseMap;
  } else {
    // Push an object with phrase and frequency into return array 
    // if it is not an element that is included in another element 
    // in the keys array
    for (let i = 0; i < phraseMapKeysArr.length; i++) {
      // push the first element into the return array as it is the longest repeated phrase.
      const tempObj = {
        phrase: phraseMapKeysArr[i],
        frequency: repeatedPhraseMap[phraseMapKeysArr[i]],
      };

      returnArr.push(tempObj);

      // If returnArr is at 10 elements then stop this loop to 
      // return only top 10 phrases.
      if (returnArr.length === 10) {
        break;
      }

      // check each phrase against the i phrase.
      for (let j = i; j < phraseMapKeysArr.length; j++) {
        // Skip matching indexes as these are already the same
        if (!(i === j)) {
          // if it is included in the above phrase, remove it from // the keys array and step back j to not skip any
          // elements. This mutates the original keys array to 
          // not duplicate checking elements which are known to be 
          // included in another element
          if ((phraseMapKeysArr[i].includes(phraseMapKeysArr[j]))) {
            phraseMapKeysArr.splice(j, 1);
            j--;
          }
        }
      }
    }
  }

  // Sort the array by most frequent
  returnArr.sort((a, b) => b.frequency - a.frequency);
  return returnArr;
};

module.exports = mostRepeatedPhrases;
