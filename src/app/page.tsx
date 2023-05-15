"use client";

import { useEffect, useState } from "react";
import { Photo } from "./api/photos/route";

async function getPhotos() {
  const res = await fetch(`/api/photos`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();

  return data.photos;
}

export default function Home() {
  const [photo, setPhoto] = useState<Photo>();

  useEffect(() => {
    (async () => {
      const photos = await getPhotos();
      setPhoto(photos[0]);
    })();
  });

  return <main>{photo && <img src={photo.url}></img>}</main>;
}
