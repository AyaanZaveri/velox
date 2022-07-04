export const createRect = (
  x: number,
  y: number,
  width: number,
  height: number,
  results: any,
  canvasCtx: any,
  canvasElement: any,
  hand = "left",
  color = "red",
  offset = 30,
  onoff: string,
  hovering: boolean,
  setBool: any
) => {
  canvasCtx.fillStyle = "rgb(15, 23, 42, 0.75)";
  if (hand == "left") {
    if (results?.leftHandLandmarks) {
      if (
        // subtract by 1080 since the video stream is backwards
        // 30 is an offset
        canvasElement.width -
          results?.leftHandLandmarks[8]?.x * canvasElement.width >=
          x &&
        canvasElement.width -
          results?.leftHandLandmarks[8]?.x * canvasElement.width <=
          x + width &&
        results?.leftHandLandmarks[8].y * canvasElement.height >= y &&
        results?.leftHandLandmarks[8].y * canvasElement.height <= y + height
      ) {
        if (onoff == "on") {
          setBool(true);
        } else if (onoff == "off") {
          setBool(false);
        }
        canvasCtx.fillStyle = color;
      }
    }

    canvasCtx?.fillRect(1080 - x + width, y, width, height);

    canvasCtx?.restore();
  }

  if (hand == "right") {
    if (results?.rightHandLandmarks) {
      if (
        // subtract by 1080 since the video stream is backwards
        // 30 is an offset
        canvasElement.width -
          results?.rightHandLandmarks[8]?.x * canvasElement.width >=
          x &&
        canvasElement.width -
          results?.rightHandLandmarks[8]?.x * canvasElement.width <=
          x + width &&
        results?.rightHandLandmarks[8].y * canvasElement.height >= y &&
        results?.rightHandLandmarks[8].y * canvasElement.height <= y + height
      ) {
        if (onoff == "on") {
          setBool(true);
        } else if (onoff == "off") {
          setBool(false);
        }
        canvasCtx.fillStyle = color;
      }
    }
    canvasCtx?.fillRect(1080 - x + width, y, width, height);

    canvasCtx?.restore();
  }
};
