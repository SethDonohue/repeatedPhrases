const spanFunctions = require('../lib/span-wrapper');

describe('SPAN WRAPPER --- ', () => {
  const mockWordMap = {
    i: [1, 4],
    woods: [1, 2, 7, 10],
    walked: [1, 7],
    through: [1, 7, 10],
    the: [1, 2, 4, 5, 6, 7, 9, 10],
    talked: [2, 3, 10],
    to: [2, 3],
    me: [2, 3],
    next: [4, 5],
    week: [4, 5],
    quick: [6, 8],
    brown: [6, 8],
    fox: [6, 8],
    lazy: [9],
    dog: [9],
    longestPhraseLength: 5,
    shortestPhraseLength: 3,
  };

  test('classApplier takes a word map and a word and creates a string with the associated class names that the word is in from the word map.', () => {
    expect(spanFunctions.classApplier(mockWordMap, 'fox')).toEqual('p-6 p-8');
    expect(spanFunctions.classApplier(mockWordMap, 'the')).toEqual('p-1 p-2 p-4 p-5 p-6 p-7 p-9 p-10');
    expect(spanFunctions.classApplier(mockWordMap, 'then')).toEqual('');
  });

  test('spanWrapper takes in a Nodelist and and wraps each word in a <span> tag with the appropriate classes for which phrase it is in.', () => {
    
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
        innerHTML: '<span class="p-1 p-2 p-4 p-5 p-6 p-7 p-9 p-10">The</span> <span class="p-6 p-8">quick</span> <span class="p-6 p-8">brown</span> <span class="p-6 p-8">fox</span> <span>jumped</span> <span>over</span> <span class="p-1 p-2 p-4 p-5 p-6 p-7 p-9 p-10">the</span> <span class="p-9">lazy</span> <span class="p-9">dog</span> <span class="p-1 p-2 p-4 p-5 p-6 p-7 p-9 p-10">The</span> <span class="p-6 p-8">quick</span> <span class="p-6 p-8">brown</span> <span class="p-6 p-8">fox</span> <span>then</span> <span>jumped</span> <span>over</span> <span class="p-1 p-2 p-4 p-5 p-6 p-7 p-9 p-10">the</span> <span>snoring</span> <span>cow.</span>',
        textContent: 'The quick brown fox jumped over the lazy dog The quick brown fox then jumped over the snoring cow.',
      },
      {
        innerHTML: '<span class="p-1 p-4">The</span> <span class="p-6 p-8">quick</span> <span class="p-6 p-8">brown</span> <span class="p-6 p-8">fox</span> <span>jumped</span> <span>over</span> <span class="p-1 p-4">the</span> <span>lazy</span> <span>dog</span> <span class="p-1 p-4">The</span> <span class="p-6 p-8">quick</span> <span class="p-6 p-8">brown</span> <span class="p-6 p-8">fox</span> <span>then</span> <span>jumped</span> <span>over</span> <span class="p-1 p-4">the</span> <span>snoring</span> <span>elphant.</span>',
        textContent: 'The quick brown fox jumped over the lazy dog The quick brown fox then jumped over the snoring elphant.',
      },
    ];

    expect((spanFunctions.spanWrapper(mockWordMap, mockNodeList))[0]).toEqual(expectedOutputNodeList[0]);
    // expect((spanWrapper(mockNodeList)).longestPhraseLength).toEqual(expectedOutputNodeList.longestPhraseLength);
    // expect((spanWrapper(mockNodeList)).shortestPhraseLength).toEqual(expectedOutputNodeList.shortestPhraseLength);
  });
});
