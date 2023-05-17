import { Photo } from "../api/photos/route";
import { Caption } from "./Caption";
import { Time } from "./Time";

type Props = {
  time: Date;
  photo: Photo;
};

export function Tokei({ time, photo }: Props) {
  return (
    <main className="w-screen h-screen overflow-hidden bg-black relative">
      <img
        className="absolute top-0 left-0 w-full h-full object-contain z-10"
        src={photo.image}
      ></img>
      <img
        className="w-full h-full object-cover blur-2xl z-0"
        src={photo.image}
      ></img>
      <div className="absolute bottom-0 left-0 w-full text-white bg-black bg-opacity-50 p-4 z-20 flex items-end gap-4">
        <div className="grow">
          <Caption photo={photo} />
        </div>
        <div className="flex-none">
          {time && (
            <div className="text-white text-4xl sm:text-6xl md:text-8xl font-mono font-bold">
              <Time time={time} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
