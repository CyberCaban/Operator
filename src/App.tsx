import { useEffect, useState } from "react";

function App() {
  const [trPath, setTrPath] = useState("");
  const [path, setPath] = useState("");
  const [points, setPoints] = useState<number[][]>();
  const [operator, setOperator] = useState<number[][]>();
  const [matSize, setMatsize] = useState(3);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const numbers = trPath.match(/^\d+|\d+\b|\d+(?=\w)/g)?.map((v) => +v) ?? [];
    setPoints(parseMatrix(numbers, matSize));
  }, [matSize, trPath]);

  useEffect(() => {
    console.log(multiplyMatrices(points || [[1]], operator || [[1]]));
    const vectors = toSVGVector(
      multiplyMatrices(points || [[1]], operator || [[1]])
    );
    if (vectors) {
      setPath(vectors);
    }
    console.log(vectors);
  }, [points, operator, scale, toSVGVector]);

  function parseMatrix(arr: number[], matSize: number) {
    const res = Array.from(Array(matSize), () => new Array(matSize));
    let index = 0;
    for (let i = 0; i < arr.length; i++) {
      if (i % matSize === 0 && i !== 0) index++;
      if (index > matSize - 1) break;

      res[index][i % matSize] = arr[i];
    }
    return res;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleOperator(e: any) {
    e.preventDefault();
    const nums = [];
    for (let i = 0; i < matSize ** 2; i++) {
      const el = e.target.form[i].value;
      nums.push(eval(el));
    }
    setOperator(parseMatrix(nums, matSize));
  }

  function multiplyMatrices(a: number[][], b: number[][]) {
    if (
      !a ||
      !b ||
      a[0].length !== b.length ||
      !a.every((item) => item.every((it) => it === it)) ||
      !b.every((item) => item.every((it) => it === it))
    ) {
      console.log("error", a, b);
      return;
    }

    const result = Array.from(Array(a.length), () => new Array(b[0].length));
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b[0].length; j++) {
        result[i][j] = 0;
        for (let k = 0; k < a[0].length; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  }

  function toSVGVector(numbers: number[][] | undefined) {
    if (!numbers || numbers.length < 3 || numbers[0].length < 3) {
      console.log("error", numbers);
      return;
    }
    const res = `M ${numbers[0][0] * scale} ${numbers[0][1] * scale} L ${
      numbers[1][0] * scale
    } ${numbers[1][1] * scale} L ${numbers[2][0] * scale} ${
      numbers[2][1] * scale
    }`;
    return res;
  }

  return (
    <main className="flex flex-col h-full items-center">
      <section className="flex flex-col w-1/4 p-2">
        <p className="text-3xl text-center">Linear Operator</p>
        <button
          onClick={() => setTrPath("M 10 13 1 L 12 10 13 L 10 11 15")} // make M 10 13 1 L 12 10 13 L 10 11 15
          className="m-2 text-xl"
        >
          init values
        </button>
        <input
          type="text"
          name="operator"
          id="operator_input"
          value={trPath}
          onChange={(e) => setTrPath(e.target.value)}
        />
      </section>
      <div className="w-1/2 h-1/2 p-1 border-gray-500 border-2 rounded-md m-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d={path} stroke="red" strokeWidth={2} scale={10} />
        </svg>
      </div>
      <label htmlFor="mat_size">Size</label>
      <input
        type="number"
        name="mat_size"
        id="mat_size"
        min={3}
        max={9}
        inputMode="numeric"
        value={matSize}
        onChange={(e) => setMatsize(+e.target.value)}
        className="m-2 text-center "
      />
      <section className="flex flex-row">
        <section>
          <h2>Operator</h2>
          <form action="" onChange={(e) => handleOperator(e)}>
            {matSize >= 3 && matSize <= 9
              ? Array.from(Array(matSize), () =>
                  new Array(matSize).fill(0)
                )?.map((row, index) => (
                  <tr key={index}>
                    {row.map((col, colIndex) => (
                      <input
                        key={`${index}_${colIndex}`}
                        // type="number"
                        defaultValue={index === colIndex ? 1 : 0}
                        name={`${index}_${colIndex}`}
                        id=""
                        className="m-2 rounded-md w-16 text-center"
                      />
                    ))}
                  </tr>
                ))
              : null}
          </form>
        </section>
        <section className="flex flex-col">
          <label htmlFor="scale">Scale</label>
          <input
            type="number"
            name="scale"
            id="scale"
            min={0}
            security="number"
            value={scale}
            onChange={(e) => setScale(+e.target.value)}
            className="m-2 text-center rounded-md w-16"
          />
        </section>
      </section>
    </main>
  );
}

export default App;

