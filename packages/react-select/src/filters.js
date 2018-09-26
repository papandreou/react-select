// @flow

type Config = {
  ignoreCase?: boolean,
  ignoreAccents?: boolean,
  ignoreOrder?: boolean,
  stringify?: Object => string,
  trim?: boolean,
  matchFrom?: 'any' | 'start' | 'start-word',
};

import { stripDiacritics } from './diacritics';

const trimString = str => str.replace(/^\s+|\s+$/g, '');
const defaultStringify = option => `${option.label} ${option.value}`;

function matchCandidate(input, candidate, matchFrom) {
  if (matchFrom === 'start') {
    return candidate.substr(0, input.length) === input;
  } else if (matchFrom === 'start-word') {
    const matchIndex = candidate.indexOf(input);
    // Accept a match at the start of the string or one preceded by space:
    return (
      matchIndex === 0 ||
      (matchIndex > 0 && /\s/.test(candidate.charAt(matchIndex - 1)))
    );
  } else {
    // matchFrom === 'any'
    return candidate.indexOf(input) > -1;
  }
}

export const createFilter = (config: ?Config) => (
  option: { label: string, value: string, data: any },
  rawInput: string
): boolean => {
  const {
    ignoreCase,
    ignoreAccents,
    ignoreOrder,
    stringify,
    trim,
    matchFrom,
  } = {
    ignoreCase: true,
    ignoreAccents: true,
    ignoreOrder: false,
    stringify: defaultStringify,
    trim: true,
    matchFrom: 'any',
    ...config,
  };
  let input = trim ? trimString(rawInput) : rawInput;
  let candidate = trim ? trimString(stringify(option)) : stringify(option);
  if (ignoreCase) {
    input = input.toLowerCase();
    candidate = candidate.toLowerCase();
  }
  if (ignoreAccents) {
    input = stripDiacritics(input);
    candidate = stripDiacritics(candidate);
  }

  if (ignoreOrder) {
    return input
      .split(/\s+/)
      .every(inputWord =>
        candidate
          .split(/\s+/)
          .some(candidateWord =>
            matchCandidate(inputWord, candidateWord, matchFrom)
          )
      );
  } else {
    return matchCandidate(input, candidate, matchFrom);
  }
};
