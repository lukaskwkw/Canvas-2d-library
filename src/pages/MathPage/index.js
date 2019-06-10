import React from "react";
import { Canvas, Plane } from "../../components/Canvas";
import { drawRandomLines, sinus, orbit } from "../../utils/canvas/rendeners";
import {
  sinusRendererLissajousCurves,
  sinusRendererUpAndDownAndPulse
} from "./setups";

const MathTab = () => pug`
  Plane
    // Canvas(renderer = sinus(true, 0.5, sinusRendererOrbit))

    // Canvas(renderer = sinus(true, 0.1, sinusRendererUpAndDown))

    Canvas(renderer = sinus(true, 0.005, sinusRendererLissajousCurves))

    Canvas(renderer = sinus(true, 0.03, sinusRendererUpAndDownAndPulse))

    Canvas(renderer = sinus(true, 0.01))
    
    Canvas(renderer = drawRandomLines(10))
    
    // Canvas(renderer = circlePulse(null, null, 30))

    // Canvas(renderer = circleAlpha())

    Canvas(renderer = orbit(150, 150, 0.1, 200,400))
        
    Canvas(renderer = orbit(200, 200, 20, 0.01))
`;

export default MathTab;
