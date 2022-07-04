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
import { createRect } from "../utils/createRect";
import { timer } from "../utils/timer";
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
  const [bool, setBool] = useState<boolean>(false);
  const [hovering, setHovering] = useState<boolean>(false);
  const [time, setTime] = useState();

  const onResults = async (results: any) => {
    setPredictions(results ? results : "");

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    canvasElement.width = webcamRef.current.video.videoWidth;
    canvasElement.height = webcamRef.current.video.videoHeight;

    canvasCtx.save();

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
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

        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: "white",
        });
        drawLandmarks(
          canvasCtx,
          Object.values(POSE_LANDMARKS_LEFT).map(
            (index) => results.poseLandmarks[index]
          ),
          { visibilityMin: 0.65, color: "white", fillColor: "rgb(255,138,0)" }
        );
        drawLandmarks(
          canvasCtx,
          Object.values(POSE_LANDMARKS_RIGHT).map(
            (index) => results.poseLandmarks[index]
          ),
          { visibilityMin: 0.65, color: "white", fillColor: "rgb(0,217,231)" }
        );

        // Face

        // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
        //   color: "#C0C0C070",
        //   lineWidth: 1,
        // });

        // Hands

        drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
          color: "white",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, results.leftHandLandmarks, {
          color: "white",
          fillColor: "rgb(255,138,0)",
          lineWidth: 2,
          radius: (data: any) => {
            return lerp(data.from.z, -0.15, 0.1, 10, 1);
          },
        });
        drawConnectors(
          canvasCtx,
          results.rightHandLandmarks,
          HAND_CONNECTIONS,
          {
            color: "white",
            lineWidth: 5,
          }
        );
        drawLandmarks(canvasCtx, results.rightHandLandmarks, {
          color: "white",
          fillColor: "rgb(0,217,231)",
          lineWidth: 2,
          radius: (data: any) => {
            return lerp(data.from.z, -0.15, 0.1, 10, 1);
          },
        });
      }

      drawLine(results, canvasCtx, canvasElement, "both", 4, 8, 5, "white");
      drawLine(results, canvasCtx, canvasElement, "both", 4, 12, 5, "white");
      drawLine(results, canvasCtx, canvasElement, "both", 4, 16, 5, "white");
      drawLine(results, canvasCtx, canvasElement, "both", 4, 20, 5, "white");
    }
    createRect(
      100,
      100,
      200,
      200,
      results,
      canvasCtx,
      canvasElement,
      "left",
      "rgb(34, 197, 94, 0.75)",
      30,
      hovering,
      setBool
    );
    createRect(
      1080 - 100,
      100,
      200,
      200,
      results,
      canvasCtx,
      canvasElement,
      "right",
      "rgb(239, 68, 68, 0.75)",
      30,
      hovering,
      setBool
    );
  };

  useEffect(() => {
    if (bool == true) {
      setTimeout(() => setHovering(true), 250);
    }
    if (bool == false) {
      setTimeout(() => setHovering(false), 250);
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

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-3">
      <Webcam
        ref={webcamRef}
        className="hidden"
        mirrored={true}
        videoConstraints={videoConstraints}
      />
      <canvas
        ref={canvasRef}
        className=""
        style={{
          transform: "scaleX(-1)",
          height: "100vh",
        }}
      />
      {hovering ? (
        <h1 className="absolute text-3xl text-white bg-slate-900/30 p-3 rounded-lg backdrop-blur-md">
          {new Date().toLocaleTimeString()}
        </h1>
      ) : null}
    </div>
  );
};

export default Home;
