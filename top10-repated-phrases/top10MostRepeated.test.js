const mostRepeatedPhrases = require('./top10MostRepeatedPhrases');

describe('Top10 Most repeated phrases function', () => {
  test('A Regular input with proper grammar and repeated phrases SHOULD return an array with objects where each object has the phrase and frequency', () => {
    const testInputStr = 'The quick brown fox jumped over the lazy dog. The lazy dog, peeved to be labeled lazy, jumped over a snoring turtle. In retaliation the quick brown fox jumped over ten snoring turtles. Then the quick brown fox refueled with some ice cream.';

    const expectedOutput = [
      { phrase: 'the quick brown fox jumped over', frequency: 2 },
      { phrase: 'the lazy dog', frequency: 2 },
    ];

    expect(mostRepeatedPhrases(testInputStr)).toEqual(expectedOutput);
  });

  test('A non-regular input with improper grammar, lots of junk and extra repeated phrases SHOULD still return an array with objects.', () => {
    const testInputStr = 'The quick brown fox jumped over The quick brown fox jumped over the lazy dog with some ice cream. with some ice cream... The lazy dog, peeved to be labeled lazy, with some ice cream ,with some ice cream , $$$ with some ice cream, jumped over a snoring turtle? In retaliation 3 the quick 555 brown fox jumped over the ten snoring 1234 turtles. Then the quick brown fox refueled with, some ice cream!';

    const expectedOutput = [
      { phrase: 'with some ice cream', frequency: 6 },
      { phrase: 'the quick brown fox jumped over the', frequency: 2 },
      { phrase: 'the lazy dog', frequency: 2 },
    ];

    expect(mostRepeatedPhrases(testInputStr)).toEqual(expectedOutput);
  });

  test('A Regular input with 10 repeated phrases and random puncuation should return ten most repeated phrases', () => {
    const testPhraseArray = [
      'The quick brown. The quick brown The quick brown ',
      'fox jumped over fox jumped over ',
      'testing one two three four testing one two three four  testing one two three four ',
      'ice cream is really great ice cream is really great. ',
      'Hello how are you? Hello how are you? Hello how are you? Hello how are you? Hello how are you? Hello how are you? ',
      'My Name is Charlie My Name is Charlie! My Name is Charlie My Name is Charlie ',
      'I live on James Street? I live on James Street. I live on James Street! I live on James Street ',
      'We are crazy! We are crazy! ',
      'this is life this is life ',
      'Where in the world is Carmen Sandiego. Where in the world is Carmen Sandiego. ',
    ]

    const testInputStr = testPhraseArray.join('');

    const expectedFirstOutput = {
      phrase: 'hello how are you',
      frequency: 6,
    };

    expect(mostRepeatedPhrases(testInputStr).length).toEqual(10);
    expect(mostRepeatedPhrases(testInputStr)[0]).toEqual(expectedFirstOutput);
  });

  test('A Regular input with 11 repeated phrases and random puncuation should return 10 most repeated phrases', () => {
    const testPhraseArray = [
      'The quick brown. The quick brown The quick brown ',
      'fox jumped over fox jumped over ',
      'testing one two three four testing one two three four  testing one two three four ',
      'ice cream is really great ice cream is really great. ',
      'Hello how are you? Hello how are you? Hello how are you? Hello how are you? Hello how are you? Hello how are you? ',
      'My Name is Charlie My Name is Charlie! My Name is Charlie My Name is Charlie ',
      'I live on James Street? I live on James Street. I live on James Street! I live on James Street ',
      'We are crazy! We are crazy! ',
      'this is life this is life ',
      'Where in the world is Carmen Sandiego. Where in the world is Carmen Sandiego. ',
      'JavaScript is pretty good JavaScript is pretty good ',
    ]
    const testInputStr = testPhraseArray.join('');

    const expectedFirstOutput = {
      phrase: 'hello how are you',
      frequency: 6,
    };

    expect(mostRepeatedPhrases(testInputStr).length).toEqual(10);
    expect(mostRepeatedPhrases(testInputStr)[0]).toEqual(expectedFirstOutput);
  });

  test('A Regular input with ONLY 1 repeated phrase should return just one phrase object in an array', () => {
    const testInputStr = 'The quick brown fox jumped over The quick brown fox jumped over the';

    const expectedOutput = [
      { phrase: 'the quick brown fox jumped over the', frequency: 2 },
    ];

    expect(mostRepeatedPhrases(testInputStr)).toEqual(expectedOutput);
  });

  test('A Regular input with ZERO repeated phrases should return an empty array.', () => {
    const testInputStr = 'The quick brown fox jumped over the snoring turtle, who then hit the dog.';

    const expectedOutput = [];

    expect(mostRepeatedPhrases(testInputStr)).toEqual(expectedOutput);
  });
});
