
const spanWrapper = (paragraphNodeList) => {
  // get the text inside the element
  paragraphNodeList.forEach(paragraph => {
    // split text into words array
    const words = paragraph.textContent.split(' ');

    // wrap each word in a <span>
    const wrappedWords = words.map(word => `<span>${word}</span>`).join(' ');

    // set as innerHTML for paragraph?
    paragraph.innerHTML = wrappedWords; //eslint-disable-line
  });

  return paragraphNodeList; // This return is strictly here for testing
};

module.exports = spanWrapper;
