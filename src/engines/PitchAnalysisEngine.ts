import { PitchType, PitchAnalysis, PhysicsParameters } from "../types";

export const PitchAnalysisEngine = {
  analyze: (params: PhysicsParameters): PitchAnalysis => {
    // Fallback defaults for optional extended parameters
    const grass = params.grass_level !== undefined ? params.grass_level : 
                 params.pitch_type_modifier === "Green/Grassy" ? 85 : 
                 params.pitch_type_modifier === "Mud" ? 40 : 15;
                 
    const moisture = params.pitch_moisture !== undefined ? params.pitch_moisture :
                     params.pitch_type_modifier === "Mud" ? 95 :
                     params.pitch_type_modifier === "Green/Grassy" ? 45 :
                     params.pitch_type_modifier === "Dusty/Dry" ? 10 : 25;

    const cracks = params.pitch_cracks !== undefined ? params.pitch_cracks :
                   params.pitch_type_modifier === "Dusty/Dry" ? 75 :
                   params.pitch_type_modifier === "Concrete" ? 0 : 20;

    const dust = params.pitch_dust !== undefined ? params.pitch_dust :
                 params.pitch_type_modifier === "Dusty/Dry" ? 90 :
                 params.pitch_type_modifier === "Mud" ? 30 : 10;

    const hardness = params.pitch_hardness !== undefined ? params.pitch_hardness :
                     params.pitch_type_modifier === "Concrete" ? 100 :
                     params.pitch_type_modifier === "Mud" ? 15 :
                     params.pitch_type_modifier === "Green/Grassy" ? 60 : 70;

    const temp = params.air_temperature !== undefined ? params.air_temperature : 30;
    const humidity = params.air_humidity !== undefined ? params.air_humidity : 60;

    // Calc Engine
    // 1. Bounce Consistency: high cracks or mud decreases it. Hardness increases it.
    let bounceConsistency = Math.round(hardness * 0.8 + (100 - cracks) * 0.2);
    if (params.pitch_type_modifier === "Mud") {
      bounceConsistency = Math.round(bounceConsistency * 0.4); // extremely soggy and dead
    }

    // 2. Spin Assistance: Dusty, high cracks, low moisture, dry wood/clay increases spin grip
    let spinAssistance = Math.round((dust * 0.5 + cracks * 0.3 + (100 - moisture) * 0.2));
    if (params.pitch_type_modifier === "Concrete") {
      spinAssistance = 5; // virtually zero spin grip on raw concrete
    }

    // 3. Seam Movement: Grass level, moisture levels, clay quality
    let seamMovement = Math.round((grass * 0.7 + moisture * 0.3));
    if (params.pitch_type_modifier === "Concrete") {
      seamMovement = 2; // zero grass / seam play on concrete road
    }

    // 4. Swing Support: Humidity level, cooler temp, wind effects
    let swingSupport = Math.round(humidity * 0.6 + (45 - temp) * 1.5);
    swingSupport = Math.max(10, Math.min(100, swingSupport));

    // 5. Pace Support: Hardness and low moisture
    let paceSupport = Math.round(hardness * 0.9 - moisture * 0.2);
    paceSupport = Math.max(10, Math.min(100, paceSupport));

    // 6. Deterioration: Temp, dry, cracks, dust, overs
    let pitchDeterioration = Math.round((temp * 1.2 + cracks * 0.4 + dust * 0.3));
    pitchDeterioration = Math.max(5, Math.min(100, pitchDeterioration));

    // 7. Batting Difficulty: Unpredictable bounce, large spin, large seam
    const unpredictableFactor = 100 - bounceConsistency;
    let battingDifficulty = Math.round(
      (unpredictableFactor * 0.4 + spinAssistance * 0.3 + seamMovement * 0.3)
    );
    
    // Stance aggresion also increases perceived difficulty
    if (params.batter_intent === "Ultra-Attacking") {
      battingDifficulty = Math.min(100, battingDifficulty + 12);
    } else if (params.batter_intent === "Defensive") {
      battingDifficulty = Math.max(10, battingDifficulty - 10);
    }

    // Danger Rating calculation
    let dangerRating: "Safe" | "Standard" | "Risky" | "Hostile" | "Extreme" = "Standard";
    if (battingDifficulty < 30) {
      dangerRating = "Safe";
    } else if (battingDifficulty < 55) {
      dangerRating = "Standard";
    } else if (battingDifficulty < 72) {
      dangerRating = "Risky";
    } else if (battingDifficulty < 88) {
      dangerRating = "Hostile";
    } else {
      dangerRating = "Extreme";
    }

    // Custom tactical description based on characteristics
    let tacticalText = "";
    if (params.pitch_type_modifier === "Concrete") {
      tacticalText = "Unforgiving concrete deck. Absolute pace and flat bounce with near-zero lateral movement.";
    } else if (params.pitch_type_modifier === "Mud") {
      tacticalText = "Soggy muddy turf. Ball grips and decelerates dramatically on the soft surface. High batting frustration.";
    } else if (spinAssistance > 70) {
      tacticalText = `Crumbling surface with ${cracks}% structural cracks. Extremely dusty wicket offering massive grip & over-spin to tweakers.`;
    } else if (seamMovement > 70) {
      tacticalText = `Rich damp grassy deck at ${grass}% coverage. Exceptional lateral seam movement and healthy carry for raw speed bowlers.`;
    } else if (bounceConsistency > 80 && battingDifficulty < 45) {
      tacticalText = "Pure batting paradise. Trustworthy true bounce, negligible friction loss, and minimal sideways deviation.";
    } else {
      tacticalText = "Classic balanced clay wicket. Standard bounce with linear deterioration expected as wear progresses.";
    }

    return {
      bounceConsistency,
      spinAssistance,
      seamMovement,
      swingSupport,
      paceSupport,
      pitchDeterioration,
      battingDifficulty,
      tacticalText,
      dangerRating
    };
  }
};
