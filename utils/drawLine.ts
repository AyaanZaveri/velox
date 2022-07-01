export const drawLine = (
  results: any,
  canvasCtx: any,
  canvasElement: any,
  hand = "both",
  idx1: number,
  idx2: number,
  lineWidth = 10,
  strokeColor = "red"
) => {
  if (hand == "right") {
    const { x: x1, y: y1 } = results.rightHandLandmarks
      ? results.rightHandLandmarks[idx1]
      : 0;
    const { x: x2, y: y2 } = results.rightHandLandmarks
      ? results.rightHandLandmarks[idx2]
      : 0;

    canvasCtx.beginPath();
    canvasCtx.moveTo(x1 * canvasElement.width, y1 * canvasElement.height);
    canvasCtx.lineTo(x2 * canvasElement.width, y2 * canvasElement.height);
    canvasCtx.lineWidth = lineWidth;
    canvasCtx.strokeStyle = strokeColor;
    canvasCtx.stroke();
  } else if (hand == "left") {
    const { x: x1, y: y1 } = results.leftHandLandmarks
      ? results.leftHandLandmarks[idx1]
      : 0;
    const { x: x2, y: y2 } = results.leftHandLandmarks
      ? results.leftHandLandmarks[idx2]
      : 0;

    canvasCtx.beginPath();
    canvasCtx.moveTo(x1 * canvasElement.width, y1 * canvasElement.height);
    canvasCtx.lineTo(x2 * canvasElement.width, y2 * canvasElement.height);
    canvasCtx.lineWidth = lineWidth;
    canvasCtx.strokeStyle = strokeColor;
    canvasCtx.stroke();
  } else {
    const { x: x1, y: y1 } = results.rightHandLandmarks
      ? results.rightHandLandmarks[idx1]
      : 0;
    const { x: x2, y: y2 } = results.rightHandLandmarks
      ? results.rightHandLandmarks[idx2]
      : 0;
    const { x: x3, y: y3 } = results.leftHandLandmarks
      ? results.leftHandLandmarks[idx1]
      : 0;
    const { x: x4, y: y4 } = results.leftHandLandmarks
      ? results.leftHandLandmarks[idx2]
      : 0;

    canvasCtx.beginPath();
    canvasCtx.moveTo(x1 * canvasElement.width, y1 * canvasElement.height);
    canvasCtx.lineTo(x2 * canvasElement.width, y2 * canvasElement.height);
    canvasCtx.moveTo(x3 * canvasElement.width, y3 * canvasElement.height);
    canvasCtx.lineTo(x4 * canvasElement.width, y4 * canvasElement.height);
    canvasCtx.lineWidth = lineWidth;
    canvasCtx.strokeStyle = strokeColor;
    canvasCtx.stroke();
  }
};
