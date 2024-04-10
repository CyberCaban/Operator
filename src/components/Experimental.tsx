import { useEffect } from "react";
import { useBearStore } from "../store";

function Experiment() {
  useEffect(() => {
    // @ts-expect-error debug
    window.enableDebug = () => {
      useBearStore.setState({ debug: true });
      console.log("debug enabled");
    };
  }, []);

  return null;
}

export default Experiment;
