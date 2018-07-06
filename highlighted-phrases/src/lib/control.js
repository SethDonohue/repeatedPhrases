// Main Controller

export default class Controller {
  constructor(div, wordLists) {
    this.divTarget = div;
    this.wordLists = wordLists;
    this.wordMap = {};
  }

  createWordMap(wordLists) {
    Object.keys(wordLists).forEach(colorList => {
      wordLists[colorList].forEach(string => {
        // TODO: may need to handle punctuation here?
        const words = string.split(' ');
        words.forEach(word => {
          if (!this.wordMap[word.toLowerCase()]) {
            this.wordMap[word.toLowerCase()] = [colorList];
          } else if (!this.wordMap[word].includes(colorList)) {
            this.wordMap[word.toLowerCase()].push(colorList);
          }
        });
      });
    });
    console.log(this.wordMap);
  }


  highlightRender(string) {
    // Erase Previous render to this.divTarget
    const targetElement = document.getElementById(this.divTarget); // assuming the div is an #id
    targetElement.innerHTML = ''; // is this the most efficient or fastest way to clear a div?
    
    // Render NEW text with highlights

    // Compare string to word list
    // wrap each word in a <span> so it can be colored
    // only wrap the word in a span:
    // IF it is in the word lists
    // IF it is in a phrase AND next to all the other words in that phrase
    // Add classes to each span depending on which phrase it is in.
  }
}
