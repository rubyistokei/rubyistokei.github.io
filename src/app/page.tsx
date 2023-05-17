"use client";

import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";

import { Photo } from "./api/photos/route";
import { useUpdateChecker } from "./hooks/use-update-checker";
import { Tokei } from "./components/Tokei";

async function getPhotos() {
  const res = await fetch("/api/photos");
  const data = await res.json();

  return data.photos;
}

type PhotoProps = {
  photo: Photo;
};
function Caption({ photo }: PhotoProps) {
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

  const takenComponents = [];
  if (photo.taken_by) {
    takenComponents.push(
      <span key="taken-by">
        by <span className="font-bold">{photo.taken_by}</span>{" "}
      </span>
    );
  }
  if (photo.taken_at) {
    takenComponents.push(
      <span key="taken-at">
        at <span className="font-bold">{photo.taken_at}</span>
      </span>
    );
  }

  return (
    <>
      <div className="text-4xl">{personComponents}</div>
      {photo.description && <div className="text-xl">{photo.description}</div>}
      {takenComponents.length > 0 && (
        <div className="text-xl">
          <FaCamera className="inline" /> {takenComponents}
        </div>
      )}
    </>
  );
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<Date>();

  useUpdateChecker(1000 * 60);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      const photos = await getPhotos();
      setPhotos(photos);
    })();
  }, []);

  useEffect(() => {
    if (!currentTime) return;
    if (photos.length === 0) return;

    const sec = currentTime?.getTime() / 1000;
    const speed = Number(process.env.NEXT_PUBLIC_SPEED || 1.0);

    const index = Math.floor((sec / 60) * speed) % photos.length;
    setPhotoIndex(index);
  }, [photos, currentTime]);

  function prefetch(url: string) {
    new Image().src = url;
  }

  useEffect(() => {
    if (photos.length === 0) return;

    const nextIndex = (photoIndex + 1) % photos.length;
    prefetch(photos[nextIndex].url);
  }, [photos, photoIndex]);

  const photo = photos[photoIndex];

  return (
    <main className="w-screen h-screen overflow-hidden bg-black relative">
      {photo && (
        <img
          className="absolute top-0 left-0 w-full h-full object-contain z-10"
          src={photo.url}
        ></img>
      )}
      {photo && (
        <img
          className="w-full h-full object-cover blur-2xl z-0"
          src={photo.url}
        ></img>
      )}
      {photo && (
        <div className="absolute bottom-0 left-0 w-full text-white bg-black bg-opacity-50 p-4 z-20 flex items-end gap-4">
          <div className="grow">
            <Caption photo={photo} />
          </div>
          <div className="flex-none">
            {currentTime && (
              <div className="text-white text-8xl font-mono font-bold">
                <Tokei time={currentTime} />
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
