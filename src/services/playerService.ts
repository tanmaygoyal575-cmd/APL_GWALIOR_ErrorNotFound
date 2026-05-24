import { PLAYER_PROFILES, PlayerProfile } from "../data/playerProfiles";

export interface HeadToHeadAnalysis {
  matchupCoefficient: number; // 0-100 rating favoring batter
  batterEdgeIndex: number;    // 0-100
  bowlerEdgeIndex: number;    // 0-100
  tacticalScoutingReport: string;
  recommendedDelivery: string;
  recommendedBatterPosture: string;
  victoryVerdict: string;
}

class PlayerAnalyticsEngine {
  public getPlayerById(id: string): PlayerProfile | undefined {
    return PLAYER_PROFILES[id];
  }

  public getAllPlayers(): PlayerProfile[] {
    return Object.values(PLAYER_PROFILES);
  }

  /**
   * Calculates a dynamic head-to-head matchup outcome based on current sandbox conditions.
   */
  public analyzeMatchup(batterId: string, bowlerId: string, currentPitchType: string, currentBallOvers: number): HeadToHeadAnalysis {
    const batter = PLAYER_PROFILES[batterId] || PLAYER_PROFILES["virat-kohli"];
    const bowler = PLAYER_PROFILES[bowlerId] || PLAYER_PROFILES["shane-warne"];

    let batterPower = batter.attributes.threatRating * 0.4 + batter.attributes.formScore * 0.3 + batter.attributes.pressureHandling * 0.3;
    let bowlerPower = bowler.attributes.threatRating * 0.4 + bowler.attributes.formScore * 0.3 + bowler.attributes.pressureHandling * 0.3;

    // Apply pitch modifiers
    if (currentPitchType === "Green/Grassy") {
      if (bowler.bowlingStyle.includes("Fast")) {
        bowlerPower += 15; // Fast bowlers excel on grass
      } else if (bowler.bowlingStyle.includes("Spin")) {
        bowlerPower -= 10; // Spinners struggle on greasy grass
      }
      batterPower -= 5; // Batting is harder on grass early
    } else if (currentPitchType === "Dusty/Dry" || currentPitchType === "Cracked") {
      if (bowler.bowlingStyle.includes("Spin")) {
        bowlerPower += 20; // Spinners dominate dusty decks
      } else if (bowler.bowlingStyle.includes("Fast")) {
        bowlerPower -= 8;  // Harder to swing-cut the old ball on dust
      }
      batterPower -= 12; // Steep turn and dust bounce decay raises batting difficulty
    } else if (currentPitchType === "Concrete") {
      batterPower += 15; // Highway batting on street wickets
      bowlerPower -= 15; // Bowlers have no pitch grip helpers
    }

    // Apply ball condition modifiers
    if (currentBallOvers < 10) {
      if (bowler.bowlingStyle.includes("Fast")) {
        bowlerPower += 10; // New ball swing assist
      }
    } else if (currentBallOvers > 40) {
      if (bowler.bowlingStyle.includes("Spin")) {
        bowlerPower += 8; // Old ball bites more, scuffs the seam
      } else if (bowler.bowlingStyle.includes("Fast") && (bowler.stats.swingEfficiency || 0) > 60) {
        bowlerPower += 12; // Reverse swing active
      }
    }

    // Apply style matchups (e.g. MSD struggles slightly vs legspin drift, Kohli struggles vs outbound pace)
    let matchupBias = 0; // Negative values favor bowler, positive favor batter
    if (batterId === "virat-kohli" && bowler.bowlingStyle.includes("Fast")) {
      matchupBias -= 8; // Outswing weakness
    }
    if (batterId === "ms-dhoni" && bowler.bowlingStyle.includes("Spin")) {
      matchupBias -= 6; // Spin choke in middle overs
    }
    if (batter.battingStyle === "Left-Hand Bat" && bowler.bowlingStyle === "Right-Arm Leg-Spin") {
      matchupBias += 10; // Left handers hit standard leg-spin with the spin turn
    }

    const baselineOutcome = 50 + (batterPower - bowlerPower) + matchupBias;
    const matchupCoefficient = Math.max(10, Math.min(95, Math.round(baselineOutcome)));

    const batterEdgeIndex = matchupCoefficient;
    const bowlerEdgeIndex = 100 - matchupCoefficient;

    let tacticalScoutingReport = "";
    let recommendedDelivery = "";
    let recommendedBatterPosture = "";
    let victoryVerdict = "";

    // Generate smart advice
    if (matchupCoefficient > 65) {
      tacticalScoutingReport = `${batter.name} is in outstanding touch and holds the definitive upper-hand in this duel. Their high form index will easily neutralize ${bowler.name}'s default lengths.`;
      recommendedDelivery = "Bowl a wide slower delivery outside off-stump to tempt a heavy swipe.";
      recommendedBatterPosture = "Attacking. Push forward and clear the front leg to loft over log-on.";
      victoryVerdict = `${batter.name} is highly favored to score multiple boundaries in this over.`;
    } else if (matchupCoefficient < 40) {
      tacticalScoutingReport = `${bowler.name} poses a severe hazardous threat to ${batter.name} here. The current pitch and ball vectors amplify the bowler's unique strengths, magnifying the risk of a swift dismissal.`;
      recommendedDelivery = "Attack directly around the stumps with out-swing or heavy top-spin length.";
      recommendedBatterPosture = "Defensive. Play with soft wrists and expect late deviation before locking wrists.";
      victoryVerdict = `${bowler.name} is primed for an active wicket opportunity.`;
    } else {
      tacticalScoutingReport = `A beautifully poised classical chess matchup. Neither ${batter.name} nor ${bowler.name} has a clear physical advantage under these environmental conditions. Success depends entirely on execution.`;
      recommendedDelivery = "Vary the pace and deliver a standard good-length corridor bowl.";
      recommendedBatterPosture = "Balanced. Play each ball on its merit, tracking the bounce with a steady head.";
      victoryVerdict = "A highly contested over with safe singles and standard dot ball pressure.";
    }

    return {
      matchupCoefficient,
      batterEdgeIndex,
      bowlerEdgeIndex,
      tacticalScoutingReport,
      recommendedDelivery,
      recommendedBatterPosture,
      victoryVerdict
    };
  }
}

export const PlayerService = new PlayerAnalyticsEngine();
export default PlayerService;
