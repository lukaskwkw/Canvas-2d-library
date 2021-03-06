import { PlaneDimensions, PlaneSingleton } from "./plane";
import { Point } from "../vector";

export const Circle = (context?: CanvasRenderingContext2D) => (
  originPosition: Point,
  originSize: number = 20,
  originColor: string = "#000"
) => {
  const cxt = context || new PlaneSingleton().context;
  const piDoubled = Math.PI * 2;
  cxt.fillStyle = originColor;
  return {
    renderer: (
      { x, y }: Point = originPosition,
      size: number = originSize,
      color: string = originColor
    ) => {
      cxt.fillStyle = color;
      cxt.beginPath();
      cxt.arc(x, y, size, 0, piDoubled, false);
      cxt.fill();
    }
  };
};

export const circlePulse = (
  maxRadius = 50,
  minRadius = 20,
  x = null,
  y = null,
  planeDimensions?: PlaneDimensions,
  context?: CanvasRenderingContext2D
) => {
  const plane = new PlaneSingleton();
  const { width, height } = planeDimensions || plane.features.dimensions;
  const cxt = context || plane.context;

  const startX = typeof x == "number" ? x : width * 0.5,
    startY = typeof y == "number" ? y : height * 0.5,
    offset = maxRadius / 2;

  let radian = 0;
  const speed = 0.05;
  let radius = 0;

  return (point: Point = { x: startX, y: startY }, size = minRadius, color) => {
    radius = offset + size / 2 + Math.sin(radian) * (offset - size / 2);

    cxt.fillStyle = color;
    cxt.beginPath();
    cxt.arc(point.x, point.y, radius, 0, Math.PI * 2, false);
    cxt.fill();

    radian += speed;
  };
};

export const ShapeInCircle = (
  radius?: number,
  angle: number = Math.PI / 6,
  edges: number = 3,
  context?: CanvasRenderingContext2D
) => {
  const ctx = context || new PlaneSingleton().context;

  const PiDoubled = Math.PI * 2;
  const angleIteration = PiDoubled / edges;
  return ({ x, y }: Point, size = radius) => {
    const drawOffsetX = Math.cos(angle) * size;
    const drawOffsetY = Math.sin(angle) * size;
    const startDrawX = x + drawOffsetX;
    const startDrawY = y + drawOffsetY;
    ctx.moveTo(startDrawX, startDrawY);
    for (let arc = 0; arc <= PiDoubled; arc += angleIteration) {
      const arcX = Math.cos(arc) * size;
      const arcY = Math.sin(arc) * size;
      ctx.lineTo(x + arcX, y + arcY);
    }
  };
};

export const clearArc = context => (
  x,
  y,
  radius,
  startAngle,
  endAngle,
  anticlockwise
) => {
  context.globalCompositeOperation = "destination-out";

  context.beginPath();
  context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  context.fill();

  context.globalCompositeOperation = "lighter";
};

export const drawRandomLines = (numberOfLines = 100) => (
  width,
  height
) => context => {
  for (let index = 0; index < numberOfLines; index++) {
    context.beginPath();
    context.moveTo(Math.random() * width, Math.random() * height);
    context.lineTo(Math.random() * width, Math.random() * height);
    context.stroke();
  }
};

export const sinus = (invert = true, frequncy = 0.5, renderer) => (
  height,
  width
) => (canvas: HTMLCanvasElement, checkUnmount) => {
  const context = canvas.getContext("2d");

  const startX = width * 0.1,
    startY = height * 0.1,
    offset = 5;

  if (invert) {
    context.translate(0, height / 2);
    context.scale(1, -1);
  }

  for (let radian = frequncy; radian < Math.PI * 2; radian += frequncy) {
    let x = radian * 150;
    let y = Math.sin(radian) * 50;

    if (renderer) {
      renderer(x, y)(height, width)(context, checkUnmount);
    } else {
      context.fillRect(x + startX, y + startY, offset, offset);
    }
  }
};

export const circleUpAndDown = (
  radius = 50,
  speed = 0.02,
  originX = null,
  originY = null,
  circleOffset = null,
  planeDimensions?: PlaneDimensions,
  context?: CanvasRenderingContext2D
) => {
  const plane = new PlaneSingleton();
  const { width, height } = planeDimensions || plane.features.dimensions;
  const cxt = context || plane.context;

  const startX = typeof originX == "number" ? originX : width * 0.5,
    startY = typeof originY == "number" ? originY : height * 0.5,
    offset = circleOffset || height * 0.4;

  let radian = 0;
  let y = 0;
  return () => {
    y = startY + Math.sin(radian) * offset;

    cxt.beginPath();
    cxt.arc(startX, y, radius, 0, Math.PI * 2, false);
    cxt.fill();

    radian += speed;
  };
};

export const circleUpAndDownAndPulse = (
  maxRadius = 50,
  minRadius = 20,
  pulseRadianStart = 0,
  circleOffset = maxRadius / 2,
  upAndDownOffset = null,
  speed = 0.02,
  originX = null,
  originY = null,
  planeDimensions?: PlaneDimensions,
  context?: CanvasRenderingContext2D
) => {
  const plane = new PlaneSingleton();
  const { width, height } = planeDimensions || plane.features.dimensions;
  const cxt = context || plane.context;

  const startX = typeof originX == "number" ? originX : width * 0.5,
    startY = typeof originY == "number" ? originY : height * 0.5,
    offset = upAndDownOffset || height * 0.4;

  let radian = 0;
  let pulseRadian = pulseRadianStart;
  let y = 0;
  let radius = 0;
  return () => {
    y = startY + Math.sin(radian) * offset;
    radius =
      circleOffset +
      minRadius / 2 +
      Math.sin(pulseRadian) * (circleOffset - minRadius / 2);

    cxt.beginPath();
    cxt.arc(startX, y, radius, 0, Math.PI * 2, false);
    cxt.fill();

    radian += speed;
    pulseRadian += speed;
  };
};

export const lissajousCurves = (
  xOrbitRadius,
  yOrbitRadius = xOrbitRadius,
  orbitSize = 20,
  xSpeed = 0.1,
  ySpeed = 0.11,
  centreX = undefined,
  centreY = undefined,
  planeDimensions?: PlaneDimensions,
  context?: CanvasRenderingContext2D
) => {
  const plane = new PlaneSingleton();
  const { width, height } = planeDimensions || plane.features.dimensions;
  const cxt = context || plane.context;

  const x = typeof centreX === "number" ? centreX : width / 2,
    y = typeof centreY === "number" ? centreY : height / 2;

  let xRadian = 0;
  let yRadian = 0;

  //move out of render function in order to
  //momorize last postition and clean it before new render
  let orbitX = 0;
  let orbitY = 0;
  return () => {
    orbitX = xOrbitRadius * Math.cos(xRadian);
    orbitY = yOrbitRadius * Math.sin(yRadian);

    cxt.beginPath();
    cxt.arc(orbitX + x, orbitY + y, orbitSize, 0, Math.PI * 2, false);
    cxt.fill();

    xRadian += xSpeed;
    yRadian += ySpeed;
  };
};

export const circleAlpha = (
  radius = 100,
  colorRGB = "100, 001, 100",
  planeDimensions?: PlaneDimensions,
  context?: CanvasRenderingContext2D
) => {
  const plane = new PlaneSingleton();
  const { width, height } = planeDimensions || plane.features.dimensions;
  const cxt = context || plane.context;

  const startX = width * 0.5,
    startY = height * 0.5,
    offset = 0.5;

  let radian = 0;
  const speed = 0.05;
  const baseAlpha = 0.5;

  //color must be set as string with format "\d\d\d, \d\d\d, \d\d\d"
  return (x = startX, y = startY, size = radius, color = colorRGB) => {
    const alpha = baseAlpha + Math.sin(radian) * offset;
    cxt.fillStyle = `rgba(${color}, ${alpha})`;
    cxt.beginPath();
    cxt.arc(x, y, size, 0, Math.PI * 2, false);
    cxt.fill();

    radian += speed;
  };
};

export const SpaceShip = (
  originSize = 20,
  originX = null,
  originY = null,
  planeDimensions?: PlaneDimensions,
  context?: CanvasRenderingContext2D
) => {
  const plane = new PlaneSingleton();
  const { width, height } = planeDimensions || plane.features.dimensions;
  const cxt = context || plane.context;
  return (
    x: number = originX || width / 2,
    y: number = originY || height / 2,
    size: number = originSize,
    color: string = "black",
    angle: number,
    ignite: number
  ) => {
    // let region = new Path2D();
    cxt.save();
    cxt.fillStyle = color;
    cxt.translate(x, y);
    cxt.rotate(angle);

    cxt.beginPath();
    cxt.moveTo(0, -size / 2);
    cxt.lineTo(size / 2, size / 2);
    cxt.lineTo(-size / 2, size / 2);
    cxt.closePath();
    if (ignite) {
      cxt.moveTo(0, size / 2);
      cxt.lineTo(0, size * 1.5);
    }
    // ctx.fillStyle = color;
    // ctx.fill(region, 'evenodd');
    cxt.stroke();
    cxt.restore();
  };
};
