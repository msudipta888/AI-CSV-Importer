const { normalizeRows } = require('../services/csvParser');

describe('csvParser - normalizeRows', () => {
  test('trims whitespace from keys and string values', () => {
    const input = [{ '  Full Name  ': '  Alice Cooper  ', ' Email ': ' alice@test.com ' }];
    const result = normalizeRows(input);
    expect(result[0]['Full Name']).toBe('Alice Cooper');
    expect(result[0]['Email']).toBe('alice@test.com');
  });

  test('handles null and undefined values by converting to empty string', () => {
    const input = [{ name: null, city: undefined, email: 'a@b.com' }];
    const result = normalizeRows(input);
    expect(result[0]['name']).toBe('');
    expect(result[0]['city']).toBe('');
    expect(result[0]['email']).toBe('a@b.com');
  });

  test('returns empty array for non-array input', () => {
    expect(normalizeRows(null)).toEqual([]);
    expect(normalizeRows('string')).toEqual([]);
    expect(normalizeRows(undefined)).toEqual([]);
  });

  test('returns empty array for empty input', () => {
    expect(normalizeRows([])).toEqual([]);
  });

  test('handles multiple rows correctly', () => {
    const input = [
      { ' name ': ' Alice ', ' email ': ' a@test.com ' },
      { ' name ': ' Bob ', ' email ': ' b@test.com ' },
    ];
    const result = normalizeRows(input);
    expect(result).toHaveLength(2);
    expect(result[1]['name']).toBe('Bob');
    expect(result[1]['email']).toBe('b@test.com');
  });

  test('preserves non-string values (numbers, booleans)', () => {
    const input = [{ count: 42, active: true }];
    const result = normalizeRows(input);
    expect(result[0]['count']).toBe(42);
    expect(result[0]['active']).toBe(true);
  });
});
