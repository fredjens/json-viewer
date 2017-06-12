import React from 'react';

export function checkIfInSearch(word, search) {
  let wordString = word;

  if (typeof word === 'number') {
    wordString = word.toString();
  };

  if (typeof word === 'string') {
    wordString = word.toLowerCase();
  };

  if (search === '') {
    return word;
  }

  if (wordString.includes(search.toLowerCase())) {
    const letters = wordString.split('');

    return letters.map((letter, index) => {
      if (search.toLowerCase().includes(letter)) {
        return (
          <span style={{ background: 'yellow' }} key={index}>
            {letter}
          </span>
        );
      };

      return letter;
    });
  }

  return word;
}