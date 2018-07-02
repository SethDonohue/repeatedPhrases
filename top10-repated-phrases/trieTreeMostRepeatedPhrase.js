'use strict'

import trie from 'trie-prefix-tree';

let myTrie = trie();

myTrie.prototype.returnAllPhrases = () => {
  // for each 
}


class MostRepeated {
  constructor(inputString) {
    this.inputString = inputString;
    this.trieTree = trie();
    this.allPhrasesMap = {};;
  }

  trie.returnAllPhrases = () => {

  }

  commonPhrases = () => {
    // Reset phrase map to avoid repeats during use
    this.result = [];
    this.cleanInput();

    this.createPhraseMap();
    // create and sort the reapted map keys so that it is easier to remove shorter included keys
    const mapKeys = Object.keys(this.repeatedPhrasesMap);
    mapKeys.sort((a, b) => b.length - a.length);

    // remove any phrase from keys that is included in a larger phrase
    for (let i = 0; i < mapKeys.length; i++) {
      // push the first element into the return array as it is the longest repeated phrase.
      const tempObj = {
        phrase: mapKeys[i],
        frequency: this.repeatedPhrasesMap[mapKeys[i]],
      };

      this.result.push(tempObj);

      // If this.result reaches 10 elements then stop this loop to 
      // return only top 10 phrases.
      if (this.result.length === 10) {
        break;
      }

      // check each phrase against the i phrase.
      for (let j = i; j < mapKeys.length; j++) {
        // Skip matching indexes as these are already the same
        if (!(i === j)) {
          // if it is included in the above phrase, remove it from // the keys array and step back j to not skip any
          // elements. This mutates the original keys array to 
          // not duplicate checking elements which are known to be 
          // included in another element
          if ((mapKeys[i].includes(mapKeys[j]))) {
            mapKeys.splice(j, 1);
            j--;
          }
        }
      }
    }

    // sort the return array by most frequent phrase
    this.result.sort((a, b) => b.frequency - a.frequency);

    return this.result;
  }

  createPhraseMap = () => {
    // Reset phrase map to avoid repeats during use
    this.allPhrasesMap = {};

    // split input into sentences
    const sentenceArr = this.inputString.split(/[.!?]/);
    // for each sentence
    for (let i = 0; i < sentenceArr.length; i++) {
      // trim sentence
      let sentence = sentenceArr[i].trim();

      // split sentence into word array
      const words = sentence.split(' ');
      // make all possible phrases from each sentence
      for (let i = 0; i < words.length - 2; i++) {
        for (let j = i + 2; j < words.length; j++) {
          let currPhrase = `${words[i]} `;
          for (let k = i + 1; k <= j; k++) {
            if (k === j) {
              currPhrase = `${currPhrase}${words[k]}`;
            } else {
              currPhrase = `${currPhrase}${words[k]} `;
            }
          }
          // add each phrase to map
          this.addToMap(currPhrase);
        }
      }
    }
  }

  addToTrieTree = (phrase) => {
    const words = phrase.split(' ');
    words.forEach(element => {
      this.trieTree.addWord(element);
    });
  }

  addToMap = (phrase) => {
    // add to phrase map for frequency tracking.
    // If frequency greater than 1 then add it to the trie tree
    if (!this.allPhrasesMap){
      this.allPhrasesMap[phrase] = 1;
    } else {
      this.allPhrasesMap[phrase]++;
      this.addToTrieTree(phrase);
    }
  };

  cleanInput = () => {
    // remove commas
    this.inputString = this.inputString.replace(/,/g, '');
    // to lowercase
    this.inputString = this.inputString.toLowerCase();
  }
}

module.exports = MostRepeated;
