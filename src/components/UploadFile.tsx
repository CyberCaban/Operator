import { useEffect, useState } from "react";
import { useBearStore } from "../store";

function UploadFile() {
  const [vertexes, setVertexes] = useState<number[][]>([]);
  const [polygons, setPolygons] = useState<number[][]>([]);
  const setTrPath = useBearStore((state) => state.enterPath);

  useEffect(() => {
    if (vertexes && polygons) {
      let str = "";

      polygons.map((polygon) => {
        const firstVert = vertexes[polygon[0] - 1];
        str += `M ${firstVert[0]} ${firstVert[1]} ${firstVert[2]} `;

        for (let i = 1; i < polygon.length; i++) {
          const el = polygon[i];
          str += `L ${vertexes[el - 1][0]} ${vertexes[el - 1][1]} ${
            vertexes[el - 1][2]
          } `;
        }
        str += `L ${firstVert[0]} ${firstVert[1]} ${firstVert[2]} `;
      });
      console.log(str);

      setTrPath(str);
    }
  }, [vertexes, polygons]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleFile(e: any) {
    e.preventDefault();

    const reader = new FileReader();
    const vertexes: number[][] = [];
    const polygons: number[][] = [];

    reader.onload = async () => {
      const res = reader.result as string;

      res.split("\n").map((v) => {
        const vertexLine = v.match(
          /v\s+(-?\d+\.?(\d+)?)\s+(-?\d+\.?(\d+)?)\s+(-?\d+\.?(\d+)?)/g
        );

        if (vertexLine) {
          const vert = vertexLine[0].split(/\s+/);
          const coords = [+vert[1], +vert[2], +vert[3]];

          vertexes.push(coords);
        }

        const polygonLine = v.match(/f(\s\d+\/\d+\/\d+)+\s*/g);
        if (polygonLine) {
          const [_, ...poly] = polygonLine[0]
            .split(/\s+/)
            .map((v, i) => i > 0 && +v.split("/")[0]);

          console.log(poly);

          polygons.push(poly as number[]);
        }
      });

      setVertexes(vertexes);
      setPolygons(polygons);
    };

    if (e.target.files[0].name.split(".").pop() === "obj")
      reader.readAsText(e.target.files[0]);
    else console.log("not obj");
  }

  return (
    <>
      <label htmlFor="file_input">.obj file</label>
      <input
        type="file"
        name="file_input"
        id="file_input"
        onChange={(e) => handleFile(e)}
      />
    </>
  );
}

export default UploadFile;
