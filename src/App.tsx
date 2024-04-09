import { useEffect, useState } from "react";
import {
  parseMatrix,
  transposeMatrix,
  multiplyMatrices,
} from "./utils/matrices";
import UploadFile from "./components/UploadFile";

type PathD = {
  act: string;
  coords: [number, number, number];
};

function App() {
  const [trPath, setTrPath] = useState("");
  const [operator, setOperator] = useState<number[][]>();
  const [matSize, setMatsize] = useState(3);
  const [scale, setScale] = useState(1);

  const [newPoints, setNewPoints] = useState<PathD[]>();
  const [newRes, setNewRes] = useState<PathD[]>();
  const [newPath, setNewPath] = useState<string>("");

  useEffect(() => {
    if (operator === undefined) {
      setOperator([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]);
    }
  }, [operator, trPath]);

  useEffect(() => {
    const nums = trPath.match(
      /[M,L]\s+[+-]?(\d*\.\d+|\d+\.\d*|\d+)\s+[+-]?(\d*\.\d+|\d+\.\d*|\d+)\s+[+-]?(\d*\.\d+|\d+\.\d*|\d+)/g
    );
    const p: PathD[] = [];

    nums?.map((v) => {
      const i = v.split(/\s+/);
      const item: PathD = {
        act: i[0],
        coords: [+i[1], +i[2], +i[3]],
      };
      p.push(item);
    });

    setNewPoints(p);
  }, [matSize, trPath]);

  useEffect(() => {
    if (newPoints) {
      const result = [];
      for (let i = 0; i < newPoints.length; i++) {
        const el = newPoints[i];
        const vector = newPoints
          ? [[el.coords[0]], [el.coords[1]], [el.coords[2]]]
          : null;

        const newVector = transposeMatrix(
          multiplyMatrices(operator || [[1]], vector || [[1]]) || [[1]]
        );
        const pathCommand: PathD = {
          act: el.act,
          coords:
            newVector && newVector[0]
              ? (newVector[0] as [number, number, number])
              : [0, 0, 0],
        };
        result.push(pathCommand);
      }
      setNewRes(result);
    }
  }, [operator, scale, newPoints]);

  useEffect(() => {
    let str = "";
    newRes?.map(({ act, coords }) => {
      str += `${act} ${coords[0] * scale} ${coords[1] * scale} `;
    });

    setNewPath(str);
  }, [newRes, scale]);

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

  return (
    <main className="flex flex-col h-full items-center">
      <section className="flex flex-col w-1/3 p-2">
        <p className="text-3xl text-center">Linear Operator</p>
        <div className="flex flex-row items-center justify-center">
          <button
            onClick={() => {
              setTrPath("M 10 13 1 L 12 10 13 L 10 11 15 L 10 13 1");
              setMatsize(3);
            }}
            className="m-2 text-xl"
          >
            simple values
          </button>
          <button
            onClick={() => {
              setTrPath(
                "M 10 13 1 L 12 10 13 L 10 11 15 L 10 13 1 \nM 10 8 6 L 3 6 5 L 3 10 15 L 10 8 6"
              );
            }}
            className="m-2 text-xl"
          >
            complex values
          </button>
          <button
            onClick={() => {
              setTrPath(
                "M 3 5 7 L 2 5 7 L 1 9 4 L 6 7 4 L 9 11 7 L 3 5 7 M 0 0 0 L 3 4 1 L 2 7 1 L 0 0 0"
              );
            }}
            className="m-2 text-xl"
          >
            more complex values
          </button>
        </div>
        <textarea
          name="operator"
          id="operator_input"
          value={trPath}
          onChange={(e) => setTrPath(e.target.value)}
        />
      </section>
      <div className="w-1/2 h-1/2 p-1 border-gray-500 border-2 rounded-md m-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full ">
          <path
            d={newPath}
            stroke="rgb(23, 200, 64)" // rgb(23, 200, 64)
            strokeWidth={1}
            // scale={10}
            style={{ transform: `translate(50%, 50%)` }}
          ></path>
        </svg>
      </div>
      <UploadFile setTrPath={setTrPath} />
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
                        step={0.5}
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
            step={0.5}
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
