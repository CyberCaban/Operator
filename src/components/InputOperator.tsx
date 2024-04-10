import { useState } from "react";
import { parseMatrix } from "../utils/matrices";
import { useBearStore } from "../store";

function InputOperator() {
  const matSize = 3;

  const [scale, setScale] = useBearStore((state) => [
    state.scale,
    state.setScale,
  ]);
  const [operator, setOperator] = useBearStore((state) => [
    state.operator,
    state.setOperator,
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleOperator(e: any) {
    e.preventDefault();
    const nums = [];
    for (let i = 0; i < matSize ** 2; i++) {
      const el = e.target.form[i].value;
      nums.push(+el);
    }
    setOperator(parseMatrix(nums, matSize));
  }

  return (
    <section className="flex flex-row">
      <section>
        <h2>Operator</h2>
        <form action="" onChange={(e) => handleOperator(e)}>
          {matSize >= 3 && matSize <= 4
            ? Array.from(Array(matSize), () => new Array(matSize).fill(0))?.map(
                (row, index) => (
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
                )
              )
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
  );
}

export default InputOperator;
