import { useEffect, useState } from "react";
import { transposeMatrix, multiplyMatrices } from "./utils/matrices";
import UploadFile from "./components/UploadFile";
import { useBearStore } from "./store";
import { PathD } from "./types";
import Experiment from "./components/Experimental";
import InputOperator from "./components/InputOperator";
import PreGenValues from "./components/PreGenValues";

function App() {
  const [trPath, setTrPath] = useBearStore((state) => [
    state.inputPath,
    state.enterPath,
  ]);
  const operator = useBearStore((state) => state.operator);

  const scale = useBearStore((state) => state.scale);
  const isAnimated = useBearStore((state) => state.debug);

  const [svg3DVectors, set3DVectors] = useState<PathD[]>();
  const [svg2DVectors, set2DVectors] = useState<PathD[]>();
  const [svgPath, setSvgPath] = useState<string>("");
  const [oldPath, setOldPath] = useState<string>("");

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

    set3DVectors(p);
  }, [trPath]);

  useEffect(() => {
    if (svg3DVectors) {
      const result = [];
      for (let i = 0; i < svg3DVectors.length; i++) {
        const el = svg3DVectors[i];
        const vector = svg3DVectors
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
      set2DVectors(result);
    }
  }, [operator, scale, svg3DVectors]);

  useEffect(() => {
    let str = "";
    svg2DVectors?.map(({ act, coords }) => {
      str += `${act} ${coords[0] * scale} ${coords[1] * scale} `;
    });

    setSvgPath((prev) => {
      setOldPath(prev);
      return str;
    });
  }, [svg2DVectors, scale]);

  return (
    <main className="flex flex-col h-full items-center">
      <Experiment />
      <section className="flex flex-col w-1/3 p-2">
        <p className="text-3xl text-center">Linear Operator</p>
        <PreGenValues />
        <textarea
          name="operator"
          id="operator_input"
          value={trPath}
          onChange={(e) => setTrPath(e.target.value)}
        />
      </section>
      <div className="w-1/2 h-1/2 p-1 border-gray-500 border-2 rounded-md m-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full "
          key={isAnimated ? svgPath : ""}
        >
          <path
            d={svgPath}
            stroke="rgb(23, 200, 64)" // rgb(23, 200, 64)
            strokeWidth={1}
            style={{ transform: `translate(50%, 50%)` }}
          >
            {oldPath !== svgPath && isAnimated ? (
              <animate
                attributeName="d"
                from={oldPath}
                to={svgPath}
                dur="0.1s"
                type={"translate"}
                repeatCount={1}
              />
            ) : null}
          </path>
        </svg>
      </div>
      <UploadFile />
      <InputOperator />
    </main>
  );
}

export default App;
