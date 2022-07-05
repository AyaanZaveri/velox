export const createRect = (
  x: number,
  y: number,
  width: number,
  height: number,
  results: any,
  ctx: any,
  canvasElement: any,
  hand = "left",
  offset = 30,
  onoff: string,
  hovering: boolean,
  setBool: any
) => {
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
        // ctx.fillStyle = color;
      }
    }
    ctx.fillRect(1080 - x, y, width, height);

    ctx?.restore();
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
        // ctx.fillStyle = color;
      }
    }

    ctx.fillRect(1080 - x, y, width, height);

    ctx?.restore();
  }
};
