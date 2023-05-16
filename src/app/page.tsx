"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

import { Photo } from "./api/photos/route";

async function getPhotos() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/photos`,
    {
      next: { revalidate: 60 },
    }
  );
  const data = await res.json();

  return data.photos;
}

type TokeiProps = {
  time: Date;
};

function Tokei({ time }: TokeiProps) {
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

export default function Home() {
  const PERIOD_SEC = 10;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<Date>();

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

    const index = Math.floor(sec / PERIOD_SEC) % photos.length;
    setPhotoIndex(index);
  }, [photos, currentTime]);

  function prefetch(url: string) {
    new Image().src = url;
  }

  useEffect(() => {
    if (photos.length === 0) return;

    const nextIndex = (photoIndex + 1) % photos.length;
    prefetch(photos[nextIndex].url);
  }, [photoIndex]);

  const photo = photos[photoIndex];

  return (
    <main className="w-screen h-screen overflow-hidden bg-black relative">
      {photo && (
        <img className="w-full h-full object-contain" src={photo.url}></img>
      )}
      {currentTime && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white mix-blend-difference text-[100px] font-mono font-bold">
          <Tokei time={currentTime} />
        </div>
      )}
    </main>
  );
}
