// This module will grab the article text and wrap each word in a span

  const allArticleParagraphs = document.querySelectorAll('.article-paragraph-target');


  const wordsWrapper = (paragraphNodeList) => {
    // get the text inside the element
  let paragraphWords = [];
  paragraphNodeList.forEach(paragraph => {
    //split text into words array
    const words = paragraph.textContent.split(' ');
    console.log(words);
    // wrap each word in a <span>

    // join backtogether
  
    // set as innerHTML for paragraph?


  });
  }

  wordsWrapper(allArticleParagraphs);
