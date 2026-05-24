import { 
  PhysicsParameters, 
  CricAIScenario, 
  PitchAnalysis, 
  BallCondition, 
  BatCondition, 
  SwingSpinAnalysis, 
  ShotProbabilities, 
  TacticalFieldAdvice, 
  MatchScenarioOutcome, 
  AICommentaryLine 
} from "../types";

import { PitchAnalysisEngine } from "./PitchAnalysisEngine";
import { BallConditionEngine } from "./BallConditionEngine";
import { BatConditionEngine } from "./BatConditionEngine";
import { SwingPredictionEngine, TrajectoryPoint } from "./SwingPredictionEngine";
import { SpinPhysicsEngine } from "./SpinPhysicsEngine";
import { TacticalFieldEngine } from "./TacticalFieldEngine";
import { MatchScenarioEngine } from "./MatchScenarioEngine";
import { AICommentaryEngine } from "./AICommentaryEngine";

export interface CompleteEnginePayload {
  pitch: PitchAnalysis;
  ball: BallCondition;
  bat: BatCondition;
  swing: SwingSpinAnalysis;
  spinPhysics: any;
  tactical: TacticalFieldAdvice;
  match: MatchScenarioOutcome;
  commentary: AICommentaryLine[];
  trajectory: TrajectoryPoint[];
  shotProbabilities: ShotProbabilities;
}

export const EngineOrchestrator = {
  processAll: (params: PhysicsParameters): CompleteEnginePayload => {
    // 1. Core analyses
    const pitchVal = PitchAnalysisEngine.analyze(params);
    const ballVal = BallConditionEngine.analyze(params);
    const batVal = BatConditionEngine.analyze(params);
    const swingVal = SwingPredictionEngine.analyze(params);
    const spinPhysVal = SpinPhysicsEngine.calculate(params);
    const tacticalVal = TacticalFieldEngine.recommend(params);
    const matchVal = MatchScenarioEngine.simulate(params);
    const commentaryVal = AICommentaryEngine.generate(params);

    // 2. Generate detailed 40-point coordinate flight curve
    const trajectoryVal = SwingPredictionEngine.calculateTrajectoryPoints(params, swingVal);

    // 3. Advanced Shot Outcome Prediction (detailed probability array + angle heatmap)
    // Uses pitch cracks, ball speeds, swing arcs, and batting intent
    const edgeProb = Math.min(95, Math.max(5, Math.round(
      (Math.abs(swingVal.spinDeviationCm) * 3 + Math.abs(swingVal.driftAmountCm) * 2 + (params.ball_speed_kmh > 140 ? 15 : 5)) * 
      (1 + batVal.mistimeProbability / 100)
    )));

    let defensiveProb = 40;
    if (params.batter_intent === "Defensive") defensiveProb = 85;
    else if (params.batter_intent === "Attacking") defensiveProb = 20;
    else if (params.batter_intent === "Ultra-Attacking") defensiveProb = 8;

    let sixProb = 0;
    if (params.batter_intent === "Ultra-Attacking") {
      sixProb = Math.max(5, Math.round(65 * (batVal.powerTransferEfficiency / 100) * (90 - edgeProb) / 80));
    } else if (params.batter_intent === "Attacking") {
      sixProb = Math.max(2, Math.round(35 * (batVal.powerTransferEfficiency / 100) * (90 - edgeProb) / 80));
    }
    if (params.pitch_type_modifier === "Concrete") sixProb += 15;
    if (params.pitch_type_modifier === "Mud") sixProb = Math.max(1, Math.round(sixProb * 0.15));

    const wicketProb = Math.round(
      Math.min(95, Math.max(5, (edgeProb * 0.5 + (100 - batVal.timingEfficiency) * 0.3 + (params.ball_speed_kmh > 145 ? 12 : 0)))
    ));

    const loftedProb = params.batter_intent === "Ultra-Attacking" ? 80 : params.batter_intent === "Attacking" ? 50 : 15;
    const sweepProb = params.spin_type !== "None" && params.spin_type !== "Swing-Only" ? (params.batter_intent === "Defensive" ? 15 : 45) : 3;
    const pullProb = params.ball_speed_kmh > 125 ? 35 : 10;
    const mistimeProb = batVal.mistimeProbability;

    // Shot frequencies in different angles: 0 to 360 degrees
    // We break into 8 zones:
    // Fine Leg (135°), Square Leg (90°), Mid-Wicket (45°), Long-On (0°/360°), Long-Off (315°), Cover (270°), Point (225°), Third Man (180°)
    const baseZones: Record<string, number> = {
      "Long-On (V-Zone)": 15,
      "Long-Off (V-Zone)": 15,
      "Cover Drive Zone": 18,
      "Off-Side Cut / Point": 12,
      "Third Man (Glide)": 8,
      "Fine Leg (Glance)": 10,
      "Square Leg Pull": 12,
      "Mid-Wicket Slag": 10
    };

    // Redistribution of zones based on delivery angle and batting intent
    const shotZoneFrequencies: Record<string, number> = {};
    Object.keys(baseZones).forEach(k => {
      let freq = baseZones[k];
      if (params.batter_intent === "Ultra-Attacking" && (k.includes("Mid-Wicket") || k.includes("Long-On"))) {
        freq += 15; // targeting leg side slogs
      }
      if (params.spin_type === "Leg-Spin" && k.includes("Cover")) {
        freq -= 8; // harder to drive off-spinner spinners away
      }
      if (params.ball_speed_kmh > 140 && k.includes("Third Man")) {
        freq += 12; // fast balls edge safely to third man
      }
      shotZoneFrequencies[k] = freq;
    });

    // Normalize probabilities to 100% total for visual comfort
    const sum = Object.values(shotZoneFrequencies).reduce((a, b) => a + b, 0);
    Object.keys(shotZoneFrequencies).forEach(k => {
      shotZoneFrequencies[k] = Math.round((shotZoneFrequencies[k] / sum) * 100);
    });

    const shotProbabilities: ShotProbabilities = {
      edgeProb,
      defensiveProb,
      loftedProb,
      mistimeProb,
      pullProb,
      sweepProb,
      sixProb,
      wicketProb,
      shotZoneFrequencies
    };

    return {
      pitch: pitchVal,
      ball: ballVal,
      bat: batVal,
      swing: swingVal,
      spinPhysics: spinPhysVal,
      tactical: tacticalVal,
      match: matchVal,
      commentary: commentaryVal,
      trajectory: trajectoryVal,
      shotProbabilities
    };
  }
};
