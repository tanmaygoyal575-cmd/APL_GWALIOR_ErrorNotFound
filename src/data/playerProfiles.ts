export interface PlayerProfile {
  id: string;
  name: string;
  role: "Batsman" | "Bowler" | "All-Rounder" | "Wicket-Keeper Batsman";
  battingStyle: "Right-Hand Bat" | "Left-Hand Bat";
  bowlingStyle: "Right-Arm Fast" | "Right-Arm Leg-Spin" | "Right-Arm Off-Break" | "Left-Arm Fast-Medium" | "Left-Arm Orthodox Spin" | "None";
  stats: {
    battingAverage: number;
    strikeRate: number;
    bowlingEconomy?: number;
    bowlingAverage?: number;
    rpmEstimate?: number;         // For spinners or swing release
    swingEfficiency?: number;      // 0-100 rating
    boundaryPercentage?: number;   // e.g. 18.5%
    dotBallPressure?: number;      // e.g. 52.0%
  };
  attributes: {
    formScore: number;             // 1-100 recent form rating
    threatRating: number;          // 1-100 overall impact factor
    pressureHandling: number;      // 1-100 clutch score
    powerplayEfficacy: number;     // 1-100
    spinEffectiveness: number;     // 1-100
  };
  strengths: string[];
  weaknesses: string[];
  tacticalInsights: string;
}

export const PLAYER_PROFILES: Record<string, PlayerProfile> = {
  "ms-dhoni": {
    id: "ms-dhoni",
    name: "MS Dhoni",
    role: "Wicket-Keeper Batsman",
    battingStyle: "Right-Hand Bat",
    bowlingStyle: "None",
    stats: {
      battingAverage: 50.57,
      strikeRate: 87.56,
      boundaryPercentage: 11.2,
      dotBallPressure: 45.3
    },
    attributes: {
      formScore: 92,
      threatRating: 95,
      pressureHandling: 99,
      powerplayEfficacy: 72,
      spinEffectiveness: 88
    },
    strengths: ["Unmatchable finishing under pressure", "Excellent helicopter sweep shot", "Exceptional runner between wickets"],
    weaknesses: ["Slow initial crawl against spinners", "Vulnerable to short sharp rib-cage bouncers"],
    tacticalInsights: "Dhoni absorbs dot ball pressure in clutch run-chases, waiting to attack in death overs. Bowl yorkers wide of off-stump with a deep backward point to restrict."
  },
  "virat-kohli": {
    id: "virat-kohli",
    name: "Virat Kohli",
    role: "Batsman",
    battingStyle: "Right-Hand Bat",
    bowlingStyle: "None",
    stats: {
      battingAverage: 57.38,
      strikeRate: 93.17,
      boundaryPercentage: 14.8,
      dotBallPressure: 38.2
    },
    attributes: {
      formScore: 98,
      threatRating: 99,
      pressureHandling: 98,
      powerplayEfficacy: 90,
      spinEffectiveness: 92
    },
    strengths: ["Elite cover drives along the grass", "Paces run chases logically", "High physical stamina"],
    weaknesses: ["Out-swinging deliveries on the 5th stump line early in his innings"],
    tacticalInsights: "Kohli is highly lethal when driving through the covers. Set up a tight 3-slip cordon on green decks and bowl full out-swing in the first 10 balls."
  },
  "ben-stokes": {
    id: "ben-stokes",
    name: "Ben Stokes",
    role: "All-Rounder",
    battingStyle: "Left-Hand Bat",
    bowlingStyle: "Right-Arm Fast",
    stats: {
      battingAverage: 40.84,
      strikeRate: 95.12,
      bowlingEconomy: 5.42,
      bowlingAverage: 31.25,
      swingEfficiency: 78,
      boundaryPercentage: 13.5,
      dotBallPressure: 47.1
    },
    attributes: {
      formScore: 89,
      threatRating: 92,
      pressureHandling: 97,
      powerplayEfficacy: 82,
      spinEffectiveness: 80
    },
    strengths: ["Explosive lofted hitting array", "Brave match-winning mentality", "Heavy bounce fast deliveries"],
    weaknesses: ["Prone to mistiming off-spinners drifting away", "Struggles with dynamic lateral wobble seams"],
    tacticalInsights: "Stokes is extremely dangerous once set. Attack him with spinners dragging the ball wide of his reach or trap him with bouncers right on print line."
  },
  "shane-warne": {
    id: "shane-warne",
    name: "Shane Warne",
    role: "Bowler",
    battingStyle: "Right-Hand Bat",
    bowlingStyle: "Right-Arm Leg-Spin",
    stats: {
      battingAverage: 17.32,
      strikeRate: 64.21,
      bowlingEconomy: 2.73,
      bowlingAverage: 25.41,
      rpmEstimate: 2450,
      boundaryPercentage: 5.8
    },
    attributes: {
      formScore: 96,
      threatRating: 98,
      pressureHandling: 95,
      powerplayEfficacy: 65,
      spinEffectiveness: 99
    },
    strengths: ["Elite drift and sharp leg-break rip", "Psychological dominance over batsmen", "Flawless accuracy on rough surfaces"],
    weaknesses: ["Batters sweeping aggressively can offset his rhythm"],
    tacticalInsights: "Warne utilizes massive drift (Magnus effect) followed by sharp leg-break turn. Deploy short leg, slip, and silly point catchers to collect glove edges."
  },
  "jasprit-bumrah": {
    id: "jasprit-bumrah",
    name: "Jasprit Bumrah",
    role: "Bowler",
    battingStyle: "Right-Hand Bat",
    bowlingStyle: "Right-Arm Fast",
    stats: {
      battingAverage: 7.50,
      strikeRate: 55.00,
      bowlingEconomy: 4.59,
      bowlingAverage: 23.55,
      swingEfficiency: 85,
      boundaryPercentage: 2.1
    },
    attributes: {
      formScore: 99,
      threatRating: 99,
      pressureHandling: 99,
      powerplayEfficacy: 97,
      spinEffectiveness: 40
    },
    strengths: ["Hypersonic late outswing", "Deadly unplayable yorkers", "Unorthodox release angle"],
    weaknesses: ["None observable in current formats"],
    tacticalInsights: "Bumrah excels at changing pace and seam presentation. Use a balanced or defensive mindset to survive his opening burst before taking scoring risks."
  },
  "rashid-khan": {
    id: "rashid-khan",
    name: "Rashid Khan",
    role: "Bowler",
    battingStyle: "Right-Hand Bat",
    bowlingStyle: "Right-Arm Leg-Spin",
    stats: {
      battingAverage: 19.88,
      strikeRate: 142.15,
      bowlingEconomy: 6.35,
      bowlingAverage: 21.12,
      rpmEstimate: 2300,
      boundaryPercentage: 15.2
    },
    attributes: {
      formScore: 94,
      threatRating: 91,
      pressureHandling: 90,
      powerplayEfficacy: 85,
      spinEffectiveness: 95
    },
    strengths: ["Rapid arm speed and quick off-the-pitch slide", "Deceptive quick googly", "Explosive lower-order batting"],
    weaknesses: ["Bowls extremely flat, less effective on damp grass decks"],
    tacticalInsights: "Rashid relies on a dynamic high-speed release making his googly hard to detect. Watch the hand release closely and play him off the back foot."
  },
  "pat-cummins": {
    id: "pat-cummins",
    name: "Pat Cummins",
    role: "All-Rounder",
    battingStyle: "Right-Hand Bat",
    bowlingStyle: "Right-Arm Fast",
    stats: {
      battingAverage: 18.25,
      strikeRate: 85.32,
      bowlingEconomy: 4.88,
      bowlingAverage: 26.15,
      swingEfficiency: 79,
      boundaryPercentage: 8.5
    },
    attributes: {
      formScore: 95,
      threatRating: 96,
      pressureHandling: 98,
      powerplayEfficacy: 92,
      spinEffectiveness: 55
    },
    strengths: ["Highly disciplined stump-to-stump line", "Steep bouncers from heavy lengths", "Clutch leader under pressure"],
    weaknesses: ["Yields boundaries to cross-bat pullers if pitching flat back of a length"],
    tacticalInsights: "Cummins maintains relentless pressure on off-stump. Keep the batting mindset balanced, scoring with soft hands on his occasional wide-lines."
  }
};
