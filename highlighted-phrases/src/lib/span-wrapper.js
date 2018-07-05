// TODO: ADD classes to each of these spans depending on the wordMap
//    - this needs to takein a wordMap to know what classes to add to each span before updating the DOM

const classApplier = (wordMap, word) => {
  // This function needs to be run on each word
  // if word is in word map then apply the class # associated with
  // that word ( e.g. in phrase 4 apply class of p-4)
  let tempClassString = '';
  word = word.toLowerCase();

  // create string with classes in it
  if (wordMap[word]) {
    wordMap[word].forEach(phraseNumber => {
      tempClassString += `p-${phraseNumber} `;
    });
  }
  return tempClassString.trim();
};

const spanWrapper = (wordMap, paragraphNodeList) => {
  // get the text inside the element
  paragraphNodeList.forEach(paragraph => {
    // split text into words array
    const words = paragraph.textContent.split(' ');

    // wrap each word in a <span> with classes
    const wrappedWords = words.map(word => {
      const classString = classApplier(wordMap, word);
      let tempHTML = '';
      if (classString.length > 0) {
        tempHTML = `<span class="${classString}">${word}</span>`;
      } else {
        tempHTML = `<span>${word}</span>`;
      }
      return tempHTML;
    }
    ).join(' ');
    // set as innerHTML for paragraph?
    paragraph.innerHTML = wrappedWords; //eslint-disable-line
  });

  return paragraphNodeList; // This return is strictly here for testing
};

module.exports = { spanWrapper, classApplier };
