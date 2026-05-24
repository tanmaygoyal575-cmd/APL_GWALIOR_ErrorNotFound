import { PITCH_PROFILES, PitchProfile } from "../data/pitchProfiles";

export interface PitchDegradationReport {
  currentFriction: number;
  currentBounce: number;
  currentSpinGrip: number;
  currentSeamDev: number;
  crackWidthMm: number;
  wearLabel: string;
  battingDifficultyPercent: number;
}

class PitchIntelligenceSystem {
  public getProfile(type: string): PitchProfile {
    // Soft map to matched profiles
    if (type.includes("Grassy") || type.includes("Green")) return PITCH_PROFILES["Green/Grassy"];
    if (type.includes("Dusty") || type.includes("Dry Dust")) return PITCH_PROFILES["Dusty/Dry"];
    if (type.includes("Concrete") || type.includes("Cement")) return PITCH_PROFILES["Concrete"];
    if (type.includes("Mud") || type.includes("Wet")) return PITCH_PROFILES["Mud"];
    if (type.includes("Flat")) return PITCH_PROFILES["Flat"];
    if (type.includes("Damp")) return PITCH_PROFILES["Damp"];
    if (type.includes("Cracked")) return PITCH_PROFILES["Cracked"];
    if (type.includes("Clay")) return PITCH_PROFILES["Clay"];
    return PITCH_PROFILES["Balanced"];
  }

  /**
   * Calculates the deterioration of the pitch based on the number of overs and weather dry factor.
   */
  public calculatePitchWear(type: string, oversUsed: number, dryRate: number): PitchDegradationReport {
    const p = this.getProfile(type);

    // Crack progression is accelerated by dry rates (high temperature, low humidity) and ball overs bowled
    const activeDeterioration = p.deteriorationRate * (oversUsed / 90) * dryRate;
    
    // Crack width in mm (up to 12mm)
    const crackWidthMm = parseFloat(Math.min(12.0, (activeDeterioration / 100) * 12.0).toFixed(1));

    // Calculate dynamic physical rates slipping from basic profile constants
    let currentFriction = p.frictionCoefficient;
    let currentBounce = p.bounceFactor;
    let currentSpinGrip = p.spinSupport;
    let currentSeamDev = p.seamSupport;

    if (activeDeterioration > 0) {
      if (p.id === "green") {
        // Green grass gets scuffed, reducing seam support but slightly raising spin grip
        currentSeamDev = Math.max(40, Math.round(p.seamSupport - activeDeterioration * 0.4));
        currentSpinGrip = Math.min(60, Math.round(p.spinSupport + activeDeterioration * 0.3));
      } else {
        // Cracks expand, causing variable erratic bounce and immense spin grip
        currentSpinGrip = Math.min(100, Math.round(p.spinSupport + activeDeterioration * 0.5));
        currentSeamDev = Math.min(100, Math.round(p.seamSupport + activeDeterioration * 0.4)); // hit crack edge for seam cuts
        currentBounce = parseFloat(Math.max(0.3, p.bounceFactor - (activeDeterioration / 200)).toFixed(2));
      }
    }

    let wearLabel = "Pristine Day 1 Deck";
    if (oversUsed > 75) wearLabel = "Severely Worn Day 5 Miner";
    else if (oversUsed > 45) wearLabel = "Dual-Paced Day 3-4 Deck";
    else if (oversUsed > 15) wearLabel = "Active Play Footprint Wear";

    let battingDifficultyPercent = Math.max(10, Math.min(100, Math.round(p.battingDifficulty + activeDeterioration * 0.25)));

    return {
      currentFriction,
      currentBounce,
      currentSpinGrip,
      currentSeamDev,
      crackWidthMm,
      wearLabel,
      battingDifficultyPercent
    };
  }
}

export const PitchService = new PitchIntelligenceSystem();
export default PitchService;
