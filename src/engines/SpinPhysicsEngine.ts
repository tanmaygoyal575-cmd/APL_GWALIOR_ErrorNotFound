import { PhysicsParameters, SpinType } from "../types";

export interface SpinCalculation {
  effectiveTorqueNm: number;
  pitchContactGripCoefficient: number;
  dampingFactorPercentage: number;
  revolutionDecayRatio: number;
  driftLateralForceNewtons: number;
  flightDipForceNewtons: number;
  spinBreakAngleDegrees: number;
}

export const SpinPhysicsEngine = {
  calculate: (params: PhysicsParameters): SpinCalculation => {
    const rpm = params.spin_rate_rpm;
    const spinType = params.spin_type;
    const pitchType = params.pitch_type_modifier;
    const ballMoisture = params.ball_moisture_wet || 10;
    const ballHardness = params.ball_hardness_score || 90;

    // 1. Friction & Grip Factor
    // Wet ball reduces pitch friction coefficient. Dusty surface increases it.
    let baseGrip = 0.5; // average clay
    if (pitchType === "Dusty/Dry") baseGrip = 0.85;
    if (pitchType === "Mud") baseGrip = 0.70; // soggy holds the ball longer but squishes
    if (pitchType === "Green/Grassy") baseGrip = 0.40;
    if (pitchType === "Concrete") baseGrip = 0.15;

    // Moisture limits grip
    const moistureTerm = Math.max(0.2, 1 - (ballMoisture / 130));
    const pitchContactGripCoefficient = parseFloat((baseGrip * moistureTerm).toFixed(2));

    // 2. Damping factor on pitch-bounce
    // Soft ball absorbs spin energy. Concete does not dampen. Mud absorbs heavily.
    let dampingFactorPercentage = 15; // standard
    if (pitchType === "Mud") dampingFactorPercentage = 55;
    else if (pitchType === "Concrete") dampingFactorPercentage = 2;
    else if (ballHardness < 50) dampingFactorPercentage += (50 - ballHardness) * 0.4;
    dampingFactorPercentage = Math.round(dampingFactorPercentage);

    // 3. Torque (in Newton-meters) of the spin release
    const effectiveTorqueNm = parseFloat(((rpm / 2000) * 0.45 * (ballHardness / 100)).toFixed(3));

    // 4. Drift and Flight Forces
    // Magnus lift/drift estimation
    const ballRadius = 0.036; // meters
    const airDensity = 1.2; // kg/m3 (standard)
    const angularVelocityRadS = (rpm * 2 * Math.PI) / 60;
    const speedMs = params.ball_speed_kmh / 3.6;

    // Aerodynamic approximations
    let driftLateralForceNewtons = 0;
    let flightDipForceNewtons = 0;

    if (spinType === "Leg-Spin") {
      driftLateralForceNewtons = parseFloat((0.2 * airDensity * Math.pow(ballRadius, 3) * speedMs * angularVelocityRadS).toFixed(2));
    } else if (spinType === "Off-Spin") {
      driftLateralForceNewtons = -parseFloat((0.2 * airDensity * Math.pow(ballRadius, 3) * speedMs * angularVelocityRadS).toFixed(2));
    } else if (spinType === "Top-Spin") {
      flightDipForceNewtons = parseFloat((0.22 * airDensity * Math.pow(ballRadius, 3) * speedMs * angularVelocityRadS).toFixed(2));
    }

    // 5. Spin Break Angle (degrees of deviation upon surface release)
    let spinBreakAngleDegrees = 0;
    if (spinType === "Leg-Spin") {
      spinBreakAngleDegrees = (rpm / 2000) * 8.5 * pitchContactGripCoefficient;
    } else if (spinType === "Off-Spin") {
      spinBreakAngleDegrees = -(rpm / 2000) * 8.5 * pitchContactGripCoefficient;
    } else if (spinType === "Top-Spin") {
      spinBreakAngleDegrees = (rpm / 2000) * 2.0 * pitchContactGripCoefficient; // purely top vertical kick
    }

    // 6. Decay ratio during flight
    const revolutionDecayRatio = parseFloat((0.0055 * speedMs).toFixed(3));

    return {
      effectiveTorqueNm,
      pitchContactGripCoefficient,
      dampingFactorPercentage,
      revolutionDecayRatio,
      driftLateralForceNewtons,
      flightDipForceNewtons,
      spinBreakAngleDegrees: parseFloat(spinBreakAngleDegrees.toFixed(1))
    };
  }
};
