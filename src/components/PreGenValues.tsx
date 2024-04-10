import { useBearStore } from "../store";

function PreGenValues() {
  const setTrPath = useBearStore((state) => state.enterPath);

  return (
    <div className="flex flex-row items-center justify-center">
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
  );
}

export default PreGenValues;
