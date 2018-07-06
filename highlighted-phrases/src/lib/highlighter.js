// For Each sentence - come back to this for now, not sure how file will be formatted...
//
//   For Each word
//  - Compare phrases word is in with next 4 neighrbors
//    (4 comes from max possible phrase length - 1)
//  - Apply common phrases to all words
//  - Store seen phrases in map/array
//  - Move to next word
// - Stop when min phrase length - 1 away from end of sentence

// TODO: Break the paragraph text into a sentence array
  
// add mouseover event listener to each span with class of phrase-word
const highlighter = {};

highlighter.grabClassNames = (event) => {
  const classList = event.target.className;
  console.log('CLASSLIST: ', classList);
};

module.exports = highlighter;
