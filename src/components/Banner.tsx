import React, { useEffect, useState } from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import { fetchRequest, MovieResponse, MovieResult } from "../common/api";
import { ENDPOINT } from "../common/endpoint";
import { MovieVideoInfo } from "../common/typo";
import { createImageUrl, fetchVedioInfo } from "../common/utils";

import PlayCircleIcon from "@heroicons/react/24/solid/PlayCircleIcon";
import InfomationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import Loader from "./loader";

export default function Banner() {
  const [videoInfo, setvideoInfo] = useState<MovieVideoInfo | null>(null);
  const [randomeMovie, setrandomeMovie] = useState<MovieResult | null>(null);

  const [hidePoster, sethidePoster] = useState(false);

  const [showBackdrop, setshowBackdrop] = useState(false);

  const option: YouTubeProps["opts"] = {
    width: document.body.clientWidth,
    height: "800px",
    playerVas: {
      autoplay: 1,
      playsinline: 1,
      controls: 0,
    },
  };

  function getRandomIndex(last: number) {
    return Math.floor(Math.random() * (last - 1));
  }

  async function fechPopularMoviesImage() {
    const response = await fetchRequest<MovieResponse<MovieResult[]>>(
      ENDPOINT.MOVIES_POPULAR
    );

    const filteredMovies = response.results.filter(
      (movies) => movies.backdrop_path
    );

    const randomSelection =
      filteredMovies[getRandomIndex(filteredMovies.length)];
    setrandomeMovie(randomSelection);

    const [videoinfo] = await fetchVedioInfo(randomSelection.id);

    setvideoInfo(videoinfo);
    setTimeout(() => {
      sethidePoster(true);
    }, 1000);
  }

  function onStateChange(event: YouTubeEvent<number>) {
    if (event.data === 0) {
      sethidePoster(false);
      setshowBackdrop(true);
    } else if (event.data === 1) {
      sethidePoster(true);
      setshowBackdrop(false);
    }
  }

  useEffect(() => {
    fechPopularMoviesImage();
  }, []);

  return randomeMovie ? (
    <section className="relative aspect-video h-[500px] w-full overflow-hidden">
      <img
        className={`absolute w-full ${
          hidePoster ? "invisible h-0" : "visible h-[500px]"
        }`}
        src={createImageUrl(randomeMovie?.backdrop_path ?? "", 0, "original")}
        alt={randomeMovie?.original_title}
      />

      {videoInfo ? (
        <YouTube
          onStateChange={onStateChange}
          className={`absolute z-[1] -mt-14 w-full ${
            !hidePoster ? "invisible h-0" : "visible h-[800px]"
          }`}
          opts={option} 
          videoId={videoInfo?.key}
          id="banner-video"
        />
      ) : null}

      {showBackdrop ? (
        <section className="absolute top-0 z-[1] h-[500px] w-full bg-dark/60"></section>
      ) : null}
      <section className="absolute bottom-16 z-[1] ml-16 flex max-w-sm flex-col">
        <h2 className="text-6xl">{randomeMovie?.title}</h2>
        <p className=" text-sm line-clamp-3">{randomeMovie?.overview}</p>
        <section className="flex gap-2">
          <button className="flex w-[100px] items-center rounded-md bg-white p-2 text-dark justify-center">
            {" "}
            <PlayCircleIcon className="h-8 w-8" /> Play
          </button>
          <button className="flex w-[150px] items-center rounded-md bg-zinc-500/50 p-2 text-dark justify-center">
            {" "}
            <InfomationCircleIcon className="h-8 w-8" /> More Info
          </button>
        </section>
      </section>
    </section>
  ) : <Loader/>
}
