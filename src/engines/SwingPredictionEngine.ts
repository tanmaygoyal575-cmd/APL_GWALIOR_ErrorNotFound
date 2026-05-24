import { SwingSpinAnalysis, PhysicsParameters } from "../types";

export interface TrajectoryPoint {
  x: number; // horizontal distance down pitch (continuous 0 to 20 meters)
  y: number; // height off ground (start 2.2m down to bounce, then up)
  z: number; // lateral deviation (inches/cm relative to stumps center, start 0)
}

export const SwingPredictionEngine = {
  analyze: (params: PhysicsParameters): SwingSpinAnalysis => {
    const speed = params.ball_speed_kmh;
    const rpm = params.spin_rate_rpm;
    const spinType = params.spin_type;
    const pitchType = params.pitch_type_modifier;

    const humidity = params.air_humidity !== undefined ? params.air_humidity : 60;
    const temp = params.air_temperature !== undefined ? params.air_temperature : 30;
    const windSpeed = params.wind_speed_kmh !== undefined ? params.wind_speed_kmh : 10;
    const windDir = params.wind_direction !== undefined ? params.wind_direction : "East";

    const overs = params.ball_overs_used !== undefined ? params.ball_overs_used : 15;
    const shininess = params.ball_shine_side_a !== undefined ? params.ball_shine_side_a : 80;
    const roughness = params.ball_roughness_side_b !== undefined ? params.ball_roughness_side_b : 20;

    // 1. Swing Direction & Intensity
    // Conventional swing works best around 125-138 km/h. At higher speeds (145+), reverse swing takes over if ball is worn and asymmetric.
    let swingDirection: "Inswing" | "Outswing" | "Wobble" | "None" = "None";
    let swingIntensity = 0; // scale 0 - 10
    let reverseActive = false;

    if (spinType === "Swing-Only") {
      // decide if conventional or reverse
      if (overs >= 25 && Math.abs(shininess - roughness) > 35 && speed > 135) {
        reverseActive = true;
        swingDirection = "Inswing"; // reverse swing bends back sharply
        swingIntensity = Math.min(10, Math.floor((speed - 110) * 0.12 + Math.abs(shininess - roughness) * 0.08));
      } else {
        swingDirection = "Outswing"; // standard swing tailing away
        // maximum swing is at 128 km/h. Drops if too slow or too fast.
        const speedEfficiency = Math.max(0, 1 - Math.abs(speed - 128) / 35);
        const atmosphericFactor = (humidity / 100) * 1.5 + (45 - temp) / 60;
        swingIntensity = Math.min(10, Math.floor(8 * speedEfficiency * (shininess / 100) * atmosphericFactor));
      }
    } else if (spinType === "None") {
      swingDirection = "Wobble";
      swingIntensity = 1 + Math.floor(Math.random() * 2);
    }

    // 2. Lateral Force (Magnus effect) before bounce
    let magnusForceDevCm = 0;
    if (spinType === "Leg-Spin") {
      magnusForceDevCm = (rpm / 2500) * 8.0; // spin causes drift in air
    } else if (spinType === "Off-Spin") {
      magnusForceDevCm = -(rpm / 2500) * 8.0;
    } else if (spinType === "Top-Spin") {
      magnusForceDevCm = 0; // causes dip and bounce, no side split
    } else if (swingDirection === "Outswing") {
      magnusForceDevCm = (swingIntensity * 1.5);
    } else if (swingDirection === "Inswing") {
      magnusForceDevCm = -(swingIntensity * 1.5);
    }

    // Wind overlay
    let windDrift = 0;
    if (windDir === "East") {
      windDrift = (windSpeed * 0.15);
    } else if (windDir === "West") {
      windDrift = -(windSpeed * 0.15);
    }
    magnusForceDevCm += windDrift;

    // 3. Spin Deviation After Pitch-down (Friction Grip)
    let spinDeviationCm = 0;
    if (spinType === "Leg-Spin") {
      // Basic bounce spin rip
      const surfaceGrip = pitchType === "Dusty/Dry" ? 1.6 :
                          pitchType === "Green/Grassy" ? 0.7 :
                          pitchType === "Concrete" ? 0.2 : 
                          pitchType === "Mud" ? 1.1 : 1.0;
      spinDeviationCm = (rpm / 2000) * 18 * surfaceGrip;
    } else if (spinType === "Off-Spin") {
      const surfaceGrip = pitchType === "Dusty/Dry" ? 1.6 :
                          pitchType === "Green/Grassy" ? 0.7 :
                          pitchType === "Concrete" ? 0.2 :
                          pitchType === "Mud" ? 1.1 : 1.0;
      spinDeviationCm = -(rpm / 2000) * 18 * surfaceGrip;
    } else if (spinType === "Top-Spin") {
      spinDeviationCm = 0; 
    } else if (spinType === "Swing-Only" && pitchType === "Green/Grassy") {
      // Seam movement on glassy
      spinDeviationCm = (speed > 135 ? 6.5 : 4.0);
    }

    // 4. Dip effect & Drift
    const driftAmountCm = magnusForceDevCm;
    let dipEffectCm = 0;
    if (spinType === "Top-Spin") {
      dipEffectCm = (rpm / 2000) * 6.5; // push down faster
    } else if (spinType === "Leg-Spin" || spinType === "Off-Spin") {
      dipEffectCm = (rpm / 2000) * 2.0; 
    }

    // 5. Bounce Angle Prediction
    // Faster balls bounce lower and skim. Topspin bounces steep. Dusty holds and kicks.
    let baseAngle = 18; // incoming average degrees
    if (speed > 145) baseAngle = 14;
    else if (speed < 100) baseAngle = 22;

    if (spinType === "Top-Spin") baseAngle += 4.5;
    if (pitchType === "Dusty/Dry") baseAngle += 2.0;
    if (pitchType === "Mud") baseAngle -= 3.0; // squishes flat

    const predictedBounceAngleDeg = parseFloat(baseAngle.toFixed(1));

    // Deviation probability: consistency metric
    const entropy = (pitchType === "Mud" ? 25 : pitchType === "Dusty/Dry" ? 20 : 5);
    const deviationProbability = Math.max(70, Math.min(100, 100 - entropy));

    return {
      swingDirection,
      swingIntensity,
      magnusForceDevCm: parseFloat(magnusForceDevCm.toFixed(1)),
      spinDeviationCm: parseFloat(spinDeviationCm.toFixed(1)),
      driftAmountCm: parseFloat(driftAmountCm.toFixed(1)),
      dipEffectCm: parseFloat(dipEffectCm.toFixed(1)),
      deviationProbability,
      predictedBounceAngleDeg
    };
  },

  // Generates points along the 20-meter pitch path for drawing trajectory visualization
  calculateTrajectoryPoints: (params: PhysicsParameters, analysis: SwingSpinAnalysis): TrajectoryPoint[] => {
    const points: TrajectoryPoint[] = [];
    const speedMs = params.ball_speed_kmh / 3.6; // convert to m/s
    
    // Choose length (where ball bounces, in meters from bowler)
    // 10-14m are standard lengths
    let bounceDistance = 12.5; 
    if (params.spin_type !== "None" && params.spin_type !== "Swing-Only") {
      bounceDistance = 11.5; // spinner pitches closer
    }

    const steps = 40;
    const stepDist = 20 / steps; // 20m pitch

    for (let i = 0; i <= steps; i++) {
      const x = i * stepDist;
      let y = 0;
      let z = 0;

      if (x < bounceDistance) {
        // Pre-bounce curve (parabolic drop + swing drift)
        const t = x / speedMs;
        // Gravity drop
        y = 2.2 - (0.5 * 9.8 * t * t) - (0.05 * x); // release height 2.2m with down angle
        // Swing or drift (magnus pre-bounce) fully takes shape
        const preBounceFraction = x / bounceDistance;
        z = (analysis.driftAmountCm / 100) * Math.pow(preBounceFraction, 2);
        
        // Ensure ball doesn't clip below ground early
        if (y < 0.1) y = 0.1;
      } else {
        // Post-bounce curve (bounces upward + spin break taking place)
        const postBounceFraction = (x - bounceDistance) / (20 - bounceDistance);
        
        // Height formula modeling elastic bounce
        const peakHeight = 1.6 - (params.ball_speed_kmh / 150) * 0.4 + (analysis.predictedBounceAngleDeg * 0.04);
        y = peakHeight * (1 - Math.pow(1 - postBounceFraction, 1.8));
        if (y < 0) y = 0;

        // Spin break deviation starts at bounce point and spreads
        z = (analysis.driftAmountCm / 100) + (analysis.spinDeviationCm / 100) * Math.pow(postBounceFraction, 1.2);
      }

      points.push({ x, y, z });
    }

    return points;
  }
};
