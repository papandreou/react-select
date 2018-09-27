import { createFilter } from '../filters';

test('matchFrom > start-word > to find a match at the start of the string', () => {
  const filter = createFilter({
    matchFrom: 'start-word',
    stringify: String,
  });
  expect(filter('bar foo', 'bar')).toBe(true);
});

test('matchFrom > start-word > to find a match at the start of a word further into the string', () => {
  const filter = createFilter({
    matchFrom: 'start-word',
    stringify: String,
  });
  expect(filter('foo bar', 'bar')).toBe(true);
});

test('matchFrom > start-word > to ignore a match within a word', () => {
  const filter = createFilter({
    matchFrom: 'start-word',
    stringify: String,
  });
  expect(filter('foo bar', 'oo')).toBe(false);
});

test('ignoreOrder > to find two matches specified in the reverse order in the needle', () => {
  const filter = createFilter({
    ignoreOrder: true,
    stringify: String,
  });
  expect(filter('foo bar', 'bar foo')).toBe(true);
});

test('ignoreOrder > to require all words in the needle to be present', () => {
  const filter = createFilter({
    ignoreOrder: true,
    stringify: String,
  });
  expect(filter('foo bar', 'bar foo quux')).toBe(false);
});
