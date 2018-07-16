class Controller {
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
        // If the color array in wordMap does not already include the color add it.
        this.wordMap[word.toLowerCase()].colors.push(associatedColor);
      }
    };

    // Add Phrase Length per Color to know how far to look
    //  ahead when applying highlights.
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
    //  as we need to know if the word we are looking at is in the beginning
    //  of the phrase or not.
    const addIndexToWordMap = (colorList, word, index) => {
      const newProperty = `${colorList}Index`;
      this.wordMap[word.toLowerCase()][newProperty] = index;
    };

    Object.keys(wordLists).forEach(colorList => {
      wordLists[colorList].forEach(string => {
        const words = string.split(' ');

        if (words.length < 2) {
          // Has No spaces so must be one word, hyphenated, or has an apostrophy.
          addColorToWordMap(string, colorList);
          addLengthToWordMap(colorList, string);
        } else {
          // Add each property for each word to the map.
          for (let i = 0; i < words.length; i++) {
            addColorToWordMap(words[i], colorList);
            addLengthToWordMap(colorList, words[i], words.length);
            addIndexToWordMap(colorList, words[i], i);
          }
        }
      });
    });
  }

  // Add listeners to each span which to control all the
  //  logic for the hover effect on each span.
  addMouseListener(spanCollection) { // eslint-disable-line

    // highestPriorityColor takes in a string in order to work with arrays and DOMTokenLists
    //  and then returns the highest priority color.
    const highestPriorityColor = (classListValue) => {
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

    const getNextColor = (classList, colorClassOne, colorClassTwo) => {
      const filteredList = classList.value
        .split(' ')
        .filter(classItem => !classItem.includes(colorClassOne)
          && !classItem.includes(colorClassTwo)
          && !(classItem.length === 0));

      return highestPriorityColor(filteredList.join(''));
    };

    // _recursiveCheckHelper is the main method for storing the proper nodes to apply
    //   the hover-highlight effects to.
    //  - It creates a main collection to apply the primary hover-highlight effect for the
    //    highest priority color of the word being hovered.
    //  - If the word also contains other color classes this method creates a secondary
    //    collection of nodes to remove the classes from, which removes their highlights.
    // 
    const _recursiveCheckHelper = (currNode, colorClass, tempNodeCollectionOne, tempNodeCollectionTwo, nextOrPrevious, flag) => {
      let direction = '';
      let mainSuffix = '';
      let oppositeSuffix = '';
      // Here we are determining which direction we need to traverse the DOM
      //  based on what arguments are passed into this helper.
      //  This was given the nextOrPrevious parameter in order to make the
      //  code more DRY.
      if (nextOrPrevious === 'next') {
        direction = 'nextSibling';
        mainSuffix = 'right';
        oppositeSuffix = 'left';
      } else {
        direction = 'previousSibling';
        mainSuffix = 'left';
        oppositeSuffix = 'right';
      }

      // Stop this call if there is no sibling or the node that was passed is null.
      //  This is usually associated with the end or beginning of the sentence.
      if (!currNode) return;
      if (!currNode[direction]) return;

      const nextNode = currNode[direction];
      
      // Skip the next node if the next node is whitepsace.
      if (nextNode.textContent === ' ') {
        _recursiveCheckHelper(nextNode, colorClass, tempNodeCollectionOne, tempNodeCollectionTwo, nextOrPrevious, flag);

      // STOP recursive call if the next node contains a word that is not in the word map or is
      //  at the end of the sentence.
      //  If the textConent has whitepsace it is a node between two spans.
      //  NOTE: textContent of a text node includes the whitespace around it.
      } else if (nextNode.textContent.includes(' ') ||
        ['!', '?', '.'].includes(nextNode.textContent)) {
        //  TODO: REMOVE this else-if as it is never visited because nodes like these
        //  DO NOT have a class associated with them per how the spans were initialized.
        //  We only need to worry aobut spaces and take care of that above.

      // If the node is in the middle of a phrase add it to tempCollection
      //  and CONTINUE recursion as we have not found end of the phrase.
      } else if (nextNode.classList.contains(`${colorClass}-middle`)) {
        tempNodeCollectionOne.push(nextNode);
        _recursiveCheckHelper(nextNode, colorClass, tempNodeCollectionOne, tempNodeCollectionTwo, nextOrPrevious, flag);
        
        // STOP recursion and ADD NODE as we have found the end of the phrase.
      } else if (nextNode.classList.contains(`${colorClass}-${mainSuffix}`)) {
        tempNodeCollectionOne.push(nextNode);

        // IF the LAST word in the MAIN phrase has a middle or right class then
        //  we know that this word is part of another phrase to the left
        //  so we need to traverse its siblings and save them to the
        //  secondary collection.
        const endClassList = nextNode.classList;
        const nextPriorityColor = getNextColor(endClassList, colorClass);

        if (includesMiddleOrOppositeClass(endClassList, oppositeSuffix) && flag) {
          flag = false;

          // Throw our flag so this call doesn't happen more than twice as we only need this
          //  logic to occur for either end of the main phrase, not all phrases.
          //  The other colors in the main word will be handled by the secondary loop.
          _recursiveCheckHelper(nextNode, nextPriorityColor, tempNodeCollectionTwo, null, nextOrPrevious, flag);
        }
      }
    };

    const recursiveCheck = (node, color, nextOrPrevious) => {
      const mainNodeCollection = [];
      const secondaryNodeCollection = [];
      const flag = true;

      if (!node) {
        return;
      }
      _recursiveCheckHelper(node, color, mainNodeCollection, secondaryNodeCollection, nextOrPrevious, flag);
      return { mainNodeCollection, secondaryNodeCollection }; //eslint-disable-line
    };

    // mouseOverClassApplier checks for which part of the phrase the main word is in using
    //  the highest priority color, and determines which direction, if not both,
    //  to traverse the DOM recursively to grab the correct nodes.
    const mouseOverClassApplier = (targetSpan, classList, state) => {
      const getSecondaryColors = (classListValue, priorityColor) => {
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
        return colors.filter(color => color !== priorityColor);
      };

      const mainColor = highestPriorityColor(classList.value);

      state.mainNodeCollection.push(targetSpan);

      // Is in multiple colors or a phrase (more than one word);
      //  If false then it is an isolated word.
      if (classList.length >= 2) {
        const remainingSpanColors = getSecondaryColors(classList.value, mainColor);

        let tempCollection = [];

        // If the current word is the left most word then look to the right
        //  to find the rest of the main phrase until we find the color's right class.
        if (classList.contains(`${mainColor}-left`)) {
          tempCollection = recursiveCheck(targetSpan.nextSibling, mainColor, 'next');

        // LOOK LEFT until finding left class and add the collection found to state.
        } else if (classList.contains(`${mainColor}-right`)) {
          tempCollection = recursiveCheck(targetSpan.previousSibling, mainColor, 'previous');

        // For a word in the middle of a phrase we need to look LEFT & RIGHT
        //  until finding left & right class and add the collection found to state.
        } else if (classList.contains(`${mainColor}-middle`)) {
          tempCollection = recursiveCheck(targetSpan.previousSibling, mainColor, 'previous');
          const secondTempCollection = recursiveCheck(targetSpan.nextSibling, mainColor, 'next');

          tempCollection.mainNodeCollection = tempCollection.mainNodeCollection
            .concat(secondTempCollection.mainNodeCollection);

          tempCollection.secondaryNodeCollection = tempCollection.secondaryNodeCollection
            .concat(secondTempCollection.secondaryNodeCollection);

        // HOVERED word is a single word, but has multiple classes...
        } else {
          tempCollection.mainNodeCollection = [];

          const secondColor = getNextColor(classList, mainColor);
          tempCollection.secondaryNodeCollection =
            recursiveCheck(targetSpan.previousSibling, secondColor, 'previous').mainNodeCollection;

          let thirdColor = getNextColor(classList, mainColor, secondColor);

          // If this word is ONLY in two phrases it only has one more
          //  color to prioritize so check for the same color left and right
          //  else we assume that the colors are different.
          if (!thirdColor) {
            thirdColor = secondColor;
          }

          tempCollection.secondaryNodeCollection = tempCollection.secondaryNodeCollection
            .concat(recursiveCheck(targetSpan.nextSibling, thirdColor, 'next').mainNodeCollection);
        }
        state.mainNodeCollection = state.mainNodeCollection
          .concat(tempCollection.mainNodeCollection);

        state.secondaryNodeCollection = state.secondaryNodeCollection
          .concat(tempCollection.secondaryNodeCollection);

        remainingSpanColors.forEach(colorClass => {
          if (classList.contains(`${colorClass}-left`)) {
            state.secondaryNodeCollection = state.secondaryNodeCollection
              .concat(recursiveCheck(targetSpan.nextSibling, colorClass, 'next').mainNodeCollection);

          // LOOK LEFT until finding left class and add the collection found to secondary state.
          } else if (classList.contains(`${colorClass}-right`)) {
            state.secondaryNodeCollection = state.secondaryNodeCollection
              .concat(recursiveCheck(targetSpan.previousSibling, colorClass, 'previous').mainNodeCollection);

          // For a word in the middle of a phrase we need to look LEFT & RIGHT
          //  until finding left & right class and add the collection found to secondary state.
          } else if (classList.contains(`${colorClass}-middle`)) {
            state.secondaryNodeCollection = state.secondaryNodeCollection
              .concat(recursiveCheck(targetSpan.nextSibling, colorClass, 'next').mainNodeCollection);

            state.secondaryNodeCollection = state.secondaryNodeCollection
              .concat(recursiveCheck(targetSpan.previousSibling, colorClass, 'previous').mainNodeCollection);
          }
        });
      }
      // Filter the collections in case a span was added more than once.
      state.mainNodeCollection = state.mainNodeCollection
        .filter((node, index) => state.mainNodeCollection.indexOf(node) === index);

      state.secondaryNodeCollection = state.secondaryNodeCollection
        .filter((node, index) => state.secondaryNodeCollection.indexOf(node) === index);

      // REMOVE ANY duplicate spans from secondary collection that are in main collection
      //  to prevent them from having the wrong hover affect applied.
      //  NOTE: This happens when there are secondary colors on the main phrase.
      state.secondaryNodeCollection = state.secondaryNodeCollection
        .filter(node => !state.mainNodeCollection.includes(node));

      
      // Take the main collection and push the elements class to a stored state
      //  so we can undo the highlights on mouseout.
      //  Then change the class to have the hover effect.
      state.mainNodeCollection.forEach(span => {
        state.mainClassCollection.push(span.className);
        span.className = `${mainColor}-hover ${mainColor}-middle-hover`;
      });

      // IF the secondary collection was changed then store their classes as well
      //  and remove each spans highlight effect.
      if (state.secondaryNodeCollection.length > 0) {
        state.secondaryNodeCollection.forEach(span => {
          state.secondaryClassCollection.push(span.className);
          span.className = '';
        });
      }
    };

    for (let i = 0; i < spanCollection.length; i++) {
      // Store the original state of each span to use for mouseout listener.
      const spanState = {
        mainNodeCollection: [],
        mainClassCollection: [],
        secondaryNodeCollection: [],
        secondaryClassCollection: [],
      };

      const { classList } = spanCollection[i];

      // NOT NEEDED....
      const topColorClass = highestPriorityColor(classList.value);

      spanCollection[i].addEventListener('mouseover', () => {
        // Check which part of the phrase the class is in and apply the 
        //  appropriate classes to it.


        mouseOverClassApplier(spanCollection[i], classList, spanState);
      });

      // ADD mouseout listener to remove hover effects using stored original state.
      spanCollection[i].addEventListener('mouseout', () => {
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
    console.log(`1.) \n Words Array: ${words}`);

    // This method compares where the word's index with the part of the phrase we are
    //  at to determine which class suffix should be applied.
    const isWordAtBeginningOrEnd = (currentIndex, startIndex, endIndex) => {
      // If word is the first in phrase return -left class segment
      if (currentIndex === startIndex) {
        return '-left ';
      }
      // If word is last in phrase return -right segment
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
          const currColor = currColors[j];
          const phraseLength = this.wordMap[currWord][`${currColor}Length`];
          const wordIndex = this.wordMap[currWord][`${currColor}Index`];

          // IF this word is NOT at the beginning of the phrase or
          //  a single word then skip this iteration as it will 
          //  already had the proper classes applied by previous work.
          if (wordIndex > 0) {
            continue; //eslint-disable-line
          }

          // Add the base class for this word if it is only in a a single word phrase.
          if (phraseLength === 1) {
            appliedColorClasses[i].push(currColor);
          } else {
            // Skip the Loop if this word already has this color associated with it.
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
              while (nextWord === ' ') {
                k++;
                endOfPhraseIndex++;
                nextWord = words[k];
              }

              trackedIndexes.push(k);
              // If the current word is not in the word map or does not have the current
              //  color associated with it then break this loop and move to the next word.
              if (!this.wordMap[nextWord] || !(this.wordMap[nextWord].colors.includes(currColor))) {
                hasCommonNeighborColors = false;
                break;
              }
            }
            // If flag is still true then add the class to appliedClases array.
            if (hasCommonNeighborColors) {
              console.log(`2.) ADDED SPAN for __${currWord}__ withcolor __${currColor}__ `);
              trackedIndexes.forEach(index => {
                const tempClass = `${currColor}${isWordAtBeginningOrEnd(index, i, endOfPhraseIndex)}`;
                
                console.log(`3.) ADDED Class of __${tempClass}__`);
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

  // MAIN mthod to call with input string which renders highlights and attaches
  //  listeners for the hovering affect.
  renderHighlights(inputString) {
    // CREATE the word map so we can know how to highlight each word when
    //  dealing with the inputString.
    this.createWordMap(this.wordLists);

    // Take the inputString and compare each worth with follow on words to render
    //  the correct highlight for each word and phrase.
    const newHTML = this.compareNeighbors(inputString);

    // Target the DIV and set it's innerHTML.
    const targetElement = document.getElementById(this.divTarget); // Assumption: The div is given as an #id
    targetElement.innerHTML = newHTML; // Research: Is this the most efficient or fastest way to clear a div?

    // ADD event listeners to all spans
    const allTargetDivSpans = targetElement.getElementsByTagName(`span`);
    this.addMouseListener(allTargetDivSpans);
  }
}


// Test Input
const originalLists = {
  'red-list': [
    'action-oriented',
    'alarming',
    'candidates',
    'leave',
    'do not want',
  ],
  'green-list': [
    'adorable',
    'creative',
    'love',
    'new technology',
  ],
  'blue-list': [
    'an adorable puppy',
    'aggressive',
    'arm',
    'very unlikely',
  ],
  'purple-list': [
    'do not cross',
    'log file',
    'our team',
    'radio',
  ],
  'grey-list': [
    'very unlikely to leave',
    'will deliver new',
  ],
};

const testWordLists = {
  'red-list': [
    'action-oriented',
    'alarming',
    'candidates',
    'leave',
    'do not want',
    'do care',
    'actionable',
    'take',
    'unlikely',
    'is it good',
    'nine',
  ],
  'green-list': [
    'adorable',
    'what is it good for',
    'will take stuff',
    'creative',
    'love',
    'groundbreaking',
    'new technology',
    'new technology dude bro yah man sweet as all heck awesome sick coolio yeah',
    'are not cool',
    'thousand nine hundred',
  ],
  'blue-list': [
    'ten twenty',
    'an adorable puppy',
    'very unlikely',
    'aggressive',
    'arm',
    'three thousand nine hundred fifty',
  ],
  'purple-list': [
    'do not cross',
    'log file',
    'our team',
    'radio',
    'million three thousand nine hundred fifty eight',
  ],
  'grey-list': [
    'very unlikely to leave',
    'cool to hang',
    'will deliver new',
    'we are the best company and this company is the company that can and will deliver new technology dude bro',
    'one million three thousand nine hundred fifty eight point two',
  ],
};

const testWordListsTwo = {
  'green-list': [
    'we are the best company and this company is the company that can and will deliver new technology dude bro',
  ],
  'grey-list': [
    'bro yah man sweet as all heck awesome sick coolio yeah',
  ],
};

const testWordListsThree = {
  'red-list': [
    'we the',
  ],
  'purple-list': [
    'the best',
  ],
};

const testWordListsFour = {
  'red-list': [
    'we are the',
  ],
  'green-list': [
    'the best company',
    'what we',
  ],
  'blue-list': [
    'company in the world',
    'this is what',
  ],
  'purple-list': [
    'world for sure',
    'listen to this',
  ],
  'grey-list': [
    'sure definitely',
    // 'can you listen to this is what we are the best company in the world for sure definitely',
    'can you listen',
  ],
};

const pyramidRecusriveTestString = 'can you listen to this is what we are the best company in the world for sure definitely.';

const testString = 'we\'re very unlikely to leave an adorable puppy. We do not want alarming or aggressive candidates, our candidates should be action-oriented otherwise they will be asked to leave. At this company we are creative, love new technology, and our arm is very unlikely to go-to radio! We do not cross with our team do not cross our team with a log file and we will deliver new technology with love as we are adorable...';

const testStringTwo = 'We expect our candidates to be action-oriented, aggressive and have creative ideas for our team. You will deliver new technology and groundbreaking designs.';

const shortTest = ' puppy an adorable. adorable an puppy. adorable puppy adorable. puppy. an adorable puppy.... adorable an puppy. puppy an adorable. an actionable item puppy actionable item an puppy';

const repetativeTest = 'very unlikely to leave very unlikely to! leave very unlikely to. leave very unlikely leave? leave leave very unlikely to. leave leave unlikey to unlikely to very unlike very unlikely to? unlikey to leave very. leave very unlikely to. very unlikely to leave me alone. very unlikely tobe very unlikely to';

const multipleInclusivePhrases = 'what is it good for... ?! one million three thousand nine hundred fifty eight point two?';

const longPhrasesTest = 'we are the best company and this company is the company that can and will deliver new technology dude bro yah man sweet as all heck awesome sick coolio yeah!';

const shortHighPriorityOverLowPhrases = 'we the best!';

const controllerOne = new Controller('highlighter-target', testWordLists);
controllerOne.renderHighlights(testString);

const controllerTwo = new Controller('highlighter-target-two', originalLists);
controllerTwo.renderHighlights(testStringTwo);

const controllerThree = new Controller('highlighter-target-three', testWordLists);
controllerThree.renderHighlights(repetativeTest);

const controllerFour = new Controller('highlighter-target-four', testWordLists);
controllerFour.renderHighlights(shortTest);

const controllerFiveOne = new Controller('highlighter-target-five-one', testWordLists);
controllerFiveOne.renderHighlights(longPhrasesTest);

const controllerFiveTwo = new Controller('highlighter-target-five-two', testWordListsTwo);
controllerFiveTwo.renderHighlights(longPhrasesTest);

const controllerFiveThree = new Controller('highlighter-target-five-three', testWordListsThree);
controllerFiveThree.renderHighlights(shortHighPriorityOverLowPhrases);

const controllerSix = new Controller('highlighter-target-six', testWordLists);
controllerSix.renderHighlights(multipleInclusivePhrases);

// const controllerSeven = new Controller('highlighter-target-seven', testWordListsFour);
// controllerSeven.renderHighlights(pyramidRecusriveTestString);

const controllerFINAL = new Controller('highlighter-target-final', originalLists);
controllerFINAL.renderHighlights(testString);
