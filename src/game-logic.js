function rotateMatrix(matrix, direction) {
  const height = matrix.length;
  const width = matrix[0].length;
  const rotated = Array.from({ length: width }, () => Array(height).fill(0));

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      if (direction > 0) rotated[col][height - 1 - row] = matrix[row][col];
      else rotated[width - 1 - col][row] = matrix[row][col];
    }
  }

  return rotated;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { rotateMatrix };
} else {
  window.TetrisLogic = { rotateMatrix };
}
