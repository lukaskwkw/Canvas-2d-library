export const fpsMeter = (checkEveryFrames: number = 20) => {
  let fpsArray = [];
  let counter = 0;
  let average = 0;
  let prevDelta = 0;
  let delta = 0;
  return {
    start: timestamp => {
      delta = timestamp - prevDelta;
    },
    end: timestamp => {
      if (counter >= checkEveryFrames) {
        let sum = fpsArray.reduce((a, b) => a + b);
        average = ~~(sum / fpsArray.length);
        counter = 0;
        fpsArray = [];
      } else {
        const currentFPS = 1000 / delta;
        fpsArray.push(currentFPS);
        counter++;
      }
      prevDelta = timestamp;
    },
    getAverage: () => average
  };
};

/* if (average > 35) {
  const newParticles = rangeOf(amount, () => {
    const particle = new AdvancedGravityParticle(
      originPosition,
      {
        size: circleSizeFormula(),
        speed: particleSpeedFormula(),
        direction: -Math.PI / 3,
        weight: circleSizeFormula()
      },
      particleRenderer(circleSizeFormula())
    );
    particle.setGravityTowards(RedBaron);
    particle.setGravityTowards(HugeGreen);
    particle.setGravityTowards(BlueBilbo);
    particle.setGravityTowards(GreenGoblin);
    return particle;
  });

  particles.push(...newParticles);
  amount *= average > 50 ? 1.5 : 1;
  console.info(
    `Added ${amount} more particles ! new length = ${particles.length}`
  );
} */
