### Known Issues:

- Possibly can't have phrases starting with the same word in the same color list if one is longer than the other and is before the shorter phrase in the same list.
  - FIX: Sort the given colors shortest to longest to make sure we always check for the longest possible phrase when coming accross a word that is in a color with as the colorLength property of the wordMap will be the longest possible.
#### Improvements:
- Add the whitepsace to the node's so that it can have the
  highlight effect with using the box shadown work around.




### Planning:
#### Ideas:
1.) Can each phrase be put in it's own span and then those spans have css class selectors to highlight a certain color on hover?
  
  - This won't allow for overlapping phrases

2.) Can we have a a "window" div that has a higher z index and then floats over the text and depending on location we look up which word is hovered over, then somehow highlight based on x & y corrdinates?

3.) With Jquery and everyword wrapped in a span find out which word was highlight, pass it through a function to find the possible phrases it is in

4.) Have a floating div that is always where the mouse is, that is a width of

5.)
- Use jQuery and the .nextAll and .prevAll selectors to select the span siblings on either side of the mouseover span in each sentence
- Use .text() to get the words in these spans and then pass these words through a function to determine which phrase is hovered over.

6.)
- Apply css classes to each span/word depending on which phrases the word/span is in.
  - create a function that traverses all sentences and for each span/word applies multiple css classes to the span for each phrase the word is in based on it's neighbor words.
  - have a hashmap that contains each word.
- when mouseover a span grab the css classes of span and apply colors based on priority.
- use those classes to determine which phrase the word/span is in and determine which phrase of those has the highest priority.
- depending on which phrase is highest priority select all words with that css selector in JUSt that sentence, - apply a highlight color css style rule to those selected words.
- remove the classes from the overlapping phrases associated with the hovered word.

7.)
- Give each sentence an id
- give each span/word in sentence a class with the highest priority phrase it is included in that specific sentence.
- when hovered span hovered over grab the classes and apply the highlight to only the other words with that class in that sentence

### NOTES:
- Chose to go with idea 6 as it seems to be the easiest to implament.
  - SUMMARY __________________
// This moddule builds out the functions required to apply the css classes to each span/word.
// Multiple classes are applied depending on which phrases the word is in, as words can be in more than one phrase due to the fact that phrases can overlap in sentences.
// --- PLANNING / NOTES __________________
// This module will:
// - Need to create a data storage structure that associates a class with each phrase in the given phrase list.
// - Traverse the input (sentence? paragraph? single word?)
// - Determine which phrase the word is in when compared to the given phrase list.
//    - Use a datastructure with fast lookup that