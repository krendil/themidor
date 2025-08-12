import { describe, expect, it } from "vitest";
import { slugify } from "./text-utils";

describe('slugify', () => {
  it('should replace non-safe characters with hyphen', () => {
    const input = " this:is#a%test()";
    const expected = "-this-is-a-test-";
    const actual = slugify(input);
    expect(actual).toEqual(expected);
  });

  it('should replace multiple non-safe characters with single hyphen', () => {
    const input = "  this: :is# #a%$ %test([ ])";
    const expected = "-this-is-a-test-";
    const actual = slugify(input);
    expect(actual).toEqual(expected);
  });

  it('should convert to lowercase', () => {
    const input = "  This: :iS# #A%$ %tESt([ ])";
    const expected = "-this-is-a-test-";
    const actual = slugify(input);
    expect(actual).toEqual(expected);
  });
});