// Main Controller
// TODO: REFACTOR ALL OF THIS to work with the childNodes of the
//  given div properly as it contains the text nodes!

export default class Controller {
  constructor(div, wordLists) {
    this.divTarget = div;
    this.wordLists = wordLists;
    this.wordMap = {};
  }

  createWordMap(wordLists) {
    const addColorToWordMap = (word, associatedColor) => {
      if (!this.wordMap[word.toLowerCase()]) {
        this.wordMap[word.toLowerCase()] = {};
        this.wordMap[word.toLowerCase()].colors = [associatedColor];
      } else if (!this.wordMap[word.toLowerCase()].colors.includes(associatedColor)) {
        // If the color array in wordMap does not already include the color add it
        this.wordMap[word.toLowerCase()].colors.push(associatedColor);
      }
    };

    // Add a flag to help determine if word is NOT in a phrase
    const addLengthToWordMap = (colorList, word, length = 1) => {
      const newProperty = `${colorList}Length`;
      const currLength = this.wordMap[word.toLowerCase()][newProperty];
      if (currLength) {
        if (length > currLength) {
          this.wordMap[word.toLowerCase()][newProperty] = length;
        }
      } else {
        this.wordMap[word.toLowerCase()][newProperty] = length;
      }
    };

    Object.keys(wordLists).forEach(colorList => {
      wordLists[colorList].forEach(string => {
        // TODO: may need to handle punctuation here?
        const words = string.split(' ');

        if (words.length < 2) {
          // Has No spaces so must be one word, hyphenated, or has an apostrophy.
          addColorToWordMap(string, colorList);
          addLengthToWordMap(colorList, string);
        } else {
          // String is multiple words so add each part to the wordMap
          words.forEach(word => {
            addColorToWordMap(word, colorList);
            addLengthToWordMap(colorList, word, words.length);
          });
        }
      });
    });
    console.log('Word Map: ', this.wordMap);
  }

  // createPhraseWordsArray(inputString) {
  //   const stringPhraseWordsArray = {};
  //   const words = inputString.match(/\w+|[^w]/g);

  //   // Loop through words array to apply <span>'s depending on if they are in a phrase or not
  //   for (let i = 0; i < words.length; i++) {

  //   }
    
  //   words.forEach(word => {
  //     if (this.wordMap[word.toLowerCase()]) {
  //       if (stringPhraseWordsArray.length > 0) {
  //         stringPhraseWordsArray[word].push(this.wordMap[word.toLowerCase()]);
  //       } else {
  //         stringPhraseWordsArray[word] = [].push(this.wordMap[word.toLowerCase()]);
  //       }
  //     }
  //   });
  //   console.log('Current String Array: ', stringPhraseWordsArray);
  // }

  // TODO: Refactor this to handle different inputs
  // TODO: ASK. should everyword be wrapped in a span?
  compareNeighbors(inputString) {
    const words = inputString.match(/[\w'-]+|[^w]/g);
    const appliedColorClasses = [];
    
    // Initialize empty array of arrays the same length as the words array
    for (let i = 0; i < words.length; i++) {
      appliedColorClasses.push([]);
    }

    // const words = inputString.match(/(?=\S*['-])([a-zA-Z'-]+)/g);
    // const words = inputString.match(/\b\w*['-]\w*\b/g);

    const isWordAtBeginningOrEnd = (currentIndex, startIndex, endIndex) => {
      if (currentIndex === startIndex) {
        // then add on the LEFT class
        return '-left ';
      }
      if (currentIndex === endIndex - 1) {
        // add the MIDDLE class
        return '-right ';
      }
      return '-middle ';
    };
    // Loop through words array to apply <span>'s depending on if they are in a phrase or not
    for (let i = 0; i < words.length; i++) {
      const currWord = words[i];
      if (this.wordMap[currWord]) {
        const currColors = this.wordMap[currWord].colors;
        // If there is only 1 color listed for this word & 
        //  the max possible length of phrase the word is in
        //  is 1 then we want to add the base class color to
        //   appliedColorClasses[i].push(firstColor);
        // } else {
        // If more than one color we want to compare the following
        //  words and their phrases up to the max possible phrase 
        //  length of the current word from the wordMap and
        //  apply those phrases to the span class for each word
        for (let j = 0; j < currColors.length; j++) {
          const currColor = this.wordMap[currWord].colors[j];
          const phraseLength = this.wordMap[currWord][`${currColor}Length`];
          console.log('CurrColor and Phrase Length: ', currColor, phraseLength);

          if (phraseLength === 1) {
            appliedColorClasses[i].push(currColor);
          } else {
            // Skip if this word already has this color
            if (appliedColorClasses[i].includes(currColor)) {
              console.log('word has color already: ', currColor);
              break;
            }
            // appliedColorClasses[i].push(currColor);

            // Add the base class to the class string.
            // let tempClasses = `${currColor} `;
            // console.log('Curr Color String: ', tempClasses);

            // This begins the look ahead logic to determine if a
            //  word is in a phrase and which classes should be 
            //  applied to it based on the next words in the words
            //  array.
            let hasCommonNeighborColors = true;
            // let kIndex = i;
            let endOfPhraseIndex = i + (phraseLength);
            const trackedIndexes = [i];

            // look ahead at each word and if it doesn't contain
            //  the same color in wordMap then stop and throw flag
            // ((callback) => {

            for (let k = i + 1; k < endOfPhraseIndex; k++) {
              console.log('HIT LOOK AHEAD', currWord, currColor);
              let nextWord = words[k];
                
              // Skip this word and move to next if it is whitespace or punctuation
              //  TODO: CHANGE to regex below
              while ([' ', '!', '?', '.'].includes(nextWord)) {
                k++;
                endOfPhraseIndex++;
                nextWord = words[k];
              }
                
              console.log('NEXT word: ', nextWord);
              trackedIndexes.push(k);
              if (!this.wordMap[nextWord] || !(this.wordMap[nextWord].colors.includes(currColor))) {
                console.log('BROKE LOOK AHEAD LOOP');
                hasCommonNeighborColors = false;
                break;
              }
            }
            if (hasCommonNeighborColors) {
              console.log('Has Common Nei: ', hasCommonNeighborColors, currWord);
              // If flag is still true then add the class to a temp
              //  string that we will use to apply to the current 
              //  word's classes.
              console.log('TRACKED Indexes: ', trackedIndexes);
              trackedIndexes.forEach(index => {
                const tempClass = `${currColor}${isWordAtBeginningOrEnd(index, i, endOfPhraseIndex)}`;
                appliedColorClasses[index].push(tempClass);
                appliedColorClasses[index].push(currColor);
                console.log('Adding Class: ', tempClass);
              });
            }
          }
        }
      }
    }
    console.log('appliedColorClasses: ', appliedColorClasses);

    // Take the words and appliedClasses and combine them
    console.log(words.length, appliedColorClasses.length);
    for (let i = 0; i < words.length; i++) {
      const currWord = words[i];
      if (appliedColorClasses[i].length > 0) {
        const wordClasses = appliedColorClasses[i].join(' ');
        words[i] = `<span class="${wordClasses}">${currWord}</span>`;
      } else {
        words[i] = `<span>${currWord}</span>`;
      }
    }

    // take these words and join them back together
    const resultHTML = words.join('');
    return resultHTML;
  }

  //   for (let i = 0; i < phraseWordsArray.length; i++) {
  //     for (let j = 0; j < phraseWordsArray[i].length; j++) {
  //       const currPhrase = phraseWordsArray[i][j];
  //       if (appliedPhrases[i].includes(currPhrase)) break;
  //       let flag = true;
  //       for (let k = i + 1; k < phraseMap[currPhrase].length; k++) {
  //         if (!(phraseWordsArray[k].includes(currPhrase))) {
  //           flag = false;
  //           break;
  //         }
  //       }
  //       if (flag) {
  //         for (let k = i; k < phraseMap[currPhrase].length; k++) {
  //           appliedPhrases[k].push(currPhrase);
  //         }
  //       }
  //     }
  //   }
  //   return appliedPhrases;
  // };

  highlightRender(inputString) {
    this.createWordMap(this.wordLists);
    const newHTML = this.compareNeighbors(inputString);
    // Erase Previous render to this.divTarget
    const targetElement = document.getElementById(this.divTarget); // assuming the div is an #id
    // targetElement.innerHTML = ''; // is this the most efficient or fastest way to clear a div?
    targetElement.innerHTML = newHTML;
    // Render NEW text with highlights

    // Compare string to word list
    // wrap each word in a <span> so it can be colored
    // only wrap the word in a span:
    // IF it is in the word lists
    // IF it is in a phrase AND next to all the other words in that phrase
    // Add classes to each span depending on which phrase it is in.
  }
}
