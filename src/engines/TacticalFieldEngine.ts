import { TacticalFieldAdvice, PhysicsParameters } from "../types";

export const TacticalFieldEngine = {
  recommend: (params: PhysicsParameters): TacticalFieldAdvice => {
    const isSpinner = params.spin_type !== "None" && params.spin_type !== "Swing-Only";
    const intent = params.batter_intent;
    const speed = params.ball_speed_kmh;
    const pitch = params.pitch_type_modifier;

    let setupTypeName: "Slip Cordon" | "Leg-side Trap" | "Deep Sweepers" | "Spin Containment" | "Death-Over Setup" | "Classic Balanced" = "Classic Balanced";
    let recommendedPositions: string[] = [];
    let riskScore = 45;
    let threatAnalysis = "";
    let tacticalReasoning = "";

    // 1. Determine setup type
    if (intent === "Ultra-Attacking") {
      if (speed > 135) {
        setupTypeName = "Death-Over Setup";
      } else {
        setupTypeName = "Deep Sweepers";
      }
    } else if (isSpinner) {
      if (pitch === "Dusty/Dry") {
        setupTypeName = "Slip Cordon"; // aggressive close catchers
      } else {
        setupTypeName = "Spin Containment";
      }
    } else {
      // Fast bowling
      if (pitch === "Green/Grassy") {
        setupTypeName = "Slip Cordon";
      } else if (intent === "Attacking") {
        setupTypeName = "Leg-side Trap";
      } else {
        setupTypeName = "Classic Balanced";
      }
    }

    // 2. Select positions & reasoning based on setup
    switch (setupTypeName) {
      case "Slip Cordon":
        recommendedPositions = [
          "1st Slip (Wicketkeeper Support)",
          "2nd Slip (Sideways Elastic Catcher)",
          "Gully (Lower Angle Catch)",
          "Silly Point (Spinner Ring)",
          "Mid-Off (Back-up Line)",
          "Mid-On",
          "Deep Fine Leg",
          "Point",
          "Cover"
        ];
        riskScore = 30; // attacking fields reduce scoring, though edge carries high catcher probability
        threatAnalysis = "High Edge Danger: Moving ball invites soft-hands defenses that split the slip cordon. Batter's defensive weight shift minimizes front-foot lofting.";
        tacticalReasoning = isSpinner 
          ? "Surface offers severe spin deviation and glove drift. Packing the bat-pad area with catcher nodes (Gully/Silly Point) handles sharp inside & outside edge trajectories."
          : `Fast bowling on a friendly ${pitch} surface. Slip cordon captures high-deflection edges off the seam before they drop.`;
        break;

      case "Leg-side Trap":
        recommendedPositions = [
          "Short Leg (Inside Edge Catcher)",
          "Square Leg (Pull Trap)",
          "Deep Mid-Wicket (Lofted Trap)",
          "Short Mid-Wicket",
          "Deep Fine Leg",
          "Wicketkeeper",
          "Cover",
          "Mid-Off",
          "Mid-On"
        ];
        riskScore = 55;
        threatAnalysis = "On-side Attack: Batter intends to hook, pull, or sweep standard lengths. Pitch has irregular bounce, creating inside-edge-to-pad lifters.";
        tacticalReasoning = "Employing an active body-line or short-pitched strategy. Packing the leg-side ring with catchers triggers misjudged hook heights.";
        break;

      case "Deep Sweepers":
        recommendedPositions = [
          "Deep Mid-Wicket",
          "Deep Cover (Sweeper)",
          "Long-On",
          "Long-Off",
          "Deep Square Leg",
          "Point",
          "Mid-Wicket",
          "Extra Cover",
          "Wicketkeeper"
        ];
        riskScore = 75; // high threat of boundary bleeding
        threatAnalysis = "Explosive Aggression: Batsman is utilizing an open stance searching for boundary clearance. Front foot clears the line to drive or lift.";
        tacticalReasoning = "Reducing scoring probability by protecting boundaries. Sweeping outfield catch nodes are positioned to intercept flat aerial drives.";
        break;

      case "Spin Containment":
        recommendedPositions = [
          "Backward Point (Deflective)",
          "Cover (Ring)",
          "Mid-Wicket (Ring)",
          "Long-On (Deep Control)",
          "Long-Off (Deep Control)",
          "Deep Mid-Wicket",
          "Square Leg",
          "Silly Mid-Off (Stifling Singles)",
          "Wicketkeeper"
        ];
        riskScore = 40;
        threatAnalysis = "Strike-Rotation: Batter sweeps or nudges gaps to break bowler rhythm. Low danger of straight lofting but high single-leakage risk.";
        tacticalReasoning = "Stifling runs by squeezing the 30-yard circle. Long-on and Long-off are deep to absorb high-stress escape attempts.";
        break;

      case "Death-Over Setup":
        recommendedPositions = [
          "Long-On (Boundary Guard)",
          "Long-Off (Boundary Guard)",
          "Deep Mid-Wicket (Sweep Cover)",
          "Deep Cover",
          "Deep Fine Leg (Slower Ball Protection)",
          "Third Man (Ramped Ball Protection)",
          "Extra Cover",
          "Mid-Wicket",
          "Wicketkeeper"
        ];
        riskScore = 85; // extreme risk of boundary scoring
        threatAnalysis = "Maximum Aerial Intent: Batter is targeting cow-corner and mid-wicket boundaries off fast speeds. Slower balls or yorkers will be dispatched if mistimed.";
        tacticalReasoning = "Standard high-pressure deep defense. Four boundary riders guard primary hitting arcs, forcing the batsman to run twos and play low-efficiency angles.";
        break;

      case "Classic Balanced":
      default:
        recommendedPositions = [
          "1st Slip",
          "Point",
          "Cover",
          "Mid-Off",
          "Mid-On",
          "Mid-Wicket",
          "Square Leg",
          "Deep Fine Leg",
          "Wicketkeeper"
        ];
        riskScore = 45;
        threatAnalysis = "Standard Risk: Batsman playing defensively on merit. No pre-meditated charge detected.";
        tacticalReasoning = "Standard 6-3 split balancing off-side defensive pressure and boundary coverage, allowing the bowler to test the batter's corridor of uncertainty.";
        break;
    }

    // Adjust risk score based on speed and pitch moisture
    if (pitch === "Mud") {
      riskScore = Math.max(15, riskScore - 15); // mud slows everything down, reducing overall scoring danger
    }
    if (speed > 148 && setupTypeName === "Classic Balanced") {
      riskScore += 10; // high speeds carry high energy on edges
    }

    return {
      riskScore,
      threatAnalysis,
      tacticalReasoning,
      recommendedPositions,
      setupTypeName
    };
  }
};
