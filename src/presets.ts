import { PresetScenario } from "./types";

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "dhoni-2011",
    title: "Dhoni's WC Winning Six (2011)",
    description: "What if Kulasekara bowled a 132 km/h full-length swinger on dusty day 5 Wankhede, and Dhoni targeted a massive hit over long-on?",
    query: "MS Dhoni hits the winning 2011 World Cup six off Nuwan Kulasekara on a dusty day 5 Wankhede stadium pitch with an ultra-attacking intent.",
    iconType: "dhoni",
    parameters: {
      ball_speed_kmh: 132,
      spin_type: "Swing-Only",
      spin_rate_rpm: 250,
      pitch_type_modifier: "Dusty/Dry",
      batter_intent: "Ultra-Attacking"
    }
  },
  {
    id: "kohli-2022",
    title: "Kohli's MCG Backfoot Shot (2022)",
    description: "What if Haris Rauf bowled a 145km/h fast delivery or yorker instead of a slower ball at the MCG, and Kohli responded with ultra-attacking punch?",
    query: "Virat Kohli's straight six down the ground off a 145km/h delivery at the MCG 2022. Analyze if a flat fast yorker of 145 km/h on a balanced pitch would dismiss him.",
    iconType: "kohli",
    parameters: {
      ball_speed_kmh: 145,
      spin_type: "None",
      spin_rate_rpm: 0,
      pitch_type_modifier: "Balanced",
      batter_intent: "Ultra-Attacking"
    }
  },
  {
    id: "warne-1993",
    title: "Shane Warne's 'Gatting Ball' (1993)",
    description: "Warne's miraculous leg-break (2400 RPM, 83 km/h) pitching far leg-stump and ripping across to clip off on a damp day 1 grassy wicket.",
    query: "Shane Warne's Ball of the Century to Mike Gatting: a 83km/h leg-spin at 2400 RPM on a grassy pitch. Gatting tries to defend.",
    iconType: "warne",
    parameters: {
      ball_speed_kmh: 83,
      spin_type: "Leg-Spin",
      spin_rate_rpm: 2400,
      pitch_type_modifier: "Green/Grassy",
      batter_intent: "Defensive"
    }
  },
  {
    id: "stokes-2019",
    title: "Ben Stokes Headingley Blast (2019)",
    description: "Ben Stokes reverse flushing or sweeping Nathan Lyon on a dusty day 5 pitch at Headingley. Extremes of courage and attacking strategy.",
    query: "Ben Stokes reverse sweeps/slugs Nathan Lyon's heavy off-spin on a dry dusty day 5 Headingley pitch.",
    iconType: "stokes",
    parameters: {
      ball_speed_kmh: 90,
      spin_type: "Off-Spin",
      spin_rate_rpm: 1900,
      pitch_type_modifier: "Dusty/Dry",
      batter_intent: "Ultra-Attacking"
    }
  },
  {
    id: "legspin-theory",
    title: "Theoretical 2500 RPM Leg-Break",
    description: "Analyzing the pure physics of a rapid 2500 RPM rip at 95 km/h landing in the rough on a crumbling pitch.",
    query: "What happens if an elite spinner bowls a 2500 RPM leg-break at 95km/h spinning out of the rough on a dry decaying pitch?",
    iconType: "theoretical",
    parameters: {
      ball_speed_kmh: 95,
      spin_type: "Leg-Spin",
      spin_rate_rpm: 2500,
      pitch_type_modifier: "Dusty/Dry",
      batter_intent: "Defensive"
    }
  }
];
