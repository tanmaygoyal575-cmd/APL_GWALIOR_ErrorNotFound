import { AICommentaryLine, PhysicsParameters } from "../types";
import { PitchAnalysisEngine } from "./PitchAnalysisEngine";
import { BallConditionEngine } from "./BallConditionEngine";
import { BatConditionEngine } from "./BatConditionEngine";
import { SwingPredictionEngine } from "./SwingPredictionEngine";

export const AICommentaryEngine = {
  generate: (params: PhysicsParameters): AICommentaryLine[] => {
    const pitch = PitchAnalysisEngine.analyze(params);
    const ball = BallConditionEngine.analyze(params);
    const bat = BatConditionEngine.analyze(params);
    const swing = SwingPredictionEngine.analyze(params);

    const speed = params.ball_speed_kmh;
    const isSpinner = params.spin_type !== "None" && params.spin_type !== "Swing-Only";
    const intent = params.batter_intent;

    const lines: AICommentaryLine[] = [];
    const now = new Date().toLocaleTimeString();

    // 1. Atmosphere/Swing analysis
    if (params.spin_type === "Swing-Only") {
      if (swing.swingIntensity > 6) {
        lines.push({
          text: `“Atmospheric humidity at ${params.air_humidity || 65}% is offering exceptional air grip. Watch how the ball shapes late across the right-hander.”`,
          type: "physical",
          timestamp: now
        });
      } else if (speed > 142 && ball.reverseSwingPotential > 60) {
        lines.push({
          text: `“Dynamic boundary-layer reversal! At ${speed} km/h with an aged ${params.ball_overs_used || 35}-over ball, we're seeing authentic reverse swing bending inwards extremely late.”`,
          type: "physical",
          timestamp: now
        });
      } else {
        lines.push({
          text: `“Conventional outswing shaping nicely from the hand. Bowler testing the corridor of uncertainty off the shinier side.”`,
          type: "tactical",
          timestamp: now
        });
      }
    }

    // 2. Pitch Assistance & Crumbling
    if (isSpinner) {
      if (pitch.spinAssistance > 70) {
        lines.push({
          text: `“A dusty, dry clay deck with ${params.pitch_cracks || 45}% fissure rating. The leg-spinner receives massive, aggressive purchase out of the cracks.”`,
          type: "physical",
          timestamp: now
        });
      } else if (params.pitch_type_modifier === "Concrete") {
        lines.push({
          text: `“Pristine concrete deck is proving to be a spinners' graveyard. No surface teeth for the revolutions to take grip.”`,
          type: "critical",
          timestamp: now
        });
      } else {
        lines.push({
          text: `“Lovely loop and release. The spinner is letting gravity and the ${swing.driftAmountCm > 0 ? 'drift' : 'dip'} do the work before the bounce.”`,
          type: "tactical",
          timestamp: now
        });
      }
    }

    // 3. Bat & Wood Performance
    if (bat.batHealthScore < 50) {
      lines.push({
        text: `“That bat has seen better days. Dry brittleness and micro-cracks will severely deplete the trampoline impulse of this English willow.”`,
        type: "critical",
        timestamp: now
      });
    } else if (params.bat_moisture_absorb && params.bat_moisture_absorb > 45) {
      lines.push({
        text: `“High wood moisture absorption has added dead-weight to the toe block, making the swing slightly slow through the zone.”`,
        type: "physical",
        timestamp: now
      });
    } else {
      lines.push({
        text: `“Pristine grade-one willow. When struck right out of that sweet spot node, the exit velocity multipliers are explosive.”`,
        type: "broadcast",
        timestamp: now
      });
    }

    // 4. Intent & Battle Analysis
    if (intent === "Ultra-Attacking") {
      lines.push({
        text: `“A highly combative stance! The batsman is clearing the front leg, accepting a massive ${bat.mistimeProbability}% mistime risk to target the roof.”`,
        type: "tactical",
        timestamp: now
      });
    } else if (intent === "Defensive") {
      lines.push({
        text: `“Absolute textbook batting discipline. Soft hands, playing right under the eyes, neutralizing the lateral seam movement.”`,
        type: "broadcast",
        timestamp: now
      });
    } else {
      lines.push({
        text: `“Balanced weight distribution as the batsman watches the release trajectory carefully.”`,
        type: "broadcast",
        timestamp: now
      });
    }

    // 5. Tactical Suggestion Commentary
    if (swing.spinDeviationCm > 12) {
      lines.push({
        text: `“Captain must pull in Silly Point. Looking at that incredible ${Math.abs(swing.spinDeviationCm)} cm spin deviation, a bat-pad catch is on the cards any moment.”`,
        type: "tactical",
        timestamp: now
      });
    } else if (speed > 146 && pitch.bounceConsistency > 75) {
      lines.push({
        text: `“Pure heat! At ${speed} km/h off a rigid deck, the batsman is purely playing on intuition. One mistake, and the stumps are flat.”`,
        type: "critical",
        timestamp: now
      });
    }

    // Fallback if empty
    if (lines.length === 0) {
      lines.push({
        text: `“The bowler enters the delivery stride... standard length targeted on a balanced wicket.”`,
        type: "broadcast",
        timestamp: now
      });
    }

    return lines;
  }
};
