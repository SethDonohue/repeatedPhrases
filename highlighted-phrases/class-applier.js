'use strict';

// --- SUMMARY __________________
// This moddule builds out the functions required to apply the css classes to each span/word.
// Multiple classes are applied depending on which phrases the word is in, as words can be in more than one phrase due to the fact that phrases can overlap in sentences.
// --- PLANNING / NOTES __________________
// This module will:
// - Need to create a data storage structure that associates a class with each phrase in the given phrase list.
// - Traverse the input (sentence? paragraph? single word?)
// - Determine which phrase the word is in when compared to the given phrase list.
//    - Use a datastructure with fast lookup that