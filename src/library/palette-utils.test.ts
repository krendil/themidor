import { expect, test, describe } from 'vitest'

import { darkestOf, lightestOf, midpointOfBiggestGap } from './palette-utils'
import { defaultPalette, type Palette } from '@/models/palette';

describe('midpointOfBiggestGap', () => {

  test('should find midpoint in the middle of sequence', () => {
    // Arrange
    const values = [ 1, 5, 7, 9 ];
    const expected = 3;
    // Act
    const actual = midpointOfBiggestGap(values, 10, false);
    // Assert
    expect(actual).toEqual(expected);
  });

  test('should find midpoint at the end of sequence', () => {
    // Arrange
    const values = [ 1, 3, 5, 7 ];
    const expected = 8.5;
    // Act
    const actual = midpointOfBiggestGap(values, 10, false);
    // Assert
    expect(actual).toEqual(expected);
  });

  test('should find midpoint at the beginning of sequence', () => {
    // Arrange
    const values = [ 3, 5, 7, 9 ];
    const expected = 1.5;
    // Act
    const actual = midpointOfBiggestGap(values, 10, false);
    // Assert
    expect(actual).toEqual(expected);
  });


  test('should find midpoint in the middle of circle', () => {
    // Arrange
    const values = [ 1, 5, 7, 9 ];
    const expected = 3;
    // Act
    const actual = midpointOfBiggestGap(values, 10, true);
    // Assert
    expect(actual).toEqual(expected);
  });

  test('should find midpoint at the end of circle', () => {
    // Arrange
    const values = [ 1, 3, 5, 7 ];
    const expected = 9;
    // Act
    const actual = midpointOfBiggestGap(values, 10, true);
    // Assert
    expect(actual).toEqual(expected);
  });

  test('should find midpoint at the beginning of circle', () => {
    // Arrange
    const values = [ 3, 5, 7, 9 ];
    const expected = 1;
    // Act
    const actual = midpointOfBiggestGap(values, 10, true);
    // Assert
    expect(actual).toEqual(expected);
  });

})

describe('lightestOf', () => {

  const palette = defaultPalette();

  test('should find the lighter of three palette colours', () => {
    // Arrange
    const expected = [0, 2]; // tmdr:bg
    // Act
    const actual = lightestOf(palette, "tmdr:fg", "tmdr:bg", "tmdr:hibg");
    // Assert
    expect(actual).toEqual(expected);
  });

  test('should find the lighter of a palette colour and a raw colour', () => {
    // Arrange
    const expected = [0, 2]; // tmdr:bg
    // Act
    const actual = lightestOf(palette, "#323232", "tmdr:bg");
    // Assert
    expect(actual).toEqual(expected);
  });

  test('should ignore missing tags', () => {
    // Arrange
    const expected = [0, 2]; // tmdr:bg
    // Act
    const actual = lightestOf(palette, "tmdr:bg", "term:01");
    // Assert
    expect(actual).toEqual(expected);
  });

  test('should handle no targets', () => {
    // Arrange
    // Act
    const actual = lightestOf(palette);
    // Assert
    expect(actual).toBeNull();
  });

});

describe('darkestOf', () => {

  const palette = defaultPalette();

  test('should find the darker of three palette colours', () => {
    // Arrange
    const expected = [1, 1]; // tmdr:fg
    // Act
    const actual = darkestOf(palette, "tmdr:fg", "tmdr:bg", "tmdr:hibg");
    // Assert
    expect(actual).toEqual(expected);
  });

  test('should find the darker of a palette colour and a raw colour', () => {
    // Arrange
    const expected = [1, 1]; // tmdr:fg (closest to #323232)
    // Act
    const actual = darkestOf(palette, "#323232", "tmdr:bg");
    // Assert
    expect(actual).toEqual(expected);
  });

  test('should ignore missing tags', () => {
    // Arrange
    const expected = [0, 2]; // tmdr:bg
    // Act
    const actual = darkestOf(palette, "tmdr:bg", "term:01");
    // Assert
    expect(actual).toEqual(expected);
  });

  test('should handle no targets', () => {
    // Arrange
    // Act
    const actual = darkestOf(palette);
    // Assert
    expect(actual).toBeNull();
  });

});