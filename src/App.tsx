import { useEffect, useState } from "react";

function App() {
  const [trPath, setTrPath] = useState("");
  const [path, setPath] = useState("");
  const [points, setPoints] = useState<number[][]>();
  const [operator, setOperator] = useState<number[][]>();
  const [res, setRes] = useState<number[][]>();
  const [matSize, setMatsize] = useState(3);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const numbers = trPath.match(/^\d+|\d+\b|\d+(?=\w)/g)?.map((v) => +v) ?? [];
    setPoints(parseMatrix(numbers, matSize));
  }, [matSize, trPath]);

  useEffect(() => {
    function toSVGVector(numbers: number[][] | undefined) {
      if (!numbers || numbers.length < 3 || numbers[0].length < 3) {
        console.log("error", numbers);
        return;
      }
      const res = `
      M ${numbers[2][0] * scale} ${numbers[2][1] * scale} 
      L ${numbers[1][0] * scale} ${numbers[1][1] * scale} 
      L ${numbers[0][0] * scale} ${numbers[0][1] * scale}`;
      return res;
    }

    const multiplied = multiplyMatrices(points || [[1]], operator || [[1]]);
    setRes(multiplied);
    const vectors = toSVGVector(multiplied);
    if (vectors) {
      setPath(vectors);
    }
    console.log(vectors);
  }, [points, operator, scale]);

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

  function multiplyMatrices(points: number[][], lin_op: number[][]) {
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
          if (j === 3) {
            result[j][i] += lin_op[k][j];
          }
          result[i][j] += points[i][k] * lin_op[k][j];
        }
      }
    }
    return result;
  }

  return (
    <main className="flex flex-col h-full items-center">
      <section className="flex flex-col w-1/3 p-2">
        <p className="text-3xl text-center">Linear Operator</p>
        <div className="flex flex-row items-center">
          <button
            onClick={() => {
              setTrPath("M 10 13 1 L 12 10 13 L 10 11 15");
              setMatsize(3);
            }} // make M 10 13 1 L 12 10 13 L 10 11 15
            className="m-2 text-xl"
          >
            init values 3x
          </button>
          <button
            onClick={() => {
              setTrPath("M 10 13 1 0 L 12 10 13 0 L 10 11 15 0 L 0 0 0 1");
              setMatsize(4);
            }} // make M 10 13 1 L 12 10 13 L 10 11 15
            className="m-2 text-xl"
          >
            init values 4x
          </button>
        </div>
        <input
          type="text"
          name="operator"
          id="operator_input"
          value={trPath}
          onChange={(e) => setTrPath(e.target.value)}
        />
      </section>
      <div className="w-1/2 h-1/2 p-1 border-gray-500 border-2 rounded-md m-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transition"
        >
          <path
            d={path}
            stroke="red"
            strokeWidth={2}
            scale={10}
            style={{ transform: `translate(50%, 50%)` }}
          />
          {/* <rect
            width={50}
            height={50}
            fill="white"
            transform={`matrix(${res[0][0] * scale} ${res[0][1] * scale} ${
              res[0][2] * scale
            } ${res[1][0] * scale} ${res[1][1] * scale} ${res[1][1] * scale})`}
          /> */}
        </svg>
      </div>
      <label htmlFor="mat_size">Size</label>
      <input
        type="number"
        name="mat_size"
        id="mat_size"
        min={3}
        max={4}
        inputMode="numeric"
        value={matSize}
        onChange={(e) => setMatsize(+e.target.value)}
        className="m-2 text-center "
      />
      <section className="flex flex-row">
        <section>
          <h2>Operator</h2>
          <form action="" onChange={(e) => handleOperator(e)}>
            {matSize >= 3 && matSize <= 4
              ? Array.from(Array(matSize), () =>
                  new Array(matSize).fill(0)
                )?.map((row, index) => (
                  <tr key={index}>
                    {row.map((col, colIndex) => (
                      <input
                        key={`${index}_${colIndex}`}
                        type="number"
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
            step={0.1}
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

