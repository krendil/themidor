import { expect, test, describe } from 'vitest'

import { midpointOfBiggestGap } from './palette-utils'

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