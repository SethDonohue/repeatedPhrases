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

    // Add Phrase Length per Color if not word to know how far to look
    //  ahead when applying highlights
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

    // Add Word Index per Color to not apply incorrect class for highlights
    const addIndexToWordMap = (colorList, word, index) => {
      const newProperty = `${colorList}Index`;
      this.wordMap[word.toLowerCase()][newProperty] = index;
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
          // need to determine index of word in phrase, excluding spaces
          for (let i = 0; i < words.length; i++) {
            addColorToWordMap(words[i], colorList);
            addLengthToWordMap(colorList, words[i], words.length);
            addIndexToWordMap(colorList, words[i], i);
          }
        }
      });
    });
  }

  // ADD listeners to each span which will control all the logic for the hover effect
  //  TODO: MOVE PORTIONS of this to it's own methods?
  addMouseListener(spanCollection) { // eslint-disable-line

    const colorPriority = (classListValue) => {
      // This function takes in a string in order to work with arrays and DOMTokenLists
      if (classListValue.includes('red-list')) {
        return 'red-list';
      }
      if (classListValue.includes('green-list')) {
        return 'green-list';
      }
      if (classListValue.includes('blue-list')) {
        return 'blue-list';
      }
      if (classListValue.includes('purple-list')) {
        return 'purple-list';
      }
      if (classListValue.includes('grey-list')) {
        return 'grey-list';
      }
    };

    const recursiveCheckRight = (node, color) => {
      const mainNodeCollection = [node];
      const secondaryNodeCollection = [];

      const _recursiveCheckHelper = (currNode, colorClass, tempNodeCollection) => {
        console.log('RIGHT move', colorClass, 'text: ', currNode.textContent);
        // Stop the Recursive call if the previous sibling does not exist
        if (!currNode.nextSibling) return;
        // Skip to next sibling if current is whitepsace
        if (currNode.nextSibling.textContent === ' ') {
          console.log('SPACE found');
          currNode = currNode.nextSibling;
          _recursiveCheckHelper(currNode, colorClass, tempNodeCollection);
        } else if (currNode.nextSibling.classList.contains(`${colorClass}-middle`)) {
          // ADD NODE to tempCollection and CONTINUE recursion as we have not found end of the  phrase
          console.log('MIDDLE FOUND', colorClass, tempNodeCollection);
          tempNodeCollection.push(currNode.nextSibling);
          currNode = currNode.nextSibling;
          _recursiveCheckHelper(currNode, colorClass, tempNodeCollection);
        } else if (currNode.nextSibling.classList.contains(`${colorClass}-right`)) {
          // STOP recursion and ADD NODE as we have found the end of the phrase
          console.log('RIGHT FOUND...');
          console.log('Color: ', colorClass, 'WORD: ', currNode.nextSibling.textContent);
          tempNodeCollection.push(currNode.nextSibling);

          const rightClassList = currNode.nextSibling.classList;
          console.log('RIGHT ClassList: ', rightClassList.length);

          // IF the LAST word in the phrase has MORE than one color (3+ classes) then
          //  we need to check if the other classes (not the topColor) contain a right or middle class.
          //  If they do we know that this word is part of another phrase to the left
          //  so we need to traverse its previous siblings and save them to the
          //  secondary collection
          const includesMiddleOrLeftClass = (rightClassList.value.includes('middle') || rightClassList.value.includes('left'));

          if (includesMiddleOrLeftClass) {
            // Filter out the current color and grab the next priority color to know what
            //  phrase color to continue looking for
            const classesArray = rightClassList.value
              .split(' ')
              .filter(classItem => !classItem.includes(colorClass) && !(classItem.length === 0));
            
            const nextPriorityColor = colorPriority(classesArray.join(''));

            // Get the RIGHT sibling and determine if it has a middle or right class
            const rightSibling = currNode.nextSibling;
            console.log('rightsib text: ', rightSibling.textContent, nextPriorityColor);
            _recursiveCheckHelper(rightSibling, nextPriorityColor, secondaryNodeCollection);
            console.log('Second Collection: ', secondaryNodeCollection);
          }
        }
      };
      _recursiveCheckHelper(node, color, mainNodeCollection);
      return { mainNodeCollection, secondaryNodeCollection };
    };

    const recursiveCheckLeft = (node, color) => {
      const mainNodeCollection = [node];
      const secondaryNodeCollection = [];
      
      const _recursiveCheckHelper = (currNode, colorClass, tempNodeCollection) => {
        console.log('LEFT move', colorClass, 'text: ', currNode.textContent);
        // Stop the Recursive call if the previous sibling does not exist
        if (!currNode.previousSibling) return;
        if (currNode.previousSibling.textContent === ' ') {
          console.log('SPACE found');
          currNode = currNode.previousSibling;
          _recursiveCheckHelper(currNode, colorClass, tempNodeCollection);
        } else if (currNode.previousSibling.classList.contains(`${colorClass}-middle`)) {
          // ADD NODE to tempCollection and CONTINUE recursion as we have not found end of phrase
          console.log('MIDDLE FOUND', colorClass, tempNodeCollection);
          tempNodeCollection.push(currNode.previousSibling);
          currNode = currNode.previousSibling;
          _recursiveCheckHelper(currNode, colorClass, tempNodeCollection);

        } else if (currNode.previousSibling.classList.contains(`${colorClass}-left`)) {
          // STOP recursion and ADD NODE as we have found the end of the phrase
          console.log('LEFT FOUND...');
          console.log('Color: ', colorClass, 'WORD: ', currNode.previousSibling.textContent);
          tempNodeCollection.push(currNode.previousSibling);
          
          const leftClassList = currNode.previousSibling.classList;
          console.log('LEFT ClassList: ', leftClassList.length);
          
          // IF the LAST word in the phrase has MORE than one color (3+ classes) then
          //  we need to check if the other classes (not the topColor) contain a right or middle class.
          //  If they do we know that this word is part of another phrase to the left
          //  so we need to traverse its previous siblings and save them to the
          //  secondary collection
          const includesMiddleOrRightClass = (leftClassList.value.includes('middle') || leftClassList.value.includes('right'));

          if (includesMiddleOrRightClass) {
            const classesArray = leftClassList.value
              .split(' ')
              .filter(classItem => !classItem.includes(colorClass) && !(classItem.length === 0));

            // Get the left sibling and determine if it has a middle or right class
            const nextPriorityColor = colorPriority(classesArray.join(''));
            const leftSibling = currNode.previousSibling;
            console.log('leftsib text: ', leftSibling.textContent, nextPriorityColor);
            _recursiveCheckHelper(leftSibling, nextPriorityColor, secondaryNodeCollection);
            console.log('Second Collection: ', secondaryNodeCollection);
          }
        }
      };
      _recursiveCheckHelper(node, color, mainNodeCollection);
      return { mainNodeCollection, secondaryNodeCollection };
    };

    const mouseOverClassApplier = (colorClass, targetSpan, classList, state) => {
      // Check which part of the phrase the class is in
      if (classList.contains(`${colorClass}-left`)) {
        console.log('HAS LEFT CLASS....');
        // LOOK RIGHT until finding right class and add the collection found to state
        state.mainNodeCollection = recursiveCheckRight(targetSpan, colorClass).mainNodeCollection;
        state.secondaryNodeCollection = recursiveCheckRight(targetSpan, colorClass).secondaryNodeCollection;

        console.log('STATE: ', state);

        // take the node col        // take the node collection and push it's class to state, then change the class to -hover
        state.mainNodeCollection.forEach(span => {
          state.mainClassCollection.push(span.className);
          span.className = `${colorClass}-hover`;
        });
        if (state.secondaryNodeCollection.length > 0) {
          console.log('Secondary Collection: ', state.secondaryNodeCollection);
          state.secondaryNodeCollection.forEach(span => {
            state.secondaryClassCollection.push(span.className);
            span.className = '';
          });
        }
      } else if (classList.contains(`${colorClass}-right`)) {
        console.log('HAS RIGHT CLASS....');
        // LOOK LEFT until finding left class and add the collection found to state
        state.mainNodeCollection = recursiveCheckLeft(targetSpan, colorClass).mainNodeCollection;
        state.secondaryNodeCollection = recursiveCheckLeft(targetSpan, colorClass).secondaryNodeCollection;

        console.log('STATE: ', state);

        // take the node col        // take the node collection and push it's class to state, then change the class to -hover
        state.mainNodeCollection.forEach(span => {
          state.mainClassCollection.push(span.className);
          span.className = `${colorClass}-hover`;
        });
        if (state.secondaryNodeCollection.length > 0) {
          console.log('Secondary Collection: ', state.secondaryNodeCollection);
          state.secondaryNodeCollection.forEach(span => {
            state.secondaryClassCollection.push(span.className);
            span.className = '';
          });
        }

        // TODO: FINISH middle class logic
        // } else if (classList.contains(`${colorClass}-middle`)) {
        //   console.log('HAS MIDDLE CLASS....');
      } else if (classList.contains(`${colorClass}`)) {
        console.log('HAS BASE CLASS ONLY....');
        // ONE WORD PHRASE so no further searching for main color, just add span to the state
        state.mainNodeCollection.push(targetSpan);
        console.log(state.mainNodeCollection);

        // take the node collection and push it's class to state, then change the class to -hover
        state.mainNodeCollection.forEach(span => {
          state.mainClassCollection.push(span.className);
          span.className = `${colorClass}-hover`;
        });

        //      If left class/attr, look right until right class/attr found in same color
        //        - Use CSS attribute selector?
        //      IF middle class/attr, look left, then right, add all elements/spans to collection
        //      If Right class/attr, look left until left class/attr found in same color
        //        Add all elements to collection
        //        for all found elements 
        //          change css to remove all other colors, darken this color and change text to white
      }
    };

    for (let i = 0; i < spanCollection.length; i++) {
      // Store the Original State of each span to use for mouseout listener
      const spanState = {
        mainNodeCollection: [],
        mainClassCollection: [],
        secondaryNodeCollection: [],
        secondaryClassCollection: [],
      };

      // const mainClassCollection = [];
      const { classList } = spanCollection[i];
      const topColorClass = colorPriority(classList.value);

      spanCollection[i].addEventListener('mouseover', () => {
        console.log('Mouse OVER...');
        console.log(classList);

        // Check which part of the phrase the class is in
        mouseOverClassApplier(topColorClass, spanCollection[i], classList, spanState);
      });

      // ADD Listener to remove hover effects
      spanCollection[i].addEventListener('mouseout', () => {
        console.log('Mouse OUT...');

        spanState.mainNodeCollection.forEach((span, index) => {
          const currClass = spanState.mainClassCollection[index];
          span.className = `${currClass}`;
        });

        spanState.secondaryNodeCollection.forEach((span, index) => {
          const currClass = spanState.secondaryClassCollection[index];
          span.className = `${currClass}`;
        });

        // NEED to clear out state so that it is not duplicated on multiple mouseovers
        spanState.mainNodeCollection = [];
        spanState.secondaryNodeCollection = [];
        spanState.mainClassCollection = [];
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
          const wordIndex = this.wordMap[currWord][`${currColor}Index`];
          
          // IF this word is NOT at the beginning of the prhase or
          //  a single word then skip this loop as it will have proper
          //  classes applied by other first word work
          if (wordIndex > 0) {
            break;
          }

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
        words[i] = currWord;
      }
    }

    // Take all the words and join back together to keep original input format
    //  TODO: WOULD LIKE TO refactor this for .childNodes or .siblings methods
    const resultHTML = words.join('');
    return resultHTML;
  }

  renderHighlights(inputString) {
    // CREATE the word map so we can know how to highlight each word
    this.createWordMap(this.wordLists);
    
    const newHTML = this.compareNeighbors(inputString);
    const targetElement = document.getElementById(this.divTarget); // Assumption: The div is given as an #id
    targetElement.innerHTML = newHTML; // Research: Is this the most efficient or fastest way to clear a div?

    // ADD event listeners to all spans
    // TODO: NEED TO make this selector more specific as
    //        we don't want to target ALL spans on the page
    // const allSpans = document.getElementsByTagName(`${this.divTarget} span`);
    const allSpans = targetElement.getElementsByTagName(`span`);
    this.addMouseListener(allSpans);

    // Render NEW text with highlights

    // Compare string to word list
    // wrap each word in a <span> so it can be colored
    // only wrap the word in a span:
    // IF it is in the word lists
    // IF it is in a phrase AND next to all the other words in that phrase
    // Add classes to each span depending on which phrase it is in.
  }

  // hoverOver(target) {
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
  // }
}
