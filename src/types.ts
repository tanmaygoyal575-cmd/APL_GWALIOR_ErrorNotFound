export type SpinType = "Off-Spin" | "Leg-Spin" | "Top-Spin" | "Swing-Only" | "None";
export type PitchType = "Green/Grassy" | "Dusty/Dry" | "Balanced" | "Concrete" | "Mud";
export type BatterIntent = "Defensive" | "Balanced" | "Attacking" | "Ultra-Attacking";

export interface PhysicsParameters {
  ball_speed_kmh: number;
  spin_type: SpinType;
  spin_rate_rpm: number;
  pitch_type_modifier: PitchType;
  batter_intent: BatterIntent;
  // Extended inputs
  grass_level?: number;         // 0% to 100%
  pitch_moisture?: number;      // 0% to 100%
  pitch_cracks?: number;        // 0% to 100%
  pitch_dust?: number;          // 0% to 105%
  pitch_hardness?: number;      // 0% to 100%
  air_temperature?: number;     // 5 to 45 °C
  air_humidity?: number;        // 10% to 100%
  wind_speed_kmh?: number;      // 0 to 50 km/h
  wind_direction?: "North" | "South" | "East" | "West" | "None";
  
  // Ball state inputs
  ball_overs_used?: number;     // 0 to 90 overs
  ball_seam_wear?: number;      // 0% to 100%
  ball_shine_side_a?: number;   // 0% to 100%
  ball_roughness_side_b?: number; // 0% to 100%
  ball_moisture_wet?: number;   // 0% to 100%
  ball_hardness_score?: number; // 0% to 100%

  // Bat state inputs
  bat_wood_age_months?: number; // 0 to 48 months
  bat_sweet_spot?: number;      // 0% to 100% (health)
  bat_cracks?: number;          // 0% to 100%
  bat_edge_damage?: number;     // 0% to 100%
  bat_moisture_absorb?: number; // 0% to 100%
}

export interface CalculatedMetrics {
  total_deviation_cm: number;
  exit_velocity_kmh: number;
  wicket_probability_percentage: number;
}

export interface AICoachInsights {
  tactical_breakdown: string;
  fielding_adjustments: string[];
  counter_strategy: string;
}

export interface CricAIScenario {
  scenario_summary: string;
  physics_parameters: PhysicsParameters;
  calculated_metrics: CalculatedMetrics;
  ai_coach_insights: AICoachInsights;
}

export interface PresetScenario {
  id: string;
  title: string;
  description: string;
  query: string;
  iconType: "dhoni" | "kohli" | "warne" | "stokes" | "theoretical";
  parameters: PhysicsParameters;
}

// Prediction Module Output Interfaces for UI rendering

export interface PitchAnalysis {
  bounceConsistency: number; // 0 to 100
  spinAssistance: number;    // 0 to 100
  seamMovement: number;      // 0 to 100
  swingSupport: number;      // 0 to 100
  paceSupport: number;       // 0 to 100
  pitchDeterioration: number;// 0 to 100
  battingDifficulty: number; // 0 to 100
  tacticalText: string;
  dangerRating: "Safe" | "Standard" | "Risky" | "Hostile" | "Extreme";
}

export interface BallCondition {
  conventionalSwingPotential: number; // 0 to 100
  reverseSwingPotential: number;      // 0 to 100
  driftPotential: number;             // 0 to 100
  spinGripPotential: number;          // 0 to 100
  velocityLossPercent: number;        // 0 to 50
  bounceDecayPercent: number;          // 0 to 50
  ballStateLabel: "New Ball" | "Semi-New" | "Old Ball" | "Reverse Swing Phase" | "Wet Ball";
  degradabilitySpeed: string;         // e.g. "Slow", "Accelerated"
}

export interface BatCondition {
  powerTransferEfficiency: number;  // 0 to 100
  timingEfficiency: number;         // 0 to 100
  mistimeProbability: number;       // 0 to 100
  vibrationIntensity: number;       // 0 to 100
  shotQuality: number;              // 0 to 100
  sweetSpotEffectiveness: number;   // 0 to 100
  batHealthScore: number;           // 0 to 100
  performanceReductionText: string;
}

export interface SwingSpinAnalysis {
  swingDirection: "Inswing" | "Outswing" | "Wobble" | "None";
  swingIntensity: number;         // 0 to 10
  magnusForceDevCm: number;       // lateral drift prior to pitching
  spinDeviationCm: number;        // break dev after pitching
  driftAmountCm: number;
  dipEffectCm: number;
  deviationProbability: number;   // 0 to 100
  predictedBounceAngleDeg: number;  // degrees
}

export interface ShotProbabilities {
  edgeProb: number;
  defensiveProb: number;
  loftedProb: number;
  mistimeProb: number;
  pullProb: number;
  sweepProb: number;
  sixProb: number;
  wicketProb: number;
  shotZoneFrequencies: Record<string, number>; // angle mapping
}

export interface TacticalFieldAdvice {
  riskScore: number;        // 0 to 100
  threatAnalysis: string;
  tacticalReasoning: string;
  recommendedPositions: string[];
  setupTypeName: "Slip Cordon" | "Leg-side Trap" | "Deep Sweepers" | "Spin Containment" | "Death-Over Setup" | "Classic Balanced";
}

export interface MatchScenarioOutcome {
  chaseDifficulty: number;      // 1 to 10
  collapseProbability: number;  // 0 to 100
  aggressionModifier: number;   // multiplier
  defensiveTacticsRatio: number; // 0 to 100
  battingWinProbability: number;// 0 to 100
  momentumGaugeScore: number;   // -100 to +100
  recommendedTactics: string;
}

export interface AICommentaryLine {
  text: string;
  type: "tactical" | "broadcast" | "physical" | "critical";
  timestamp: string;
}
