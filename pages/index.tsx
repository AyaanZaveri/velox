import Webcam from "react-webcam";
import React, { useRef, useEffect, useState } from "react";
import {
  drawConnectors,
  drawLandmarks,
  lerp,
  // @ts-ignore
} from "@mediapipe/drawing_utils/drawing_utils";
// @ts-ignore
import { Camera } from "@mediapipe/camera_utils/camera_utils";
import {
  // FACEMESH_TESSELATION,
  HAND_CONNECTIONS,
  Holistic,
  POSE_CONNECTIONS,
  POSE_LANDMARKS_LEFT,
  POSE_LANDMARKS_RIGHT,
} from "@mediapipe/holistic";
import { drawLine } from "../utils/drawLine";
import Head from "next/head";
import axios from "axios";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const Home = () => {
  const webcamRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);

  const [predictions, setPredictions] = useState<any>();

  const [showLandmarks, setShowLandmarks] = useState<boolean>(false);

  const [sqWidth, setSqWidth] = useState<any>();
  const [sqHeight, setSqHeight] = useState<any>();

  const [time, setTime] = useState<boolean>(false);
  const [timeBool, setTimeBool] = useState<boolean>(false);
  const [weather, setWeather] = useState<boolean>(false);
  const [weatherBool, setWeatherBool] = useState<boolean>(false);

  const timeRef = useRef<HTMLDivElement>(null);
  const weatherRef = useRef<HTMLDivElement>(null);

  // console.log(
  //   timeRef.current?.offsetWidth,
  //   timeRef.current?.offsetTop,
  //   timeRef.current?.offsetLeft
  // );

  const onResults = async (results: any) => {
    setPredictions(results ? results : "");

    const canvasElement = canvasRef.current;
    const ctx = canvasElement.getContext("2d");

    canvasElement.width = webcamRef.current.video.videoWidth;
    canvasElement.height = webcamRef.current.video.videoHeight;

    ctx.save();

    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    if (showLandmarks) {
      if (
        results.poseLandmarks ||
        results.rightHandLandmarks ||
        results.leftHandLandmarks
      ) {
        // Pose

        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: "white",
        });
        drawLandmarks(
          ctx,
          Object.values(POSE_LANDMARKS_LEFT).map(
            (index) => results.poseLandmarks[index]
          ),
          { visibilityMin: 0.65, color: "white", fillColor: "rgb(255,138,0)" }
        );
        drawLandmarks(
          ctx,
          Object.values(POSE_LANDMARKS_RIGHT).map(
            (index) => results.poseLandmarks[index]
          ),
          { visibilityMin: 0.65, color: "white", fillColor: "rgb(0,217,231)" }
        );

        // Face

        // drawConnectors(ctx, results.faceLandmarks, FACEMESH_TESSELATION, {
        //   color: "#C0C0C070",
        //   lineWidth: 1,
        // });

        // Hands

        drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
          color: "white",
          lineWidth: 5,
        });
        drawLandmarks(ctx, results.leftHandLandmarks, {
          color: "white",
          fillColor: "rgb(255,138,0)",
          lineWidth: 2,
          radius: (data: any) => {
            return lerp(data.from.z, -0.15, 0.1, 10, 1);
          },
        });
        drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
          color: "white",
          lineWidth: 5,
        });
        drawLandmarks(ctx, results.rightHandLandmarks, {
          color: "white",
          fillColor: "rgb(0,217,231)",
          lineWidth: 2,
          radius: (data: any) => {
            return lerp(data.from.z, -0.15, 0.1, 10, 1);
          },
        });
      }

      drawLine(results, ctx, canvasElement, "both", 4, 8, 5, "white");
      drawLine(results, ctx, canvasElement, "both", 4, 12, 5, "white");
      drawLine(results, ctx, canvasElement, "both", 4, 16, 5, "white");
      drawLine(results, ctx, canvasElement, "both", 4, 20, 5, "white");
    }

    // console.log(
    //   results?.leftHandLandmarks
    //     ? `${
    //         canvasRef.current.offsetHeight * results?.leftHandLandmarks[8]?.y
    //       } ${timeRef.current?.offsetTop} ${
    //         timeRef.current?.offsetTop + timeRef.current?.offsetWidth
    //       }`
    //     : ""
    // );

    const detectRect = (
      ref: React.RefObject<HTMLElement>,
      hand: string,
      setBool: any
    ) => {
      if (ref.current) {
        if (hand == "left") {
          if (
            canvasRef.current.offsetWidth -
              canvasRef.current.offsetWidth *
                (results?.leftHandLandmarks
                  ? results?.leftHandLandmarks[8].x
                  : 0) >=
              ref.current?.offsetLeft &&
            canvasRef.current.offsetWidth -
              canvasRef.current.offsetWidth *
                (results?.leftHandLandmarks
                  ? results?.leftHandLandmarks[8].x
                  : 0) <=
              ref.current?.offsetLeft + ref.current?.offsetHeight &&
            canvasRef.current.offsetHeight *
              (results?.leftHandLandmarks
                ? results?.leftHandLandmarks[8].y
                : 0) >=
              ref.current?.offsetTop &&
            canvasRef.current.offsetHeight *
              (results?.leftHandLandmarks
                ? results?.leftHandLandmarks[8].y
                : 0) <=
              ref.current?.offsetTop + ref.current?.offsetHeight
          ) {
            setBool(true);
          } else {
            setBool(false);
          }
        } else if (hand == "right") {
          if (
            canvasRef.current.offsetWidth -
              canvasRef.current.offsetWidth *
                (results?.rightHandLandmarks
                  ? results?.rightHandLandmarks[8].x
                  : 0) >=
              ref.current?.offsetLeft &&
            canvasRef.current.offsetWidth -
              canvasRef.current.offsetWidth *
                (results?.rightHandLandmarks
                  ? results?.rightHandLandmarks[8].x
                  : 0) <=
              ref.current?.offsetLeft + ref.current?.offsetWidth &&
            canvasRef.current.offsetHeight *
              (results?.rightHandLandmarks
                ? results?.rightHandLandmarks[8].y
                : 0) >=
              ref.current?.offsetTop &&
            canvasRef.current.offsetHeight *
              (results?.rightHandLandmarks
                ? results?.rightHandLandmarks[8].y
                : 0) <=
              ref.current?.offsetTop + ref.current?.offsetWidth
          ) {
            setBool(true);
          } else {
            setBool(false);
          }
        }
      }
    };

    detectRect(timeRef, "left", setTimeBool);
    detectRect(weatherRef, "left", setWeatherBool);
  };

  useEffect(() => {
    if (timeBool == true) {
      setTimeout(() => setTime(!time), 500);
    }
    if (weatherBool == true) {
      setTimeout(() => setWeather(!weather), 500);
    }
  });

  const loadModel = async () => {
    const holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.3.1620694839/${file}`;
      },
    });
    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holistic.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await holistic.send({ image: webcamRef?.current?.video });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    setSqWidth(canvasRef.current ? canvasRef.current.offsetWidth / 12 : 0);
    setSqHeight(canvasRef.current ? canvasRef.current.offsetHeight / 12 : 0);
  });

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-3">
      <Webcam
        ref={webcamRef}
        className="hidden"
        mirrored={true}
        videoConstraints={videoConstraints}
      />
      <div className="absolute h-screen">
        <canvas
          ref={canvasRef}
          className="-z-10"
          style={{
            transform: "scaleX(-1)",
            height: "100vh",
          }}
        />
        {canvasRef.current ? (
          <div className="flex flex-row">
            <div
              ref={timeRef}
              className={`${
                time ? "bg-green-500/10" : "bg-red-900/10"
              } backdrop-blur-md rounded-full absolute grid place-items-center`}
              style={{
                width: sqWidth,
                height: sqHeight,
                top: canvasRef.current
                  ? (canvasRef.current.offsetHeight / 100) * 8
                  : 0,
                left: canvasRef.current
                  ? (canvasRef.current.offsetWidth / 100) * 8
                  : 0,
              }}
            >
              <span className="text-lg text-white/75 font-mono">Time</span>
            </div>

            <div
              ref={weatherRef}
              className={`${
                weather ? "bg-green-500/10" : "bg-red-900/10"
              } backdrop-blur-md rounded-full absolute grid place-items-center`}
              style={{
                width: sqWidth,
                height: sqHeight,
                top: canvasRef.current
                  ? (canvasRef.current.offsetHeight / 100) * 8
                  : 0,
                left: canvasRef.current
                  ? (canvasRef.current.offsetWidth / 100) * 20
                  : 0,
              }}
            >
              <span className="text-lg text-white/75 font-mono">Weather</span>
            </div>
          </div>
        ) : null}
      </div>
      {time ? (
        <h1 className="absolute text-3xl text-white bg-slate-900/30 p-5 rounded-lg backdrop-blur-md font-light">
          <span className="font-semibold">
            {new Date().toLocaleTimeString()}
          </span>{" "}
          is the time.
        </h1>
      ) : null}
    </div>
  );
};

export default Home;
