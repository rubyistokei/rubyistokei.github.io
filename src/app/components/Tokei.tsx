import { useEffect, useState } from "react";
import { format } from "date-fns";

type Props = {
  time: Date;
};

export function Tokei({ time }: Props) {
  const [colonVisible, setColonVisible] = useState<boolean>(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setColonVisible((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {format(time, "HH")}
      <span className={colonVisible ? "visible" : "invisible"}>:</span>
      {format(time, "mm")}
    </>
  );
}
