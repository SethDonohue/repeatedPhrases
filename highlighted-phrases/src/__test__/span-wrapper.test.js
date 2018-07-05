const spanWrapper = require('../lib/span-wrapper');

describe('SPAN WRAPPER --- ', () => {
  test('spanWrapper takes in a Nodelist and and wraps each word in a <span> tag.', () => {
    const mockNodeList = [
      {
        textContent: 'The quick brown fox jumped over the lazy dog The quick brown fox then jumped over the snoring cow.',
      },
      {
        textContent: 'The quick brown fox jumped over the lazy dog The quick brown fox then jumped over the snoring elphant.',
      },
    ];

    
    const expectedOutputNodeList = [
      {
        innerHTML: '<span>The</span> <span>quick</span> <span>brown</span> <span>fox</span> <span>jumped</span> <span>over</span> <span>the</span> <span>lazy</span> <span>dog</span> <span>The</span> <span>quick</span> <span>brown</span> <span>fox</span> <span>then</span> <span>jumped</span> <span>over</span> <span>the</span> <span>snoring</span> <span>cow.</span>',
        textContent: 'The quick brown fox jumped over the lazy dog The quick brown fox then jumped over the snoring cow.',
      },
      {
        innerHTML: '<span>The</span> <span>quick</span> <span>brown</span> <span>fox</span> <span>jumped</span> <span>over</span> <span>the</span> <span>lazy</span> <span>dog</span> <span>The</span> <span>quick</span> <span>brown</span> <span>fox</span> <span>then</span> <span>jumped</span> <span>over</span> <span>the</span> <span>snoring</span> <span>elphant.</span>',
        textContent: 'The quick brown fox jumped over the lazy dog The quick brown fox then jumped over the snoring elphant.',
      },
    ];

    expect((spanWrapper(mockNodeList))).toEqual(expectedOutputNodeList);
    // expect((spanWrapper(mockNodeList)).longestPhraseLength).toEqual(expectedOutputNodeList.longestPhraseLength);
    // expect((spanWrapper(mockNodeList)).shortestPhraseLength).toEqual(expectedOutputNodeList.shortestPhraseLength);
  });
});
