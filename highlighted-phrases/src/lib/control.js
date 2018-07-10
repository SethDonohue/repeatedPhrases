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
  }

  addMouseOverListener(spanCollection) { // eslint-disable-line

    const colorPriority = (classList) => {
      if (classList.contains('red-list')) {
        return 'red-list';
      }
      if (classList.contains('green-list')) {
        return 'green-list';
      }
      if (classList.contains('blue-list')) {
        return 'blue-list';
      }
      if (classList.contains('purple-list')) {
        return 'purple-list';
      }
      if (classList.contains('grey-list')) {
        return 'grey-list';
      }
    };

    const recursiveCheckRight = (node, color) => {
      const nodeCollection = [node];
      
      const _recusriveCheckHelper = (currNode, colorClass, tempNodeCollection) => {
        console.log('RIGHT move', colorClass);
        if (currNode.nextSibling.textContent === ' ') {
          console.log('SPACE found');
          currNode = currNode.nextSibling;
          _recusriveCheckHelper(currNode, colorClass, tempNodeCollection);
        } else if (currNode.nextSibling.classList.contains(`${colorClass}-middle`)) {
          // ADD NODE to tempCollection and CONTINUE recursion as we have not found end of phrase
          console.log('MIDDLE FOUND', colorClass, tempNodeCollection);
          tempNodeCollection.push(currNode.nextSibling);
          currNode = currNode.nextSibling;
          _recusriveCheckHelper(currNode, colorClass);

        } else if (currNode.nextSibling.classList.contains(`${colorClass}-right`)) {
          // STOP recursion and ADD NODE as we have found the end of the phrase
          console.log('RIGHT FOUND', colorClass);
          tempNodeCollection.push(currNode.nextSibling);
          
          // if (currNode.nextSibling.classList.length){
          //   currNode.classList.forEach(class => {
          //     recursiveCheckRight(currNode.nextSibling)
          //   });
          // }
        }
      };
      _recusriveCheckHelper(node, color, nodeCollection);
      return nodeCollection;
    };


    for (let i = 0; i < spanCollection.length; i++) {
      const currSpan = spanCollection[i];
      const { classList } = currSpan;

      currSpan.addEventListener('mouseover', () => {
        console.log('HOVERING...');
        console.log(classList);
        const topColorClass = colorPriority(classList);
        let nodeCollection = [];

        if (classList.contains(`${topColorClass}-left`)) {
          console.log('HAS LEFT CLASS....');
          // LOOK RIGHT until finding right class
          nodeCollection = recursiveCheckRight(currSpan, topColorClass);
          console.log(nodeCollection);

          // take the node collection
        }

        // if (classList.contains(`${topColorClass}-middle`)) {
        //   console.log('HAS MIDDLE CLASS....');
        // }
        
        // if (classList.contains(`${topColorClass}-right`)) {
        //   console.log('HAS RIGHT CLASS....');
        //   recursiveCheckLeft(currSpan, 'left');

        // }

        //      If left class/attr, look right until right class/attr found in same color
        //        - Use CSS attribute selector?
        //      IF middle class/attr, look left, then right, add all elements/spans to collection
        //      If Right class/attr, look left until left class/attr found in same color
        //        Add all elements to collection
        //        for all found elements 
        //          change css to remove all other colors, darken this color and change text to white


      });

      currSpan.addEventListener('mouseout', function () {
        console.log('OUT...');
      });
    }
  }

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
        // If word is the first in phrase return -left class segment
        return '-left ';
      }
      if (currentIndex === endIndex - 1) {
        // If word is last in phrase return - right segment
        return '-right ';
      }
      // otherwise return middle segment
      return '-middle ';
    };

    // For each word build up which classes should be applied
    for (let i = 0; i < words.length; i++) {
      const currWord = words[i];
      
      // Only apply classes if the word is in the wordMap
      if (this.wordMap[currWord]) {
        const currColors = this.wordMap[currWord].colors;

        // For each color possible for the word we want to compare the following
        //  words and their phrases up to the max possible phrase 
        //  length of the current word from the wordMap and
        //  apply those phrases to the span class for each word
        for (let j = 0; j < currColors.length; j++) {
          const currColor = this.wordMap[currWord].colors[j];
          const phraseLength = this.wordMap[currWord][`${currColor}Length`];

          if (phraseLength === 1) {
            appliedColorClasses[i].push(currColor);
          } else {
            // Skip if this word already has this color
            if (appliedColorClasses[i].includes(currColor)) {
              break;
            }

            // This begins the look ahead logic to determine if a
            //  word is in a phrase and which classes should be 
            //  applied to it based on the next words in the words
            //  array.

            let hasCommonNeighborColors = true;
            let endOfPhraseIndex = i + (phraseLength);
            const trackedIndexes = [i];

            // look ahead at each word and if it doesn't contain
            //  the same color in wordMap then stop and throw flag

            for (let k = i + 1; k < endOfPhraseIndex; k++) {
              let nextWord = words[k];
                
              // Skip this word and move to next if it is whitespace or punctuation
              //  TODO: CHANGE to regex below
              while (nextWord === ' ') {
                k++;
                endOfPhraseIndex++;
                nextWord = words[k];
              }
                
              trackedIndexes.push(k);
              if (!this.wordMap[nextWord] || !(this.wordMap[nextWord].colors.includes(currColor))) {
                hasCommonNeighborColors = false;
                break;
              }
            }
            if (hasCommonNeighborColors) {
              // If flag is still true then add the class to appliedClases
              //  array that we will use to apply to all the words.
              trackedIndexes.forEach(index => {
                const tempClass = `${currColor}${isWordAtBeginningOrEnd(index, i, endOfPhraseIndex)}`;
                appliedColorClasses[index].push(tempClass);
                appliedColorClasses[index].push(currColor);
              });
            }
          }
        }
      }
    }

    // Take the words and appliedClasses and combine them
    for (let i = 0; i < words.length; i++) {
      const currWord = words[i];
      if (appliedColorClasses[i].length > 0) {
        const wordClasses = appliedColorClasses[i].join(' ');
        const mouseOverAttr = `mouse`
        words[i] = `<span class="${wordClasses}">${currWord}</span>`;
      } else {
        // words[i] = `<span>${currWord}</span>`;
        // TODO: MAY NEED TO have spans our every word and punctuation to highlght them easier
        words[i] = currWord;
      }
    }

    // Take all the words and join back together to keep original input format
    //  TODO: WOULD LIKE TO refactor this for .childNodes or .siblings methods
    const resultHTML = words.join('');
    return resultHTML;
  }

  renderHighlights(inputString) {
    this.createWordMap(this.wordLists);
    const newHTML = this.compareNeighbors(inputString);
    // Erase Previous render to this.divTarget
    const targetElement = document.getElementById(this.divTarget); // assuming the div is an #id
    // targetElement.innerHTML = ''; // is this the most efficient or fastest way to clear a div?
    targetElement.innerHTML = newHTML;

    // ADD event listeners to all spans
    const allSpans = document.getElementsByTagName('span');
    this.addMouseOverListener(allSpans);

    // Render NEW text with highlights

    // Compare string to word list
    // wrap each word in a <span> so it can be colored
    // only wrap the word in a span:
    // IF it is in the word lists
    // IF it is in a phrase AND next to all the other words in that phrase
    // Add classes to each span depending on which phrase it is in.
  }

  hoverOver(target) {
    // Take target element on mouseover
    //  Grab classes from target 
    // TODO: 1 & 2 can probably be combined
    //    1.)
    //    Take ALL color classes and determine which is priority for this word 
    //      If ONE color only choose that color
    //      If left class/attr, look right until right class/attr found in same color
    //        - Use CSS attribute selector?
    //      IF middle class/attr, look left, then right, add all elements/spans to collection
    //      If Right class/attr, look left until left class/attr found in same color
    //        Add all elements to collection
    //        for all found elements 
    //          change css to remove all other colors, darken this color and change text to white
    //    2.)
    //    If multiple COLOR classes
    //      Select priority color
    //        then do same logic as above
  }
}
