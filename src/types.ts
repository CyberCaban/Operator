export interface Store {
  inputPath: string;
  enterPath: (path: string) => void;
  scale: number;
  setScale: (scale: number) => void;
  debug: boolean;
  setDebug: () => void;
  operator: number[][];
  setOperator: (operator: number[][]) => void;
}
export type PathD = {
  act: string;
  coords: [number, number, number];
};
