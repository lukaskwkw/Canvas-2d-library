import { PlainGravityParticle, PlainGravityFeatures } from "./GravityParticle";
import Vector, { Point } from "../vector";
import { connectDots } from "./draw";
import { PlaneDimensions } from "./plane";

const UPDATERS = {
  DRAW_ATTACHEMENTS: "drawSpringAttachements",
  SPRING_POINTS_OF_ATTACHEMENTS: "springAttachements"
};

export interface SpringFeatures extends PlainGravityFeatures {
  k: number;
  pointsOfAttachments?: Array<Point>;
  drawAttachementsLines?: boolean;
  offset?: number;
}

interface Spring {
  features: SpringFeatures;
  attachTo(position: Point): void;
}

const springUpdater = (spring: SpringWithGravity) => () => {
  spring.features.pointsOfAttachments.forEach((point: Point) => {
    const distanceX = point.x - spring.x;
    const distanceY = point.y - spring.y;

    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    const springForce = (distance - spring.features.offset) * spring.features.k;
    const springForceX = (distanceX / distance) * springForce;
    const springForceY = (distanceY / distance) * springForce;
    spring.accelerate(springForceX, springForceY);
  });
};

const drawLinesToAttachements = ({
  context,
  features: { pointsOfAttachments },
  x,
  y
}: SpringWithGravity) => () => {
  context.beginPath();
  pointsOfAttachments.forEach((point: Point) => {
    connectDots([{ x, y }, point]);
  });
  context.stroke();
};

class SpringWithGravity extends PlainGravityParticle implements Spring {
  features: SpringFeatures;

  constructor(
    position: Point,
    features: SpringFeatures,
    renderer?: Function,
    planeDimensions?: PlaneDimensions
  ) {
    super(position, features, renderer, planeDimensions);
    this.features = {
      drawAttachementsLines: false,
      pointsOfAttachments: [],
      offset: 0,
      ...this.features,
      ...features
    };

    this.update.push({
      name: UPDATERS.SPRING_POINTS_OF_ATTACHEMENTS,
      updater: springUpdater(this)
    });
    if (this.features.drawAttachementsLines) {
      this.update.push({
        name: UPDATERS.DRAW_ATTACHEMENTS,
        updater: drawLinesToAttachements(this)
      });
    }
  }

  attachTo(position: Point) {
    this.features.pointsOfAttachments.push(position);
  }
}

export default SpringWithGravity;
