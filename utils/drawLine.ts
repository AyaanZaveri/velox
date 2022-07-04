export const drawLine = (
  results: any,
  ctx: any,
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

    ctx.beginPath();
    ctx.moveTo(x1 * canvasElement.width, y1 * canvasElement.height);
    ctx.lineTo(x2 * canvasElement.width, y2 * canvasElement.height);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  } else if (hand == "left") {
    const { x: x1, y: y1 } = results.leftHandLandmarks
      ? results.leftHandLandmarks[idx1]
      : 0;
    const { x: x2, y: y2 } = results.leftHandLandmarks
      ? results.leftHandLandmarks[idx2]
      : 0;

    ctx.beginPath();
    ctx.moveTo(x1 * canvasElement.width, y1 * canvasElement.height);
    ctx.lineTo(x2 * canvasElement.width, y2 * canvasElement.height);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
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

    ctx.beginPath();
    ctx.moveTo(x1 * canvasElement.width, y1 * canvasElement.height);
    ctx.lineTo(x2 * canvasElement.width, y2 * canvasElement.height);
    ctx.moveTo(x3 * canvasElement.width, y3 * canvasElement.height);
    ctx.lineTo(x4 * canvasElement.width, y4 * canvasElement.height);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }
};
