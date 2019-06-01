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
  x = null,
  y = null,
  circleOffset = null,
  speed = 0.02
) => (height, width) => context => {
  const startX = typeof x == "number" ? x : width * 0.5,
    startY = typeof y == "number" ? y : height * 0.5,
    offset = circleOffset || height * 0.4;

  let radian = 0;

  const render = () => {
    const y = startY + Math.sin(radian) * offset;

    context.clearRect(
      startX - radius,
      y - radius - speed * 450,
      radius * 2,
      radius * 2 + speed * 900
    );

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

  context.globalCompositeOperation = "overlay";
  const render = () => {
    const y = startY + Math.sin(radian) * offset;
    const radius =
      circleOffset +
      minRadius / 2 +
      Math.sin(pulseRadian) * (circleOffset - minRadius / 2);

    context.clearRect(
      startX - maxRadius,
      y - maxRadius - speed * 450,
      maxRadius * 2,
      maxRadius * 2 + speed * 900
    );

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

  const render = () => {
    const radius =
      offset + minRadius / 2 + Math.sin(radian) * (offset - minRadius / 2);

    context.clearRect(
      startX - maxRadius,
      startY - maxRadius,
      maxRadius * 2,
      maxRadius * 2
    );

    context.beginPath();
    context.arc(startX, startY, radius, 0, Math.PI * 2, false);
    context.fill();

    radian += speed;

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

    context.fillStyle = `rgba(${colorRGB}, ${alpha})`;

    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.arc(startX, startY, radius, 0, Math.PI * 2, false);
    context.fill();

    radian += speed;

    requestAnimationFrame(render);
  };

  render();
};
