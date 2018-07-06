// TODO: ADD classes to each of these spans depending on the wordMap
//    - this needs to takein a wordMap to know what classes to add
//      to each span before updating the DOM
import $ from 'jquery';
import { WSAEPROVIDERFAILEDINIT } from 'constants';

const spanWrapper = {};

spanWrapper.spanWrapAll = (wordMap, phraseMap) => {
  $('.article-paragraph-target').each((pIndex, paragraph) => {
    const paragraphPhraseWordsArray = [];
    const classesToApply = [];
    const words = paragraph.textContent.match(/\w+|[^w]/g);

    words.forEach(word => {
      if (wordMap[word.toLowerCase()]) {
        paragraphPhraseWordsArray.push(wordMap[word.toLowerCase()]);
      }
    });
    console.log('P-Array: ', paragraphPhraseWordsArray);
    
    // create an empty array of arrays of equal length to paragraphPhraseWords
    for (let i = 0; i < paragraphPhraseWordsArray.length; i++) {
      classesToApply.push([]);
    }
    spanWrapper.compareNeighbors(phraseMap, paragraphPhraseWordsArray, classesToApply);
    console.log('classes AFTER: ', classesToApply);
   
    paragraph.innerHTML = '';
    $.each(words, (wIndex, word) => {
      console.log(word);
      const text = document.createTextNode(word);
      if (word.match(/\w/g)) {
        const span = document.createElement('span');
        span.innerHTML = word;
        paragraph.appendChild(span);
      } else {
        paragraph.appendChild(text);
      }
    });
  });
};
// TODO: phraseMap needs to be tweaked to have a length property or be an array of the words
spanWrapper.compareNeighbors = (phraseMap, phraseWordsArray, appliedPhrases) => {
  for (let i = 0; i < phraseWordsArray.length; i++) {
    for (let j = 0; j < phraseWordsArray[i].length; j++) {
      const currPhrase = phraseWordsArray[i][j];
      if (appliedPhrases[i].includes(currPhrase)) break;
      let flag = true;
      for (let k = i + 1; k < phraseMap[currPhrase].length; k++) {
        if (!(phraseWordsArray[k].includes(currPhrase))) {
          flag = false;
          break;
        }
      }
      if (flag) {
        for (let k = i; k < phraseMap[currPhrase].length; k++) {
          appliedPhrases[k].push(currPhrase);
        }
      }
    }
  }
  return appliedPhrases;
};

// spanWrapper.paragraphWordMap = (wordMap, paragraph) => {
//   //  needs to make a map of each words possible phrases
//   for
//   //  then compares the phrases with each other to find common phrases
//   //  and eleminate non-common ones aross min and max phrase lengths
// }

// spanWrapper.classApplier = (wordMap, word) => {
//   // This function needs to be run on each word
//   // if word is in word map then apply the class # associated with
//   // that word ( e.g. in phrase 4 apply class of p-4)
//   let tempClassString = '';
//   word = word.toLowerCase();

//   // create string with classes in it
//   if (wordMap[word]) {
//     wordMap[word].forEach(phraseNumber => {
//       tempClassString += `p-${phraseNumber} `;
//     });
//   }
//   return tempClassString.trim();
// };

// spanWrapper.spanWrapAll = (wordMap, paragraphNodeList) => {
//   // get the text inside the element
//   paragraphNodeList.forEach(paragraph => {
//     // Get each sentence
//     const sentences = paragraph.textContent.match(/[^.!?]+[.!?]+/g).filter(x => x);
//     console.log('Sentences: ', sentences);

//     sentences.map((sentence, sentenceIndex) => {
//       const words = sentence.match(/\w+|\s+|[^\s\w]+/g);
//       console.log('Words before change: ', words);
      
//       // wrap each word in a <span> with classes
//       words.forEach((word, wordsIndex) => {
//         // Check to make sure is actually a word
//         if (!word.match(/\w+/)) {
//           console.log('not a word', word);
//           return word;
//         }
//         const classString = spanWrapper.classApplier(wordMap, word);
//         let tempHTML = '';
//         if (classString.length > 0) {
//           tempHTML = `<span class="phrase-word ${classString}">${word}</span>`;
//         } else {
//           tempHTML = `<span>${word}</span>`;
//         }
//         words[wordsIndex] = tempHTML;
//         // return tempHTML;
//       });
//       sentences[sentenceIndex] = words.join(' ');

//       console.log('Wraped Words: ', words);
//       return words;
//     });
//     // console.log('Wrapped Sentences: ', sentences);

//     // set as innerHTML for paragraph?
//     paragraph.innerHTML = sentences.join(''); //eslint-disable-line
//     console.log(paragraph.innerHTML);
//   });
//   return paragraphNodeList; // This return is strictly here for testing
// };

module.exports = spanWrapper;
