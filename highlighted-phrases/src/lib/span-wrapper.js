// This module will grab the article text and wrap each word in a span

  const allArticleParagraphs = document.querySelectorAll('.article-paragraph-target');


  const wordsWrapper = (paragraphNodeList) => {
    // get the text inside the element
    let paragraphWords = [];
    paragraphNodeList.forEach(paragraph => {
      //split text into words array
      const words = paragraph.textContent.split(' ');

      // wrap each word in a <span>
      const wrappedWords = words.map(word => `<span>${word}</span>`).join(' ');

      // set as innerHTML for paragraph?
      paragraph.innerHTML = wrappedWords;
      console.log(paragraphNodeList);
    });
      
  }

  wordsWrapper(allArticleParagraphs);
