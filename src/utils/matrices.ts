export function parseMatrix(arr: number[], matSize: number) {
  const res = Array.from(Array(matSize), () => new Array(matSize));
  let index = 0;
  for (let i = 0; i < arr.length; i++) {
    if (i % matSize === 0 && i !== 0) index++;
    if (index > matSize - 1) break;

    res[index][i % matSize] = arr[i];
  }
  return res;
}

export function transposeMatrix(arr: number[][]) {
  if (!arr) {
    return;
  }
  const res = Array.from(Array(arr[0].length), () => new Array(arr.length));
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      res[j][i] = arr[i][j];
    }
  }
  return res;
}

export function multiplyMatrices(points: number[][], lin_op: number[][]) {
  if (
    !points ||
    !lin_op ||
    points[0].length !== lin_op.length ||
    !points.every((item) => item.every((it) => it === it)) ||
    !lin_op.every((item) => item.every((it) => it === it))
  ) {
    console.log("error", points, lin_op);
    return;
  }

  const result = Array.from(
    Array(points.length),
    () => new Array(lin_op[0].length)
  );
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < lin_op[0].length; j++) {
      result[i][j] = 0;
      for (let k = 0; k < points[0].length; k++) {
        // if (j === 3) {
        //   result[j][i] += lin_op[k][j];
        // }
        result[i][j] += points[i][k] * lin_op[k][j];
      }
    }
  }
  return result;
}
