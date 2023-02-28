import React, { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { fetchRequest } from "../common/api";
import { ENDPOINT } from "../common/endpoint";
import { createImageUrl, fetchVedioInfo } from "../common/utils";
import Modal from "./Modal";
import PlayIcon from "@heroicons/react/24/solid/PlayCircleIcon";
import LikeIcon from "@heroicons/react/24/outline/HandThumbUpIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import ChveronDown from "@heroicons/react/24/outline/ChevronDoubleDownIcon";
import { MovieVideoInfo, MovieVideoResult, Position } from "../common/typo";

const CARD_WIDTH = 200;

type MovieCardProp = {
  poster_path: string;
  title: string;
  id: number;
  uid: string;
};

export default function MovieCard({
  poster_path,
  title,
  id,
  uid,
}: MovieCardProp) {
  const [isOpen, setisOpen] = useState(false);
  const [videoInfo, setvideoInfo] = useState<MovieVideoInfo | null>(null);
  const movieCardRef = useRef<HTMLSelectElement>(null);

  const [position, setposition] = useState<Position | null>(null);
  const [hideposter, sethideposter] = useState(false);

  function onClose(value: boolean) {
    setisOpen(value);
  }

  function closeModal() {
    setisOpen(false);
  }

  async function onMouseEnter(event: any) {
    const [videoinfo] = await fetchVedioInfo(id);

    let calculatedPosition = movieCardRef.current?.getBoundingClientRect();

    let frameTop = (calculatedPosition?.top ?? 0);
    let frameLeft = (calculatedPosition?.left ?? 0);

    frameLeft =
      frameLeft + 448 > document.body.clientWidth
        ? document.body.clientWidth - 478
        : frameLeft;

    setposition({ top: frameTop, left: frameLeft });
    setisOpen(true);
    setvideoInfo(videoinfo);
  }

  useEffect(() => {
    movieCardRef.current?.addEventListener("mouseenter", onMouseEnter); 

    return () => {
      movieCardRef.current?.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [movieCardRef.current]);

  useEffect(() => {
    if (videoInfo?.key) {
      setTimeout(() => {
        sethideposter(true);
      }, 800);
    }
    // if(!isOpen){
    //     sethideposter(false)
    // }
  }, [videoInfo]);

  return (
    <>
      <section
        ref={movieCardRef}
        className="aspect-square flex-none overflow-hidden rounded-md"
        key={uid}
      >
        <img
          className="h-full w-full"
          src={createImageUrl(poster_path, CARD_WIDTH)}
          alt={title}
        />
      </section>

      <Modal
        title={title}
        isOpen={isOpen}
        key={id}
        onClose={onClose}
        closeModal={closeModal}
        position={position}
      >
        <section className="aspect-square transition-[height] duration-500 ease-in">
          <img
            src={createImageUrl(poster_path, 400)}
            alt={title}
            className={`w-[450px] ${
              hideposter == true ? "invisible h-0" : "visible h-[300px]"
            }`}
          />

          <YouTube
            opts={{
              width: "450px",
              height: "300px",
              playerVas: {
                autoplay: 1,
                playsinline: 1,
                controls: 0,
              },
            }}
            className={`w-full ${
              hideposter == false ? "invisible h-0" : "visible h-[300px]"
            }`}
            videoId={videoInfo?.key}
          />

          <section className="flex items-center justify-between p-6">
            <ul className="flex items-center justify-evenly gap-4">
              <li className="h-12 w-12  rounded-full border-2 border-gray-500 p-2 hover:border-white">
                <button className="h-full w-full ">
                  <PlayIcon></PlayIcon>
                </button>
              </li>
              <li className="h-12 w-12 rounded-full   border-gray-500  p-2 hover:border-white">
                <button className="h-full w-full">
                  <PlusIcon></PlusIcon>
                </button>
              </li>

              <li className="h-12 w-12 rounded-full  border-gray-500  p-2 hover:border-white   ">
                <button className="h-full w-full">
                  <LikeIcon></LikeIcon>
                </button>
              </li>
            </ul>

            <ul className="flex items-center justify-evenly gap-4">
              <li className="h-12 w-12 rounded-full border-gray-500 p-2 hover:border-white">
                <button className="h-full w-full">
                  <ChveronDown></ChveronDown>
                </button>
              </li>
            </ul>
          </section>
        </section>
      </Modal>
    </>
  );
}
