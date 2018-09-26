// @flow

type Config = {
  ignoreCase?: boolean,
  ignoreAccents?: boolean,
  stringify?: Object => string,
  trim?: boolean,
  matchFrom?: 'any' | 'start' | 'start-word',
};

import { stripDiacritics } from './diacritics';

const trimString = str => str.replace(/^\s+|\s+$/g, '');
const defaultStringify = option => `${option.label} ${option.value}`;

export const createFilter = (config: ?Config) => (
  option: { label: string, value: string, data: any },
  rawInput: string
): boolean => {
  const { ignoreCase, ignoreAccents, stringify, trim, matchFrom } = {
    ignoreCase: true,
    ignoreAccents: true,
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
};
