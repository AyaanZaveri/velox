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

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const Home = () => {
  const webcamRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);

  const onResults = async (results: any) => {
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
      drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
        color: "white",
        lineWidth: 5,
      });
      drawLandmarks(canvasCtx, results.rightHandLandmarks, {
        color: "white",
        fillColor: "rgb(0,217,231)",
        lineWidth: 2,
        radius: (data: any) => {
          return lerp(data.from.z, -0.15, 0.1, 10, 1);
        },
      });
    }

    drawLine(
      results,
      canvasCtx,
      canvasElement,
      "both",
      4,
      8,
      5,
      "white"
    );
    drawLine(
      results,
      canvasCtx,
      canvasElement,
      "both",
      4,
      12,
      5,
      "white"
    );
    drawLine(
      results,
      canvasCtx,
      canvasElement,
      "both",
      4,
      16,
      5,
      "white"
    );
    drawLine(
      results,
      canvasCtx,
      canvasElement,
      "both",
      4,
      20,
      5,
      "white"
    );

    canvasCtx.restore();
  };

  useEffect(() => {
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

    loadModel();
  }, []);

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-3">
      <Head>
        <title>Velox</title>
      </Head>
      <div className="flex flex-row items-center justify-center flex-wrap gap-3">
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
            objectFit: "contain",
            position: "absolute",
            objectPosition: "center",
          }}
        />
      </div>
    </div>
  );
};

export default Home;
