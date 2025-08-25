import { expect, test, describe } from 'vitest'

import { moveInArray } from './array-utils'

describe('moveInArray', () => {

  test('should do nothing when start and end are equal', () => {
    // Arrange
    const values = [ 0, 1, 2, 3, 4, 5 ];
    const expected = [ 0, 1, 2, 3, 4, 5 ];
    // Act
    moveInArray(values, 1, 1)
    // Assert
    expect(values).toEqual(expected);
  });

  test('should move to beginning of array', () => {
    // Arrange
    const values = [ 0, 1, 2, 3, 4, 5 ];
    const expected = [ 1, 0, 2, 3, 4, 5 ];
    // Act
    moveInArray(values, 1, 0)
    // Assert
    expect(values).toEqual(expected);
  });

  test('should move to end of array', () => {
    // Arrange
    const values = [ 0, 1, 2, 3, 4, 5 ];
    const expected = [ 0, 2, 3, 4, 5, 1 ];
    // Act
    moveInArray(values, 1, 5)
    // Assert
    expect(values).toEqual(expected);
  });


  test('should move to earlier in array', () => {
    // Arrange
    const values = [ 0, 1, 2, 3, 4, 5 ];
    const expected = [ 0, 4, 1, 2, 3, 5 ];
    // Act
    moveInArray(values, 4, 1)
    // Assert
    expect(values).toEqual(expected);
  });

  test('should move to later in array', () => {
    // Arrange
    const values = [ 0, 1, 2, 3, 4, 5 ];
    const expected = [ 0, 2, 3, 4, 1, 5 ];
    // Act
    moveInArray(values, 1, 4)
    // Assert
    expect(values).toEqual(expected);
  });

})