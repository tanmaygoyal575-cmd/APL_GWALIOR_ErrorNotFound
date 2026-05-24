import { MatchScenarioOutcome, PhysicsParameters } from "../types";

export const MatchScenarioEngine = {
  simulate: (params: PhysicsParameters): MatchScenarioOutcome => {
    const speed = params.ball_speed_kmh;
    const isSpinner = params.spin_type !== "None" && params.spin_type !== "Swing-Only";
    const rpm = params.spin_rate_rpm;
    const pitch = params.pitch_type_modifier;
    const intent = params.batter_intent;

    // Optional variables (Baseline scenario defaults)
    const oversUsed = params.ball_overs_used || 15;
    const seamWear = params.ball_seam_wear || 10;
    const batHealth = params.ball_hardness_score || 95; // stand-in for general quality

    // 1. Chase Difficulty: 1 to 10 scale
    // High speeds, heavy spinning, deteriorated pitches increase chase difficulty
    let chaseDifficulty = 5.0; // neutral
    if (speed > 142) chaseDifficulty += 1.5;
    if (isSpinner && rpm > 1800 && pitch === "Dusty/Dry") chaseDifficulty += 2.0;
    if (pitch === "Green/Grassy" && speed > 130) chaseDifficulty += 1.0;
    if (pitch === "Mud") chaseDifficulty += 2.5; // muddy pitches are absolute chores to chase on
    if (pitch === "Concrete") chaseDifficulty -= 1.0; // easy boundaries
    
    chaseDifficulty = Math.max(1, Math.min(10, parseFloat(chaseDifficulty.toFixed(1))));

    // 2. Collapse Probability: 0% to 100%
    // High collapse chances develop if pitch is risky/deteriorated, batsman intent is Ultra-Attacking, and speed/spin is hostile.
    let collapseProbability = 20; // baseline
    if (pitch === "Dusty/Dry" || pitch === "Green/Grassy") collapseProbability += 15;
    if (pitch === "Mud") collapseProbability += 25; // ball stops, causing leading edges
    if (intent === "Ultra-Attacking") {
      collapseProbability += 25; // playing high-risk strokes
    } else if (intent === "Defensive") {
      collapseProbability -= 10; // low wickets, high defense
    }

    if (speed > 145) collapseProbability += 10;
    if (isSpinner && rpm > 2000) collapseProbability += 12;

    collapseProbability = Math.max(5, Math.min(95, collapseProbability));

    // 3. Batting Win Probability
    // Starts at 50%, adjusts based on difficulty, intent efficacy, and pitch modifiers
    let battingWinProbability = 50;
    battingWinProbability -= (chaseDifficulty * 4.5); // harder chases reduce win percent
    
    if (intent === "Attacking") battingWinProbability += 5;
    if (intent === "Ultra-Attacking") battingWinProbability -= 5; // too high risk, yields higher variance/wickets
    if (pitch === "Concrete") battingWinProbability += 15; // batters dominate on concrete

    // balance boundary
    battingWinProbability = Math.max(10, Math.min(90, Math.round(battingWinProbability)));

    // 4. Momentum Score: -100 to +100
    // Positive favors batting, negative favors bowling
    let momentumGaugeScore = 0;
    if (intent === "Ultra-Attacking" && pitch === "Concrete") {
      momentumGaugeScore = 75; // batter crushing bowler over park
    } else if (intent === "Defensive" && pitch === "Dusty/Dry") {
      momentumGaugeScore = -35; // spinner stifling batter
    } else if (speed > 145 && pitch === "Green/Grassy") {
      momentumGaugeScore = -60; // fast bowler terrifying batsman
    } else {
      // mix of factors
      const batterFactor = intent === "Ultra-Attacking" ? 30 : intent === "Attacking" ? 15 : intent === "Defensive" ? -20 : 0;
      const speedTerm = speed > 135 ? -25 : -5;
      const pitchTerm = (pitch === "Dusty/Dry" || pitch === "Green/Grassy") ? -20 : 10;
      momentumGaugeScore = batterFactor + speedTerm + pitchTerm;
    }
    
    momentumGaugeScore = Math.max(-100, Math.min(100, momentumGaugeScore));

    // 5. Tactical Recommendations
    let recommendedTactics = "";
    if (momentumGaugeScore < -40) {
      recommendedTactics = "Bowling Supremacy: Batsman on deep defensive. Recommend testing the batsman with a rapid bumper or yorker to break their trigger movement.";
    } else if (momentumGaugeScore > 40) {
      recommendedTactics = "Batting Ascendancy: Bowler is bleeding runs. Recommend introducing a defensive wide line or slow off-cutters to break scoring rhythm.";
    } else {
      const isAttacking = intent === "Attacking" || intent === "Ultra-Attacking";
      recommendedTactics = isAttacking 
        ? "Controlled Aggression: Bowler should bowl tight 5th-stump lines just short of driving length, forcing the batsman to hit across the line."
        : "Steady Consolidation: Batter is building partnership. Rotate strike diligently using low-risk sweeps and soft-hands cover taps.";
    }

    const defensiveTacticsRatio = Math.round(Math.max(10, Math.min(90, 100 - battingWinProbability)));
    const aggressionModifier = intent === "Ultra-Attacking" ? 1.5 : intent === "Attacking" ? 1.25 : intent === "Defensive" ? 0.6 : 1.0;

    return {
      chaseDifficulty,
      collapseProbability,
      aggressionModifier,
      defensiveTacticsRatio,
      battingWinProbability,
      momentumGaugeScore,
      recommendedTactics
    };
  }
};
