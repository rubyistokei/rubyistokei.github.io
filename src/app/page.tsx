"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

import { Photo } from "./api/photos/route";

async function getPhotos() {
  const res = await fetch(`/api/photos`, {
    next: { revalidate: 60 },
  });
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
  const [photo, setPhoto] = useState<Photo>();
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

  function prefetch(url: string) {
    new Image().src = url;
  }

  useEffect(() => {
    if (!currentTime) return;

    const numPhotos = photos.length;
    if (numPhotos === 0) return;

    const sec = currentTime?.getTime() / 1000;

    const index = Math.floor(sec / PERIOD_SEC) % numPhotos;
    const nextIndex = (index + 1) % numPhotos;

    prefetch(photos[nextIndex].url);
    setPhoto(photos[index]);
  }, [photos, currentTime]);

  return (
    <main className="w-screen h-screen overflow-hidden bg-black relative">
      {photo && (
        <img className="w-full h-full object-contain" src={photo.url}></img>
      )}
      {currentTime && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white text-5xl font-mono">
          <Tokei time={currentTime} />
        </div>
      )}
    </main>
  );
}
