import { BatCondition, PhysicsParameters } from "../types";

export const BatConditionEngine = {
  analyze: (params: PhysicsParameters): BatCondition => {
    // Inputs with baseline fallbacks
    const WoodAge = params.bat_wood_age_months !== undefined ? params.bat_wood_age_months : 8;
    const initialSweetSpot = params.bat_sweet_spot !== undefined ? params.bat_sweet_spot : 92;
    const cracks = params.bat_cracks !== undefined ? params.bat_cracks : 10;
    const edgeDamage = params.bat_edge_damage !== undefined ? params.bat_edge_damage : 15;
    const moisture = params.bat_moisture_absorb !== undefined ? params.bat_moisture_absorb : 5;

    // Bat health score
    // Cracks are highly detrimental, edge damage eats peripheral, moisture makes the willow soggy, too old of wood loses natural spring
    let ageDeduction = 0;
    if (WoodAge > 24) {
      ageDeduction = (WoodAge - 24) * 1.5;
    } else if (WoodAge < 3) {
      ageDeduction = (3 - WoodAge) * 3; // too green / unknocked wood
    }
    
    let batHealthScore = Math.round(
      initialSweetSpot - cracks * 0.4 - edgeDamage * 0.25 - moisture * 0.2 - ageDeduction
    );
    batHealthScore = Math.max(10, Math.min(100, batHealthScore));

    // 1. Sweet spot effectiveness: decreases directly with cracks and humidity/moisture absorption
    let sweetSpotEffectiveness = Math.round(batHealthScore * 1.0);
    if (moisture > 30) {
      sweetSpotEffectiveness = Math.round(sweetSpotEffectiveness * (1 - (moisture / 250))); // soggy grains don't snap back
    }

    // 2. Power Transfer Efficiency:
    // How energy transfers from wood fibers to ball bounce. 
    // Moist bat or cracked bat dampens vibration coefficients
    let powerTransferEfficiency = Math.round(
      (batHealthScore * 0.6 + (100 - moisture) * 0.2 + (WoodAge >= 3 && WoodAge <= 18 ? 20 : 0))
    );
    powerTransferEfficiency = Math.max(25, Math.min(100, powerTransferEfficiency));

    // 3. Timing Efficiency:
    // If bat is heavy (high moisture) or vibrates, timing suffers.
    let timingEfficiency = Math.round(
      90 - (moisture * 0.25) - (cracks * 0.15) - (edgeDamage * 0.2)
    );
    if (params.batter_intent === "Ultra-Attacking") {
      timingEfficiency = Math.max(20, timingEfficiency - 8); // swinging harder makes timing windows tighter
    }
    timingEfficiency = Math.max(30, Math.min(98, timingEfficiency));

    // 4. Mistime Probability:
    // Edge cracks increase chance of a thick edge carrying poorly
    let mistimeProbability = Math.round(
      (cracks * 0.3 + edgeDamage * 0.4 + moisture * 0.1) + (100 - timingEfficiency) * 0.5
    );
    if (params.ball_speed_kmh > 140) {
      mistimeProbability = Math.min(95, mistimeProbability + 15); // faster speeds demand pristine middle contact
    }
    mistimeProbability = Math.max(5, Math.min(95, mistimeProbability));

    // 5. Vibration Intensity:
    // Sensation in hands. Old cracked bats vibrate intensely on off-center hits.
    let vibrationIntensity = Math.round(
      (cracks * 0.5 + (100 - sweetSpotEffectiveness) * 0.3 + moisture * 0.2)
    );
    vibrationIntensity = Math.max(0, Math.min(100, vibrationIntensity));

    // 6. Overall Shot Quality:
    // Synthesizes timing, power, and wood responsiveness
    let shotQuality = Math.round(
      (powerTransferEfficiency * 0.4 + timingEfficiency * 0.5 + (100 - vibrationIntensity) * 0.1)
    );
    shotQuality = Math.max(10, Math.min(100, shotQuality));

    // Dynamic descriptive indicators of damage impact
    let performanceReductionText = "";
    if (batHealthScore < 45) {
      performanceReductionText = "Severe Grain Delamination: Significant wood recoil losses. High probability of splintering or edge catches.";
    } else if (moisture > 45) {
      performanceReductionText = "Soggy Willow: Swollen density. Added weight slows down swing arc speed. Dampened ping response.";
    } else if (cracks > 35) {
      performanceReductionText = "Stress Fractures: Micro-cracks leaking impact dissipation. Stinging feedback in batter hands on off-middle contact.";
    } else if (WoodAge > 24) {
      performanceReductionText = "Dry Brittle Fibers: Natural sap completely evaporated. Decayed flexibility reduces trampoline response.";
    } else {
      performanceReductionText = "Pristine Grade 1 English Willow: Elastic grain response and solid core energy return.";
    }

    return {
      powerTransferEfficiency,
      timingEfficiency,
      mistimeProbability,
      vibrationIntensity,
      shotQuality,
      sweetSpotEffectiveness,
      batHealthScore,
      performanceReductionText
    };
  }
};
