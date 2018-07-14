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

    const _recursiveCheckHelper = (currNode, colorClass, tempNodeCollectionOne, tempNodeCollectionTwo, nextOrPrevious) => {
      let direction = '';
      let mainSuffix = '';
      let oppositeSuffix = '';
      // Here we are determining which direction we need to traverse the DOM
      //  based on what arguments are passed into this helper
      if (nextOrPrevious === 'next') {
        direction = 'nextSibling';
        mainSuffix = 'right';
        oppositeSuffix = 'left';
      } else {
        direction = 'previousSibling';
        mainSuffix = 'left';
        oppositeSuffix = 'right';
      }
      console.log(`Helper ${nextOrPrevious} move with `, colorClass, ' Word: ', currNode[direction].textContent);
      
      // Stop the Recursive call if the sibling does not exist
      if (!currNode[direction]) return;

      // Skip if the node is whitepsace
      if (currNode[direction].textContent === ' ') {
        console.log('SPACE found');
        currNode = currNode[direction];
        _recursiveCheckHelper(currNode, colorClass, tempNodeCollectionOne, tempNodeCollectionTwo, nextOrPrevious);
        
        // ADD NODE to tempCollection and CONTINUE recursion as we have not found end of phrase
      } else if (currNode[direction].classList.contains(`${colorClass}-middle`)) {
        console.log('MIDDLE FOUND ', colorClass, tempNodeCollectionOne);
        tempNodeCollectionOne.push(currNode[direction]);
        currNode = currNode[direction];
        _recursiveCheckHelper(currNode, colorClass, tempNodeCollectionOne, tempNodeCollectionTwo, nextOrPrevious);
        
        // STOP recursion and ADD NODE as we have found the end of the phrase
      } else if (currNode[direction].classList.contains(`${colorClass}-${mainSuffix}`)) {
        console.log(`${nextOrPrevious} FOUND `, colorClass, tempNodeCollectionOne);
        tempNodeCollectionOne.push(currNode[direction]);

        // IF the LAST word in the phrase has a middle or right class then
        //  we know that this word is part of another phrase to the left
        //  so we need to traverse its previous siblings and save them to the
        //  secondary collection
        const endClassList = currNode[direction].classList;
        const includesMiddleOrOppositeClass = (endClassList.value.includes('middle') || endClassList.value.includes(`${oppositeSuffix}`));

        if (includesMiddleOrOppositeClass) {
          // Filter out the current color so we don't search the same color
          const classesArray = endClassList.value
            .split(' ')
            .filter(classItem => !classItem.includes(colorClass) && !(classItem.length === 0));

          // Get the left sibling and determine if it has a middle or right class
          const nextPriorityColor = colorPriority(classesArray.join(''));
          _recursiveCheckHelper(currNode[direction], nextPriorityColor, tempNodeCollectionTwo, null, nextOrPrevious);
        }
      }
    };

    const recursiveCheckRight = (node, color) => {
      const mainNodeCollection = [node];
      const secondaryNodeCollection = [];

      _recursiveCheckHelper(node, color, mainNodeCollection, secondaryNodeCollection, 'next');

      console.log('RIGHT = Main: ', mainNodeCollection, 'Secondary: ', secondaryNodeCollection);
      return { mainNodeCollection, secondaryNodeCollection };
    };

    const recursiveCheckLeft = (node, color) => {
      const mainNodeCollection = [node];
      const secondaryNodeCollection = [];
      
      _recursiveCheckHelper(node, color, mainNodeCollection, secondaryNodeCollection, 'previous');

      console.log('LEFT = Main: ', mainNodeCollection, 'Secondary: ', secondaryNodeCollection);
      return { mainNodeCollection, secondaryNodeCollection };
    };

    // mouseOverClassApplier checks for which part of the phrase the main word is in using
    //  the highest priority color, and determines which direction, if not both,
    //  to traverse the DOM recursively to grab the correct nodes.
    const mouseOverClassApplier = (targetSpan, mainClassList, state) => {
      // Find all the colors the hovered span is in...
      
      //  +++++++++ HELPER FUNCTIONS +++++++++

      // THIS creates a new array with only the base classes that exist in the 
      //  hovered span to prevent us from duplicating work on a single color
      //  since there are typically two classes per color.
      const getColors = (classNames) => {
        const colors = [];
        if (classNames.includes('red-list')) {
          colors.push('red-list');
        }
        if (classNames.includes('green-list')) {
          colors.push('green-list');
        }
        if (classNames.includes('blue-list')) {
          colors.push('blue-list');
        }
        if (classNames.includes('purple-list')) {
          colors.push('purple-list');
        }
        if (classNames.includes('grey-list')) {
          colors.push('grey-list');
        }
        return colors;
      };

      const hoveredSpanColors = getColors(targetSpan.className);
      console.log(hoveredSpanColors);

      state.mainClassCollection.push(targetSpan);
      hoveredSpanColors.forEach(colorClass => {
        // If the current word is the left most word then start checking to the right
        //  to find the rest of the main phrase.
        if (mainClassList.contains(`${colorClass}-left`)) {
          console.log('HOVERED Span has LEFT CLASS....');
          const tempCollection = recursiveCheckRight(targetSpan.nextElementSibling, colorClass);
          state.mainNodeCollection = state.mainClassCollection.concat(tempCollection.mainNodeCollection);
          state.secondaryNodeCollection = tempCollection.secondaryNodeCollection;

          // Now check if the current word has a middle or right as this means
          //  our main word is in another phrase.
          //  If true we will search to the left further...
          const currNodeIncludesMiddleOrRightClass = (mainClassList.value.includes('middle') || mainClassList.value.includes('right'));
          if (currNodeIncludesMiddleOrRightClass) {
            console.log('Starting LEFT-CLASS ALSO has phrase to left');

            // We need to copy the mainClassList and remove the last color from it
            //  in order to find the next highest priority color.
            const nextPriorityColor = getNextColor(mainClassList, colorClass);
            state.secondaryNodeCollection = state.secondaryNodeCollection.concat(recursiveCheckLeft(targetSpan.previousElementSibling, nextPriorityColor).mainNodeCollection);
          }

          // Take the main collection and push the elements class to a stored state
          //  so we can undo the highlights on mouseout.
          //  Then change the class to have the hover effect.
          state.mainNodeCollection.forEach(span => {
            state.mainClassCollection.push(span.className);
            span.className = `${colorClass}-hover ${colorClass}-middle-hover`;
          });
          // IF the secondary collection was pushed to then store their classes as well
          //  and remove each spans highlight effect.
          if (state.secondaryNodeCollection.length > 0) {
            console.log('Secondary Collection: ', state.secondaryNodeCollection);
            state.secondaryNodeCollection.forEach(span => {
              state.secondaryClassCollection.push(span.className);
              span.className = '';
            });
          }
        // LOOK LEFT until finding left class and add the collection found to state.
        } else if (mainClassList.contains(`${colorClass}-right`)) {
          console.log('HAS RIGHT CLASS....');
          const tempCollection = recursiveCheckLeft(targetSpan.previousElementSibling, colorClass);
          state.mainNodeCollection = state.mainClassCollection.concat(tempCollection.mainNodeCollection);
          state.secondaryNodeCollection = tempCollection.secondaryNodeCollection;

          const currNodeIncludesMiddleOrLeftClass = (mainClassList.value.includes('middle') || mainClassList.value.includes('left'));

          // If the other classes contain a right or middle then we need to search left
          // if (includesMiddleOrOppositeClass(mainClassList, 'left')) {
          console.log('----HERE-----', currNodeIncludesMiddleOrLeftClass);
          if (currNodeIncludesMiddleOrLeftClass) {
            console.log('Starting RIGHT-CLASS ALSO has phrase to right');
            const nextPriorityColor = getNextColor(mainClassList, colorClass);
            state.secondaryNodeCollection = state.secondaryNodeCollection.concat(recursiveCheckRight(targetSpan.nextElementSibling, nextPriorityColor).mainNodeCollection);
          }


          // Take the node collection and push it's class to state store, then change the class to -hover
          state.mainNodeCollection.forEach(span => {
            state.mainClassCollection.push(span.className);
            span.className = `${colorClass}-hover ${colorClass}-middle-hover`;
          });
          // IF the secondary collection was pushed to then store their classes as well
          //  and remove each spans highlight effect.
          if (state.secondaryNodeCollection.length > 0) {
            console.log('Secondary Collection: ', state.secondaryNodeCollection);
            state.secondaryNodeCollection.forEach(span => {
              state.secondaryClassCollection.push(span.className);
              span.className = '';
            });
          }
          // For a word in the middle of a phrase we need to look LEFT & RIGHT
          //  until finding left & right class and add the collection found to state.
        } else if (mainClassList.contains(`${colorClass}-middle`)) {
          console.log('HAS MIDDLE CLASS....');
          // LOOK LEFT & RIGHT until finding both and adding to state
          const mainLeftCollection = recursiveCheckLeft(targetSpan.previousElementSibling, colorClass).mainNodeCollection;
          const mainRightCollection = recursiveCheckRight(targetSpan.nextElementSibling, colorClass).mainNodeCollection;
          const tempMainCollection = mainLeftCollection.concat(mainRightCollection);
          state.mainNodeCollection = tempMainCollection.filter((span, position) => tempMainCollection.indexOf(span) === position);
        
          const secondaryLeftCollection = recursiveCheckLeft(targetSpan, colorClass).secondaryNodeCollection;
          const secondaryRightCollection = recursiveCheckRight(targetSpan, colorClass).secondaryNodeCollection;
          state.secondaryNodeCollection = secondaryLeftCollection.concat(secondaryRightCollection);

          // take the node collection and push it's class to state, then change the class to -hover
          state.mainNodeCollection.forEach(span => {
            state.mainClassCollection.push(span.className);
            span.className = `${colorClass}-hover ${colorClass}-middle-hover`;
          });
          if (state.secondaryNodeCollection.length > 0) {
            console.log('MIDDLE Secondary Collection: ', state.secondaryNodeCollection);
            state.secondaryNodeCollection.forEach(span => {
              state.secondaryClassCollection.push(span.className);
              span.className = '';
            });
          }
          // By now we know that our highest priority color phrase was hovered ONLY having
          //  the base class (.red-list .blue-list, etc.) so we can add it to the main state
          //  store collection andt then we need to check if it is in other phrases. If so
          //  we'll check left and right of it to grab those nodes and put them in the
          //  secondary state store.
        } else {
          console.log('HAS BASE CLASS ONLY....');
          // IF mainClassList is longer than 2 then there are 2 or more colors, so we need to 
          //  look left and right as we are in the base phrase and it would have only one class
          //  if not in other phrases.
          if (mainClassList.length > 2) {
          // Find next priority color spans and add them to secondary state
            const nextPriorityColor = getNextColor(mainClassList, colorClass);
            state.secondaryNodeCollection = (recursiveCheckRight(targetSpan.nextSibling, nextPriorityColor).mainNodeCollection);
            state.secondaryNodeCollection = state.secondaryNodeCollection.concat(recursiveCheckLeft(targetSpan.previousSibling, nextPriorityColor).mainNodeCollection);

            // Remove duplicate spans since we are using the same recursive function.
            //  TODO: Need to debug this so that we don't have duplicate spans added to 
            //        state store.
            state.secondaryNodeCollection = state.secondaryNodeCollection.filter((span, position) => state.secondaryNodeCollection.indexOf(span) === position);
          } 
          state.mainNodeCollection.push(targetSpan);
          console.log('STATE AFTER BASE CLASS: ', state);

          // take the node collection and push it's class to state, then change the class to -hover
          state.mainNodeCollection.forEach(span => {
            state.mainClassCollection.push(span.className);
            span.className = `${colorClass}-hover ${colorClass}-middle-hover`;
          });
          console.log(state.secondaryNodeCollection);
          state.secondaryNodeCollection.forEach(span => {
            state.secondaryClassCollection.push(span.className);
            span.className = '';
          });
        }
      });
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

      // const topColorClass = colorPriority(classList.value);

      spanCollection[i].addEventListener('mouseover', () => {
        console.log('Mouse OVER...');
        // Check which part of the phrase the class is in and apply the 
        //  appropriate classes to it.
        mouseOverClassApplier(spanCollection[i], classList, spanState);
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
