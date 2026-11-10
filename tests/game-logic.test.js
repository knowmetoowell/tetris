const { rotateMatrix } = require("../src/game-logic");

describe("rotateMatrix", () => {
  test("rotates a matrix clockwise", () => {
    expect(rotateMatrix([[1, 0], [1, 1]], 1)).toEqual([[1, 1], [1, 0]]);
  });

  test("rotates a matrix counterclockwise", () => {
    expect(rotateMatrix([[1, 0], [1, 1]], -1)).toEqual([[0, 1], [1, 1]]);
  });

  test("does not mutate the input matrix", () => {
    const input = [[1, 0], [1, 1]];
    rotateMatrix(input, 1);
    expect(input).toEqual([[1, 0], [1, 1]]);
  });
});
