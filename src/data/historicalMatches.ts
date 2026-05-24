import { PhysicsParameters } from "../types";

export interface HistoricalMoment {
  id: string;
  title: string;
  eventDate: string;
  venue: string;
  context: string;
  batterName: string;
  bowlerName: string;
  scores: {
    runsRequired: number;
    ballsRemaining: number;
    wicketsLeft: number;
    battingTeam: string;
    bowlingTeam: string;
    currentScore: string;
  };
  parameters: PhysicsParameters;
  fieldingPositions: string[];
  trajectoryHighlight: string;
  aiTacticalCommentary: string[];
}

export const HISTORICAL_MOMENTS: Record<string, HistoricalMoment> = {
  "dhoni-2011": {
    id: "dhoni-2011",
    title: "The Helicopter Finish (2011)",
    eventDate: "April 2, 2011",
    venue: "Wankhede Stadium, Mumbai",
    context: "World Cup Final. India needs 4 runs from 11 balls. Nuwan Kulasekara bowls a full delivery, and MS Dhoni finishes off in style with an iconic helicopter shot.",
    batterName: "MS Dhoni",
    bowlerName: "Nuwan Kulasekara",
    scores: {
      runsRequired: 4,
      ballsRemaining: 11,
      wicketsLeft: 4,
      battingTeam: "India",
      bowlingTeam: "Sri Lanka",
      currentScore: "271/4"
    },
    parameters: {
      ball_speed_kmh: 132,
      spin_type: "None",
      spin_rate_rpm: 0,
      pitch_type_modifier: "Balanced",
      batter_intent: "Ultra-Attacking",
      grass_level: 10,
      pitch_moisture: 12,
      pitch_cracks: 15,
      pitch_dust: 15,
      pitch_hardness: 82,
      air_temperature: 28,
      air_humidity: 65,
      wind_speed_kmh: 8,
      wind_direction: "South",
      ball_overs_used: 48,
      ball_seam_wear: 70,
      ball_shine_side_a: 15,
      ball_roughness_side_b: 65,
      ball_moisture_wet: 35,
      ball_hardness_score: 55,
      bat_wood_age_months: 6,
      bat_sweet_spot: 98,
      bat_cracks: 10,
      bat_edge_damage: 5,
      bat_moisture_absorb: 12
    },
    fieldingPositions: [
      "Mid-On (Deep)", "Deep Mid-Wicket", "Long-On", "Long-Off", "Extra Cover", "Mid-Off", "Square Leg (Deep)", "Point", "Keeper"
    ],
    trajectoryHighlight: "High-flying parabolic arc sailing over long-on fence at 104 meters distance.",
    aiTacticalCommentary: [
      "Kulasekara attempts a block-hole yorker, but misses the length slightly, turning it into a full-toss.",
      "MS Dhoni unleashes the explosive heavy-willow Helicopter Shot, generating massive elastic wrist-snap.",
      "The exit velocity explodes off the bat sweet spot at 142.5 km/h, flying straight into the Wankhede crowd."
    ]
  },
  "kohli-2022": {
    id: "kohli-2022",
    title: "The Shot of the Century (MCG 2022)",
    eventDate: "October 23, 2022",
    venue: "Melbourne Cricket Ground",
    context: "T20 World Cup, IND vs PAK. India needs 28 from 8 balls. Haris Rauf bowls a rapid 144kph back-of-a-length delivery, Kohli punches it straight back over the bowler's head for a mind-boggling six.",
    batterName: "Virat Kohli",
    bowlerName: "Haris Rauf",
    scores: {
      runsRequired: 28,
      ballsRemaining: 8,
      wicketsLeft: 6,
      battingTeam: "India",
      bowlingTeam: "Pakistan",
      currentScore: "132/4"
    },
    parameters: {
      ball_speed_kmh: 144,
      spin_type: "None",
      spin_rate_rpm: 0,
      pitch_type_modifier: "Balanced",
      batter_intent: "Ultra-Attacking",
      grass_level: 20,
      pitch_moisture: 18,
      pitch_cracks: 10,
      pitch_dust: 5,
      pitch_hardness: 88,
      air_temperature: 16,
      air_humidity: 50,
      wind_speed_kmh: 15,
      wind_direction: "West",
      ball_overs_used: 19,
      ball_seam_wear: 35,
      ball_shine_side_a: 50,
      ball_roughness_side_b: 30,
      ball_moisture_wet: 10,
      ball_hardness_score: 80,
      bat_wood_age_months: 3,
      bat_sweet_spot: 99,
      bat_cracks: 1,
      bat_edge_damage: 2,
      bat_moisture_absorb: 2
    },
    fieldingPositions: [
      "Deep Mid-Wicket", "Long-On (Deep)", "Long-Off (Deep)", "Deep Square Leg", "Third Man", "Extra Cover (Inner Circle)", "Mid-Wicket (Inner Circle)", "Keeper", "Slip"
    ],
    trajectoryHighlight: "Elegant standing backfoot punch rising over dead center long-on boundary.",
    aiTacticalCommentary: [
      "Rauf bowls a lethal fast bouncer hitting the hard Melbourne turf with steep bounce.",
      "Kohli shifts load with impeccable back-foot balance, presenting a full upright blade directly into the flight path.",
      "A complete defiance of physics! Kohli punches a 144 km/h ball cleanly over long-on, sending the MCG into absolute delirium."
    ]
  },
  "warne-1993": {
    id: "warne-1993",
    title: "Ball of the Century (1993)",
    eventDate: "June 4, 1993",
    venue: "Old Trafford, Manchester",
    context: "Ashes Series. Shane Warne bowls his first-ever ball in Ashes history. It pitches outside leg-stump and rips back incredibly to clip Mike Gatting's off-stump.",
    batterName: "Mike Gatting",
    bowlerName: "Shane Warne",
    scores: {
      runsRequired: 220,
      ballsRemaining: 360,
      wicketsLeft: 10,
      battingTeam: "England",
      bowlingTeam: "Australia",
      currentScore: "80/1"
    },
    parameters: {
      ball_speed_kmh: 84,
      spin_type: "Leg-Spin",
      spin_rate_rpm: 2450,
      pitch_type_modifier: "Dusty/Dry",
      batter_intent: "Defensive",
      grass_level: 5,
      pitch_moisture: 35,
      pitch_cracks: 30,
      pitch_dust: 85,
      pitch_hardness: 60,
      air_temperature: 18,
      air_humidity: 78,
      wind_speed_kmh: 12,
      wind_direction: "North",
      ball_overs_used: 1,
      ball_seam_wear: 5,
      ball_shine_side_a: 95,
      ball_roughness_side_b: 5,
      ball_moisture_wet: 10,
      ball_hardness_score: 95,
      bat_wood_age_months: 18,
      bat_sweet_spot: 85,
      bat_cracks: 15,
      bat_edge_damage: 10,
      bat_moisture_absorb: 15
    },
    fieldingPositions: [
      "First Slip", "Silly Point", "Short Leg", "Leg Slip", "Wicket Keeper", "Mid-On (Inner)", "Cover Point", "Mid-Off", "Square Leg"
    ],
    trajectoryHighlight: "Intense loop drifting wide down leg-side before snapping back 18.4 centimeters to dismantle off-stump.",
    aiTacticalCommentary: [
      "Warne imparts an outstanding 2450 RPM of pure wrist spin, creating atmospheric Magnus drift down leg.",
      "The dry Lancashire soil grabs the seam, shifting the rebound vector by an unprecedented 18.5 cm.",
      "Gatting is left frozen in complete shock as the ball curves behind his pad, dislodging the off-bail."
    ]
  },
  "stokes-2019": {
    id: "stokes-2019",
    title: "Headingley Miracle (2019)",
    eventDate: "August 25, 2019",
    venue: "Headingley Cricket Ground, Leeds",
    context: "Third Ashes Test. England is 9 wickets down. Ben Stokes plays some of the most outrageous strokes in cricket history to secure an impossible 359-run chase.",
    batterName: "Ben Stokes",
    bowlerName: "Nathan Lyon",
    scores: {
      runsRequired: 2,
      ballsRemaining: 40,
      wicketsLeft: 1,
      battingTeam: "England",
      bowlingTeam: "Australia",
      currentScore: "357/9"
    },
    parameters: {
      ball_speed_kmh: 135,
      spin_type: "None",
      spin_rate_rpm: 0,
      pitch_type_modifier: "Dusty/Dry",
      batter_intent: "Ultra-Attacking",
      grass_level: 8,
      pitch_moisture: 10,
      pitch_cracks: 65,
      pitch_dust: 55,
      pitch_hardness: 75,
      air_temperature: 24,
      air_humidity: 42,
      wind_speed_kmh: 22,
      wind_direction: "South",
      ball_overs_used: 82,
      ball_seam_wear: 90,
      ball_shine_side_a: 5,
      ball_roughness_side_b: 95,
      ball_moisture_wet: 5,
      ball_hardness_score: 40,
      bat_wood_age_months: 12,
      bat_sweet_spot: 88,
      bat_cracks: 22,
      bat_edge_damage: 30,
      bat_moisture_absorb: 8
    },
    fieldingPositions: [
      "Long-On", "Long-Off", "Deep Mid-Wicket", "Deep Square Leg", "Deep Point", "Third Man", "Extra Cover Outer", "Keeper", "Mid-Off Circle"
    ],
    trajectoryHighlight: "Reverse sweep and flat-batted pulls defying crowded deep boundary riders.",
    aiTacticalCommentary: [
      "With 9 wickets down, Stokes takes full calculated risks, executing a reverse sweep off a dry Day 4 rough.",
      "The old ball bounces low, but Stokes commands his posture, transferring 92% impact efficiency.",
      "The ball races like a bullet, breaching the field setting to complete arguably the greatest comeback chase of the decade."
    ]
  }
};
