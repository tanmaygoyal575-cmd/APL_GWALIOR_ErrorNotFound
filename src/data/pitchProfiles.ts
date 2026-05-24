export interface PitchProfile {
  id: string;
  name: string;
  frictionCoefficient: number; // effect on ball speed drop
  bounceFactor: number;        // coefficient of restitution / rebound height
  spinSupport: number;         // 1-100 turn rating
  seamSupport: number;         // 1-100 off-cut lateral movement
  swingSupport: number;        // 1-100 (influence of ground moisture on air swing)
  deteriorationRate: number;   // speed of crack breakdown per session
  battingDifficulty: number;   // 1-100
  description: string;
  tacticalAdvice: string;
}

export const PITCH_PROFILES: Record<string, PitchProfile> = {
  "Green/Grassy": {
    id: "green",
    name: "Green / Grassy Pitch",
    frictionCoefficient: 0.12,
    bounceFactor: 0.85,
    spinSupport: 15,
    seamSupport: 88,
    swingSupport: 82,
    deteriorationRate: 15,
    battingDifficulty: 65,
    description: "Abundant grass cover acts as a lubricant reducing initial wear, while keeping moisture trapped. Leads to massive lateral seam movement and early swing.",
    tacticalAdvice: "Focus on driving good-length balls in the corridor of uncertainty. Fast bowlers should bowl a full length to capture active swing."
  },
  "Dusty/Dry": {
    id: "dusty",
    name: "Dusty / Dry Pitch",
    frictionCoefficient: 0.22,
    bounceFactor: 0.60,
    spinSupport: 95,
    seamSupport: 20,
    swingSupport: 15,
    deteriorationRate: 85,
    battingDifficulty: 80,
    description: "Crumbly surface with high friction and loose particles. Completely strips ball speed on bounce while grabbing the leather casing, producing major spin deviation.",
    tacticalAdvice: "Avoid playing horizontal cross-bat strokes across the line. Spinners should target the cracks to induce abrupt and wild bite."
  },
  "Balanced": {
    id: "balanced",
    name: "Balanced / Traditional Deck",
    frictionCoefficient: 0.15,
    bounceFactor: 0.72,
    spinSupport: 45,
    seamSupport: 48,
    swingSupport: 40,
    deteriorationRate: 35,
    battingDifficulty: 40,
    description: "Standard subcontinent or English day 2 surface. Provides a fair contest with consistent bounce for batters and moderate tactical help for disciplined bowlers.",
    tacticalAdvice: "Standard batting stance is effective. Build partnerships and wait for loose deliveries before executing aggressive lofted drives."
  },
  "Concrete": {
    id: "concrete",
    name: "Concrete Pitch / Street Turf",
    frictionCoefficient: 0.05,
    bounceFactor: 0.98,
    spinSupport: 5,
    seamSupport: 5,
    swingSupport: 5,
    deteriorationRate: 0,
    battingDifficulty: 10,
    description: "Zero surface texture or soil elastic decay. Rebounds ball velocity with extreme momentum. No spin grip or swing seam deviation from the pitch whatsoever.",
    tacticalAdvice: "Perfect for aggressive batting. Fast hand-eye coordination is highly rewarded. Bowlers have to rely purely on variations in speed and aerial swing."
  },
  "Mud": {
    id: "mud",
    name: "Muddy / Wet Patch Pitch",
    frictionCoefficient: 0.35,
    bounceFactor: 0.25,
    spinSupport: 60,
    seamSupport: 40,
    swingSupport: 10,
    deteriorationRate: 90,
    battingDifficulty: 95,
    description: "Saturated soil surface. Absorbs kinetic energy, causing the ball to 'die' or slide at awkward low angles, making it a nightmare to time cleanly.",
    tacticalAdvice: "Keep hands extremely soft and watch the ball right onto the willow face. Play close to the body and avoid searching for distance."
  },
  "Flat": {
    id: "flat",
    name: "Flat / Batting Highway",
    frictionCoefficient: 0.08,
    bounceFactor: 0.78,
    spinSupport: 10,
    seamSupport: 12,
    swingSupport: 20,
    deteriorationRate: 10,
    battingDifficulty: 20,
    description: "Extremely hard rolled deck with zero cracks or green residue. Ball comes on beautifully to the blade, completely neutralizing bowler threateners.",
    tacticalAdvice: "Great surface for lofted drives, pulling, and playing square of the wicket. Pitch is highly protective for explosive batters."
  },
  "Dry": {
    id: "dry",
    name: "Dry Hard Deck",
    frictionCoefficient: 0.18,
    bounceFactor: 0.75,
    spinSupport: 55,
    seamSupport: 35,
    swingSupport: 25,
    deteriorationRate: 60,
    battingDifficulty: 45,
    description: "Sun-baked clay deck with minimal grass. Possesses excellent carry and moderate turn as the match matures, though initial overs favor solid defense.",
    tacticalAdvice: "Patience is key. Use your feet to work the spinners around the inner circle and drive hard along the turf plane."
  },
  "Damp": {
    id: "damp",
    name: "Damp Pitch",
    frictionCoefficient: 0.25,
    bounceFactor: 0.55,
    spinSupport: 40,
    seamSupport: 75,
    swingSupport: 70,
    deteriorationRate: 40,
    battingDifficulty: 70,
    description: "Slight oily moisture content on top of clay underlayer. The ball tends to stick or hold on the pitch surface, creating a dual-paced bounce.",
    tacticalAdvice: "Wait for the ball to complete its bounce. Playing early triggers easy return catches to the bowler. Bowl off-cutters to grip the damp topsoil."
  },
  "Cracked": {
    id: "cracked",
    name: "Cracked / Day 5 Minefield",
    frictionCoefficient: 0.20,
    bounceFactor: 0.65,
    spinSupport: 88,
    seamSupport: 85,
    swingSupport: 30,
    deteriorationRate: 100,
    battingDifficulty: 90,
    description: "Deep, widening fissure cracks dividing the surface blocks. Hitting a crack results in unpredictable, highly dangerous deviations or skyward bounce.",
    tacticalAdvice: "Extremely hostile conditions. Limit the sweep shot as ball behavior is too volatile. Tight defensive play with soft wrists is the safest route."
  },
  "Clay": {
    id: "clay",
    name: "Red Clay Deck",
    frictionCoefficient: 0.14,
    bounceFactor: 0.90,
    spinSupport: 70,
    seamSupport: 50,
    swingSupport: 30,
    deteriorationRate: 40,
    battingDifficulty: 50,
    description: "Durable red-soil based cricket wicket. Highly abrasive and generates high, steep bounce suited for cut shots and heavy top-spin deliveries.",
    tacticalAdvice: "Expect steep vertical bounce. Backfoot punching, cut shots, and pulling are highly productive. Focus on spinners' top-spin release."
  }
};
