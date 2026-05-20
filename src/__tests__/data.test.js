import { englishToSindarin, sindarinToEnglish } from '../data.js';

describe('englishToSindarin', () => {
  it('is a non-empty object', () => {
    expect(typeof englishToSindarin).toBe('object');
    expect(Object.keys(englishToSindarin).length).toBeGreaterThan(0);
  });

  it('maps "and" to the expected Sindarin value', () => {
    expect(englishToSindarin['and']).toBe('a, ah, ar');
  });

  it('maps "fire" to a defined Sindarin value', () => {
    expect(englishToSindarin['fire']).toBeDefined();
  });

  it('maps "friend" to a defined Sindarin value', () => {
    expect(englishToSindarin['friend']).toBeDefined();
  });

  it('maps "shadow" to a defined Sindarin value', () => {
    expect(englishToSindarin['shadow']).toBeDefined();
  });

  it('all values are non-empty strings', () => {
    for (const [key, value] of Object.entries(englishToSindarin)) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    }
  });
});

describe('sindarinToEnglish', () => {
  it('is a non-empty object', () => {
    expect(typeof sindarinToEnglish).toBe('object');
    expect(Object.keys(sindarinToEnglish).length).toBeGreaterThan(0);
  });

  it('maps "car" to the expected English value', () => {
    expect(sindarinToEnglish['car']).toBe('make');
  });

  it('maps "gal" to the expected English value', () => {
    expect(sindarinToEnglish['gal']).toBe('green');
  });

  it('all values are non-empty strings', () => {
    for (const [key, value] of Object.entries(sindarinToEnglish)) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    }
  });
});
