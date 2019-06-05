export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const topBoundryCheck = (y, offset = 0) => y - offset < 0;
export const bottomBoundryCheck = (y, height, offset = 0) =>
  y + offset >= height;
export const leftBoundryCheck = (x, offset = 0) => x - offset < 0;
export const rightBoundryCheck = (x, width, offset = 0) => x + offset > width;
export const checkBoundaries = ({ x, y }, width, height, offset = 0) =>
  topBoundryCheck(y, offset) ||
  bottomBoundryCheck(y, height, offset) ||
  leftBoundryCheck(x, offset) ||
  rightBoundryCheck(x, width, offset);

export const bouncingBoundires = (
  particle,
  planeWidth,
  planeHeight,
  offset = 0,
  checkTop = true,
  checkBottom = true,
  checkLeft = true,
  checkRight = true
) => {
  const { velocity, position } = particle;
  const downgradeBy = -0.9 + Math.random() * 0.3;

  if (checkTop && topBoundryCheck(position.getY(), offset)) {
    position.setY(offset);
    velocity.setY(velocity.getY() * downgradeBy);
  }

  if (checkBottom && bottomBoundryCheck(position.getY(), planeHeight, offset)) {
    position.setY(planeHeight - offset);
    velocity.setY(velocity.getY() * downgradeBy);
  }

  if (checkLeft && leftBoundryCheck(position.getX(), offset)) {
    position.setX(offset);
    velocity.setX(velocity.getX() * downgradeBy);
  }

  if (checkRight && rightBoundryCheck(position.getX(), planeWidth, offset)) {
    position.setX(planeWidth - offset);
    velocity.setX(velocity.getX() * downgradeBy);
  }
};

export const removeDeadParticles = (particles, width, height) => {
  for (let index = 0; index < particles.length; index++) {
    const particle = particles[index];
    const topBoundryCheck = particle.position.getY() < 0;
    const bottomBoundryCheck = particle.position.getY() > height;
    const leftBoundryCheck = particle.position.getX() < 0;
    const rightBoundryCheck = particle.position.getX() > width;
    if (
      topBoundryCheck ||
      bottomBoundryCheck ||
      leftBoundryCheck ||
      rightBoundryCheck
    ) {
      particles.splice(index, 1);
    }
  }
};

export const bottomEmitter = (
  particle,
  originX,
  originY,
  speed,
  angle,
  planeHeight
) => {
  if (bottomBoundryCheck(particle.position.getY(), planeHeight)) {
    particle.position.setCords({ x: originX, y: originY });
    particle.velocity.setLength(speed);
    particle.velocity.setAngle(angle);
  }
};
