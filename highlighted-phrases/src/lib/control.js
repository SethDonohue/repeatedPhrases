// Main Controller

export default class Controller {
  constructor(div, wordLists) {
    this.divTarget = div;
    this.wordLists = wordLists;
    this.wordMap = {};
    this.classesToApply = [];
  }

  createWordMap(wordLists) {
    const addColorToWordMap = (word, associatedColor) => {
      if (!this.wordMap[word.toLowerCase()]) {
        this.wordMap[word.toLowerCase()] = {};
        this.wordMap[word.toLowerCase()].colors = [associatedColor];
      } else if (!this.wordMap[word].colors.includes(associatedColor)) {
        // If the color array in wordMap does not already include the color add it
        this.wordMap[word.toLowerCase()].colors.push(associatedColor);
      }
    };

    const addFlagToWordMap = (word, flag = false) => {
      this.wordMap[word.toLowerCase()].oneWord = flag;
    };

    Object.keys(wordLists).forEach(colorList => {
      wordLists[colorList].forEach(string => {
        // TODO: may need to handle punctuation here?
        if (!string.includes(' ')) {
          // Has No spaces so must be one word, hyphenated, or has an apostrophy.
          // Skip the loop and add it to the map as well as a flag that it is not in a phrase in the list
          addColorToWordMap(string, colorList);
          addFlagToWordMap(string, true);
        } else {
          // String is multiple words so add each part to the wordMap
          const words = string.split(' ');
          words.forEach(word => {
            addColorToWordMap(word, colorList);
            addFlagToWordMap(word);
            // if (!this.wordMap[word.toLowerCase()]) {
            //   this.wordMap[word.toLowerCase()].colors = [colorList];
            // } else if (!this.wordMap[word].includes(colorList)) {
            //   this.wordMap[word.toLowerCase()].push(colorList);
            // }
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
  // compareNeighbors(inputString) {
  //   const classesToApply = [];
  //   const words = inputString.match(/[\w'-]+|[^w]/g);
  //   // const words = inputString.match(/(?=\S*['-])([a-zA-Z'-]+)/g);
  //   // const words = inputString.match(/\b\w*['-]\w*\b/g);

  //   // Loop through words array to apply <span>'s depending on if they are in a phrase or not
  //   for (let i = 0; i < words.length; i++) {
  //     const currWord = words[i];
  //     if (this.wordMap[currWord]) {
  //       const currPhrases = this.wordMap[currWord];
  //       if (currPhrases.length === 1) {
  //         // apply the class now!
  //         words[i] = `<span class="${currPhrases[0]}">${words[i]}</span>`;
  //       } else {
  //         console.log('Curr Color:');
  //         for (let j = 0; j < currPhrases.length; j++) {
  //           const currPhraseColor = this.wordMap[currWord][j];
  //           console.log(currPhraseColor);
  //           // if (classesToApply[i].includes(currPhraseColor)) break;
  //           // let flag = true;
  //           //   for (let k = i + 1; k < LENGTH OF CURRENT PHRASE; k++){

  //           //   }


  //           // if (i === 0) {
  //           //   // then add on the LEFT class and color
  //           // }
  //           // if (!(i === 0) || !(i === currPhrases.length - 1)) {
  //           //   // add the MIDDLE class and Color
  //           // }
  //           // if (i === currPhrases.length - 1) {
  //           //   // add RIGHT class and Color
  //           // }
  //           // }
  //         }
  //       }
  //     } else if (!(words[i] === ' ')) {
  //       words[i] = `<span>${words[i]}</span>`;
  //     }
  //   }
  //   // take these words and join them back together
  //   const resultHTML = words.join('');
  //   return resultHTML;
  // }
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
