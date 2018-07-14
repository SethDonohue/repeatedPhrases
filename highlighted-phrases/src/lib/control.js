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

    // Add Phrase Length per Color to know how far to look
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

  // addMouseListener adds listeners to each span which will control all the
  //  logic for the hover effect on each span.
  addMouseListener(spanCollection) { // eslint-disable-line

    // colorPriority takes in a string in order to work with arrays and DOMTokenLists
    //  and then returns the highest priority color.
    const colorPriority = (classListValue) => {
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

    const includesMiddleOrOppositeClass = (classList, oppositeSuffix) => (classList.value.includes('middle') || classList.value.includes(oppositeSuffix));

    const getNextColor = (classList, colorClass) => {
      const filteredList = classList.value
        .split(' ')
        .filter(classItem => !classItem.includes(colorClass) && !(classItem.length === 0));

      return colorPriority(filteredList.join(''));
    };

    // _recursiveCheckHelper is the main method for storing the proper nodes to apply
    //   the hover-highlight effects to.
    //  - It creates a main collection to apply the primary hover-highlight effect for the
    //    highest priority color of the word being hovered.
    //  - If the word also contains other color classes this method creates a secondary
    //    collection of nodes to remove the classes from, which removes their highlights.
    // 
    const _recursiveCheckHelper = (currNode, colorClass, tempNodeCollectionOne, tempNodeCollectionTwo, nextOrPrevious) => {
      let direction = '';
      let mainSuffix = '';
      let oppositeSuffix = '';
      // Here we are determining which direction we need to traverse the DOM
      //  based on what arguments are passed into this helper.
      //  This was given the nextOrPrevious parameter in order to make the
      //  code more DRY.
      if (nextOrPrevious === 'next') {
        direction = 'nextElementSibling';
        mainSuffix = 'right';
        oppositeSuffix = 'left';
      } else {
        direction = 'previousElementSibling';
        mainSuffix = 'left';
        oppositeSuffix = 'right';
      }
      
      // Stop this call if there is no sibling or the node that was passed is null.
      //  This is usually associated with the end or beginning of the sentence.
      if (!currNode) return;
      if (!currNode[direction]) return;
      
      console.log(`Helper ${nextOrPrevious} move with `, colorClass, ' Word: ', currNode[direction].textContent);
      // Skip the next node if the next node is whitepsace.
      if (currNode[direction].textContent === ' ') {
        console.log('SPACE found');
        currNode = currNode[direction];
        _recursiveCheckHelper(currNode, colorClass, tempNodeCollectionOne, tempNodeCollectionTwo, nextOrPrevious);
        
        // If the node is in the middle of a phrase add it to tempCollection
        //  and CONTINUE recursion as we have not found end of the phrase.
      } else if (currNode[direction].classList.contains(`${colorClass}-middle`)) {
        tempNodeCollectionOne.push(currNode[direction]);
        console.log('MIDDLE FOUND ', colorClass, currNode[direction].textContent);
        currNode = currNode[direction];
        _recursiveCheckHelper(currNode, colorClass, tempNodeCollectionOne, tempNodeCollectionTwo, nextOrPrevious);
        
        // STOP recursion and ADD NODE as we have found the end of the phrase.
      } else if (currNode[direction].classList.contains(`${colorClass}-${mainSuffix}`)) {
        tempNodeCollectionOne.push(currNode[direction]);
        console.log(`${nextOrPrevious} FOUND `, colorClass, currNode[direction].textContent);

        // IF the LAST word in the phrase has a middle or right class then
        //  we know that this word is part of another phrase to the left
        //  so we need to traverse its previous siblings and save them to the
        //  secondary collection.
        const endClassList = currNode[direction].classList;

        if (includesMiddleOrOppositeClass(endClassList, oppositeSuffix)) {
          // Filter out the current color so we don't search the same color,
          //  and find the next priority color.
          const nextPriorityColor = getNextColor(endClassList, colorClass);
          _recursiveCheckHelper(currNode[direction], nextPriorityColor, tempNodeCollectionTwo, null, nextOrPrevious);
        }
      }
    };

    const recursiveCheckRight = (node, color) => {
      const mainNodeCollection = [];
      const secondaryNodeCollection = [];

      // Push first node to main collection if it is not null,
      //  temporary solution for dealing with the beginning or end of sentences.
      if (node) {
        mainNodeCollection.push(node);
      }

      _recursiveCheckHelper(node, color, mainNodeCollection, secondaryNodeCollection, 'next');

      console.log('RIGHT Main: ', mainNodeCollection, 'Secondary: ', secondaryNodeCollection);
      return { mainNodeCollection, secondaryNodeCollection }; //eslint-disable-line
    };

    const recursiveCheckLeft = (node, color) => {
      const mainNodeCollection = [];
      const secondaryNodeCollection = [];
      // Push first node to main collection if it is not null,
      //  temporary solution tofor dealing with the beginning of or end of sentences.
      if (node) {
        mainNodeCollection.push(node);
      }

      _recursiveCheckHelper(node, color, mainNodeCollection, secondaryNodeCollection, 'previous');

      console.log('LEFT Main: ', mainNodeCollection, 'Secondary: ', secondaryNodeCollection);
      return { mainNodeCollection, secondaryNodeCollection }; //eslint-disable-line
    };

    // mouseOverClassApplier checks for which part of the phrase the main word is in using
    //  the highest priority color, and determines which direction, if not both,
    //  to traverse the DOM recursively to grab the correct nodes.
    const mouseOverClassApplier = (colorClass, targetSpan, classList, state) => {

      // Find all the colors the hovered span is in...
      const getColors = (classListValue) => {
        const colors = [];
        if (classListValue.includes('red-list')) {
          colors.push('red-list');
        }
        if (classListValue.includes('green-list')) {
          colors.push('green-list');
        }
        if (classListValue.includes('blue-list')) {
          colors.push('blue-list');
        }
        if (classListValue.includes('purple-list')) {
          colors.push('purple-list');
        }
        if (classListValue.includes('grey-list')) {
          colors.push('grey-list');
        }
        return colors;
      };

      // classList.forEach(color => { console.log(color)});

      console.log(getColors(classList.value));

      state.mainClassCollection.push(targetSpan);
      // If the current word is the left most word then start checking to the right
      //  to find the rest of the main phrase.
      if (classList.contains(`${colorClass}-left`)) {
        console.log('HOVERED Span has LEFT CLASS....');
        const tempCollection = recursiveCheckRight(targetSpan.nextElementSibling, colorClass);
        state.mainNodeCollection = state.mainClassCollection.concat(tempCollection.mainNodeCollection);
        state.secondaryNodeCollection = tempCollection.secondaryNodeCollection;

        // Now check if the current word has a middle or right as this means
        //  our main word is in another phrase.
        //  If true we will search to the left further...
        const currNodeIncludesMiddleOrRightClass = (classList.value.includes('middle') || classList.value.includes('right'));
        if (currNodeIncludesMiddleOrRightClass) {
          console.log('Starting LEFT-CLASS ALSO has phrase to left');

          // We need to copy the classList and remove the last color from it
          //  in order to find the next highest priority color.
          const nextPriorityColor = getNextColor(classList, colorClass);
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
      } else if (classList.contains(`${colorClass}-right`)) {
        console.log('HAS RIGHT CLASS....');
        const tempCollection = recursiveCheckLeft(targetSpan.previousElementSibling, colorClass);
        state.mainNodeCollection = state.mainClassCollection.concat(tempCollection.mainNodeCollection);
        state.secondaryNodeCollection = tempCollection.secondaryNodeCollection;

        const currNodeIncludesMiddleOrLeftClass = (classList.value.includes('middle') || classList.value.includes('left'));

        // If the other classes contain a right or middle then we need to search left
        // if (includesMiddleOrOppositeClass(classList, 'left')) {
        console.log('----HERE-----', currNodeIncludesMiddleOrLeftClass);
        if (currNodeIncludesMiddleOrLeftClass) {
          console.log('Starting RIGHT-CLASS ALSO has phrase to right');
          const nextPriorityColor = getNextColor(classList, colorClass);
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
      } else if (classList.contains(`${colorClass}-middle`)) {
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
        // IF classList is longer than 2 then there are 2 or more colors, so we need to 
        //  look left and right as we are in the base phrase and it would have only one class
        //  if not in other phrases.
        if (classList.length > 2) {
          // Find next priority color spans and add them to secondary state
          const nextPriorityColor = getNextColor(classList, colorClass);
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
    };

    for (let i = 0; i < spanCollection.length; i++) {
      // Store the Original State of each span to use for mouseout listener
      const spanState = {
        mainNodeCollection: [],
        mainClassCollection: [],
        secondaryNodeCollection: [],
        secondaryClassCollection: [],
      };

      const { classList } = spanCollection[i];

      const topColorClass = colorPriority(classList.value);

      spanCollection[i].addEventListener('mouseover', () => {
        console.log('Mouse OVER...');
        // Check which part of the phrase the class is in and apply the 
        //  appropriate classes to it.
        mouseOverClassApplier(topColorClass, spanCollection[i], classList, spanState);
      });

      // ADD mouseout listener to remove hover effects using stored original state.
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

        // Clear out the class state so that it is not duplicated on multiple mouseovers.
        spanState.mainNodeCollection = [];
        spanState.secondaryNodeCollection = [];
        spanState.mainClassCollection = [];
        spanState.secondaryClassCollection = [];
      });
    }
  }

  // compareNeighbors is the main method to setup the spans and classes
  //  properly in order to initially highlight the phrases.
  compareNeighbors(inputString) {
    const words = inputString.match(/[\w'-]+|[^w]/g);
    const appliedColorClasses = [];
    
    // Initialize empty array of arrays the same length as the words array
    //  so we can easily add these classes to the corresponding words later.
    for (let i = 0; i < words.length; i++) {
      appliedColorClasses.push([]);
    }

    // This method compares where the word's index with the part of the phrase we are
    //  at to determine which class suffix should be applied.
    const isWordAtBeginningOrEnd = (currentIndex, startIndex, endIndex) => {
      // If word is the first in phrase return -left class segment
      if (currentIndex === startIndex) {
        return '-left ';
      }
      // If word is last in phrase return - right segment
      if (currentIndex === endIndex - 1) {
        return '-right ';
      }
      // Otherwise return middle segment
      return '-middle ';
    };

    // For each word build up which classes should be applied
    for (let i = 0; i < words.length; i++) {
      const currWord = words[i];
      
      // Only apply classes if the word is in the wordMap
      if (this.wordMap[currWord]) {
        const currColors = this.wordMap[currWord].colors;

        // For each color possible of the current word we want to compare the next
        //  words and their phrases up to the max possible phrase 
        //  length of the current word from the wordMap and
        //  store those phrases to be applied later.
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

          // Add the base class for this word if it is only in a a single word phrase.
          if (phraseLength === 1) {
            appliedColorClasses[i].push(currColor);
          } else {
            // Skip if this word already has this color associated with it.
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

            // Look ahead at each word and if it doesn't contain
            //  the same color in wordMap then stop and throw flag.
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
              // Is the current word is not in the word map or does not have the current
              //  color associated with it then break this loop and move to the next word.
              if (!this.wordMap[nextWord] || !(this.wordMap[nextWord].colors.includes(currColor))) {
                hasCommonNeighborColors = false;
                break;
              }
            }
            // If flag is still true then add the class to appliedClases array.
            if (hasCommonNeighborColors) {
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

    // Apply the classes to the words. Since they are the same length arrays we just
    //  run a simple loop.
    for (let i = 0; i < words.length; i++) {
      const currWord = words[i];
      if (appliedColorClasses[i].length > 0) {
        const wordClasses = appliedColorClasses[i].join(' ');
        words[i] = `<span class="${wordClasses}">${currWord}</span>`;
      } else {
        words[i] = currWord;
      }
    }

    // Take all the words and join them back together to keep original input format
    const resultHTML = words.join('');
    return resultHTML;
  }

  renderHighlights(inputString) {
    // CREATE the word map so we can know how to highlight each word when
    //  dealing with the inputString.
    this.createWordMap(this.wordLists);
    
    const newHTML = this.compareNeighbors(inputString);
    const targetElement = document.getElementById(this.divTarget); // Assumption: The div is given as an #id
    targetElement.innerHTML = newHTML; // Research: Is this the most efficient or fastest way to clear a div?

    // ADD event listeners to all spans
    const allTargetDivSpans = targetElement.getElementsByTagName(`span`);
    this.addMouseListener(allTargetDivSpans);
  }
}
