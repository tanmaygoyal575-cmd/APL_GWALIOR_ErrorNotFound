import { BallCondition, PhysicsParameters } from "../types";

export const BallConditionEngine = {
  analyze: (params: PhysicsParameters): BallCondition => {
    // Inputs with fallback sensible values
    const overs = params.ball_overs_used !== undefined ? params.ball_overs_used : 15;
    const seamWear = params.ball_seam_wear !== undefined ? params.ball_seam_wear : (overs * 1.1);
    const shineSideA = params.ball_shine_side_a !== undefined ? params.ball_shine_side_a : Math.max(0, 95 - (overs * 1.5));
    const roughnessSideB = params.ball_roughness_side_b !== undefined ? params.ball_roughness_side_b : Math.min(100, (overs * 2.2));
    const ballMoisture = params.ball_moisture_wet !== undefined ? params.ball_moisture_wet : 10;
    const ballHardness = params.ball_hardness_score !== undefined ? params.ball_hardness_score : Math.max(20, 100 - (overs * 0.8));

    // 1. Ball State Classification
    let ballStateLabel: "New Ball" | "Semi-New" | "Old Ball" | "Reverse Swing Phase" | "Wet Ball" = "Semi-New";
    if (ballMoisture > 70) {
      ballStateLabel = "Wet Ball";
    } else if (overs <= 8) {
      ballStateLabel = "New Ball";
    } else if (overs >= 45) {
      ballStateLabel = "Old Ball";
    } else if (overs >= 25 && Math.abs(shineSideA - roughnessSideB) > 35) {
      ballStateLabel = "Reverse Swing Phase";
    } else {
      ballStateLabel = "Semi-New";
    }

    // 2. Swing potential
    // Conventional swing is maximum with a NEW, hard ball, with clean seam, and low moisture (or dry ball).
    let conventionalSwingPotential = 0;
    if (overs <= 15) {
      conventionalSwingPotential = Math.round(
        (100 - seamWear) * 0.6 + (shineSideA) * 0.4
      );
    } else {
      // decays aggressively as ball gets older
      conventionalSwingPotential = Math.max(5, Math.round(40 - (overs - 15) * 1.5));
    }
    // Wet ball drops swing potential
    if (ballMoisture > 50) {
      conventionalSwingPotential = Math.round(conventionalSwingPotential * 0.4);
    }

    // 3. Reverse Swing Potential
    // High overs (usually 25+), high roughness on one side, high shine on the other, dry conditions
    let reverseSwingPotential = 0;
    if (overs >= 20 && ballMoisture < 40) {
      const asymmetry = Math.abs(shineSideA - roughnessSideB);
      reverseSwingPotential = Math.round(
        asymmetry * 0.8 + (100 - ballMoisture) * 0.2
      );
    }
    reverseSwingPotential = Math.max(0, Math.min(95, reverseSwingPotential));

    // 4. Drift Potential
    // Spinner's flight. Semi-worn ball can drift beautifully under air friction
    let driftPotential = Math.round(
      (seamWear * 0.4 + (100 - ballHardness) * 0.3 + 50)
    );
    if (ballMoisture > 60) driftPotential = Math.round(driftPotential * 0.5); // slick ball won't drift nicely

    // 5. Spin Grip
    // Roughened, dry surface with prominent worn seams allows spinner fingers or surface friction to bite
    let spinGripPotential = Math.round(
      (roughnessSideB * 0.5 + seamWear * 0.3 + (100 - ballMoisture) * 0.2)
    );
    // If extremely wet, spin grip is severely compromised
    if (ballMoisture > 75) {
      spinGripPotential = Math.max(10, Math.round(spinGripPotential * 0.25));
    }

    // 6. Velocity and Bounce decay
    // Worn, soft balls lose speed and bounce energy from core compression losses
    const velocityLossPercent = Math.min(25, parseFloat((overs * 0.25 + (100 - ballHardness) * 0.1).toFixed(1)));
    const bounceDecayPercent = Math.min(35, parseFloat((overs * 0.35 + (100 - ballHardness) * 0.15).toFixed(1)));

    // Degradability Speed label
    let degradabilitySpeed = "Standard";
    if (ballMoisture > 70) {
      degradabilitySpeed = "Saturating";
    } else if (params.pitch_type_modifier === "Concrete") {
      degradabilitySpeed = "Extremely Rapid";
    } else if (params.pitch_type_modifier === "Dusty/Dry") {
      degradabilitySpeed = "Accelerated (Abrasive)";
    } else {
      degradabilitySpeed = "Normal";
    }

    return {
      conventionalSwingPotential,
      reverseSwingPotential,
      driftPotential,
      spinGripPotential,
      velocityLossPercent,
      bounceDecayPercent,
      ballStateLabel,
      degradabilitySpeed
    };
  },

  // Generates next state metadata when ball degrades over overs
  degradeNextOver: (params: PhysicsParameters, currentOvers: number): Partial<PhysicsParameters> => {
    const deltaOvers = 1;
    const nextOvers = currentOvers + deltaOvers;
    
    // speed up wear based on abrasive surfaces
    let wearRate = 1.2;
    if (params.pitch_type_modifier === "Concrete") wearRate = 2.5;
    if (params.pitch_type_modifier === "Dusty/Dry") wearRate = 1.8;
    if (params.pitch_type_modifier === "Mud") wearRate = 0.5;

    const nextSeamWear = Math.min(100, (params.ball_seam_wear || 0) + wearRate * 1.5);
    const nextShine = Math.max(0, (params.ball_shine_side_a || 95) - wearRate * 1.8);
    const nextRoughness = Math.min(100, (params.ball_roughness_side_b || 5) + wearRate * 2.2);
    const nextHardness = Math.max(15, (params.ball_hardness_score || 100) - wearRate * 0.6);

    return {
      ball_overs_used: nextOvers,
      ball_seam_wear: Math.round(nextSeamWear),
      ball_shine_side_a: Math.round(nextShine),
      ball_roughness_side_b: Math.round(nextRoughness),
      ball_hardness_score: Math.round(nextHardness)
    };
  }
};
