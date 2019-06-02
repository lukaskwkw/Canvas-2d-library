export const CircleCleanFix = 0.8;

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
) => context => {
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
      renderer(x, y)(height, width)(context);
    } else {
      context.fillRect(x + startX, y + startY, offset, offset);
    }
  }
};

export const circleUpAndDown = (
  radius = 50,
  originX = null,
  originY = null,
  circleOffset = null,
  speed = 0.02
) => (height, width) => context => {
  const startX = typeof originX == "number" ? originX : width * 0.5,
    startY = typeof originY == "number" ? originY : height * 0.5,
    offset = circleOffset || height * 0.4;

  let radian = 0;
  let y = 0;

  const render = () => {
    clearArc(context)(
      startX,
      y,
      radius + CircleCleanFix,
      0,
      Math.PI * 2,
      false
    );

    y = startY + Math.sin(radian) * offset;

    context.beginPath();
    context.arc(startX, y, radius, 0, Math.PI * 2, false);
    context.fill();

    radian += speed;

    requestAnimationFrame(render);
  };

  render();
};

export const circleUpAndDownAndPulse = (
  originX = null,
  originY = null,
  maxRadius = 50,
  minRadius = 20,
  pulseRadianStart = 0,
  circleOffset = maxRadius / 2,
  upAndDownOffset = null,
  speed = 0.02
) => (height, width) => context => {
  const startX = typeof originX == "number" ? originX : width * 0.5,
    startY = typeof originY == "number" ? originY : height * 0.5,
    offset = upAndDownOffset || height * 0.4;

  let radian = 0;
  let pulseRadian = pulseRadianStart;
  let y = 0;
  let radius = 0;

  const render = () => {
    clearArc(context)(
      startX,
      y,
      radius + CircleCleanFix,
      0,
      Math.PI * 2,
      false
    );

    y = startY + Math.sin(radian) * offset;
    radius =
      circleOffset +
      minRadius / 2 +
      Math.sin(pulseRadian) * (circleOffset - minRadius / 2);

    context.beginPath();
    context.arc(startX, y, radius, 0, Math.PI * 2, false);
    context.fill();

    radian += speed;
    pulseRadian += speed;

    requestAnimationFrame(render);
  };

  render();
};

export const circlePulse = (x, y, maxRadius = 50, minRadius = 20) => (
  height,
  width
) => context => {
  const startX = typeof x == "number" ? x : width * 0.5,
    startY = typeof y == "number" ? y : height * 0.5,
    offset = maxRadius / 2;

  let radian = 0;
  const speed = 0.05;
  let radius = 0;

  const render = () => {
    clearArc(context)(
      startX,
      startY,
      radius + CircleCleanFix,
      0,
      Math.PI * 2,
      false
    );

    radius =
      offset + minRadius / 2 + Math.sin(radian) * (offset - minRadius / 2);

    context.beginPath();
    context.arc(startX, startY, radius, 0, Math.PI * 2, false);
    context.fill();

    radian += speed;

    requestAnimationFrame(render);
  };

  render();
};

export const orbit = (
  xOrbitRadius,
  yOrbitRadius = xOrbitRadius,
  orbitSize = 20,
  speed = 0.1,
  centreX,
  centreY
) => (height, width) => context => {
  const x = typeof centreX === "number" ? centreX : width / 2,
    y = typeof centreY === "number" ? centreY : height / 2;

  let radian = 0;
  let orbitX = 0;
  let orbitY = 0;
  const render = () => {
    clearArc(context)(
      orbitX + x,
      orbitY + y,
      orbitSize + CircleCleanFix,
      0,
      Math.PI * 2,
      false
    );

    orbitX = xOrbitRadius * Math.cos(radian);
    orbitY = yOrbitRadius * Math.sin(radian);

    context.beginPath();
    context.arc(orbitX + x, orbitY + y, orbitSize, 0, Math.PI * 2, false);
    context.fill();

    radian += speed;

    requestAnimationFrame(render);
  };

  render();
};

export const lissajousCurves = (
  xOrbitRadius,
  yOrbitRadius = xOrbitRadius,
  orbitSize = 20,
  xSpeed = 0.1,
  ySpeed = 0.11,
  centreX,
  centreY
) => (height, width) => context => {
  const x = typeof centreX === "number" ? centreX : width / 2,
    y = typeof centreY === "number" ? centreY : height / 2;

  let xRadian = 0;
  let yRadian = 0;

  //move out of render function in order to
  //momorize last postition and clean it before new render
  let orbitX = 0;
  let orbitY = 0;

  const render = () => {
    clearArc(context)(
      orbitX + x,
      orbitY + y,
      orbitSize + CircleCleanFix,
      0,
      Math.PI * 2,
      true
    );

    orbitX = xOrbitRadius * Math.cos(xRadian);
    orbitY = yOrbitRadius * Math.sin(yRadian);

    context.beginPath();
    context.arc(orbitX + x, orbitY + y, orbitSize, 0, Math.PI * 2, false);
    context.fill();

    xRadian += xSpeed;
    yRadian += ySpeed;

    requestAnimationFrame(render);
  };

  render();
};

export const circleAlpha = (radius = 100, colorRGB = "100, 001, 100") => (
  height,
  width
) => context => {
  const startX = width * 0.5,
    startY = height * 0.5,
    offset = 0.5;

  let radian = 0;
  const speed = 0.05;
  const baseAlpha = 0.5;

  const render = () => {
    const alpha = baseAlpha + Math.sin(radian) * offset;

    //in order to completly erase opacity black color need to be set
    context.fillStyle = `#000`;
    clearArc(context)(
      startX,
      startY,
      radius + CircleCleanFix,
      0,
      Math.PI * 2,
      false
    );

    context.fillStyle = `rgba(${colorRGB}, ${alpha})`;
    context.beginPath();
    context.arc(startX, startY, radius, 0, Math.PI * 2, false);
    context.fill();

    radian += speed;

    requestAnimationFrame(render);
  };

  render();
};
