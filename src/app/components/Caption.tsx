import { FaAt, FaCamera } from "react-icons/fa";
import { Photo } from "../api/photos/route";

type Props = {
  photo: Photo;
};

export function Caption({ photo }: Props) {
  const personComponents: JSX.Element[] = [];

  if (photo.rubyists) {
    const n = photo.rubyists.length;
    photo.rubyists.forEach((rubyist, i) => {
      personComponents.push(
        <span key={i.toString()} className="font-bold">
          {rubyist}
        </span>
      );
      if (i < n - 2) {
        personComponents.push(<span key={`${i}-delimiter`}>, </span>);
      } else if (i < n - 1) {
        personComponents.push(<span key={`${i}-delimiter`}> and </span>);
      }
    });
  }

  return (
    <>
      <div className="text-2xl sm:text-3xl md:text-4xl">{personComponents}</div>
      {photo.description && (
        <div className="text-md sm:text-lg md:text-xl">{photo.description}</div>
      )}
      <div className="text-md sm:text-xl">
        {photo.taken_by && (
          <span className="mr-3">
            <FaCamera className="inline mr-1" />
            <span className="font-bold">{photo.taken_by}</span>
          </span>
        )}
        {photo.taken_at && (
          <span>
            <FaAt className="inline mr-1" />
            <span className="font-bold">{photo.taken_at}</span>
          </span>
        )}
      </div>
    </>
  );
}
