import { AICommentaryLine } from "../types";

export interface LiveMatchData {
  id: string;
  teams: {
    batting: { name: string; short: string; score: string; overs: string; runs: number; wickets: number; runsNeeded?: number; ballsRemaining?: number };
    bowling: { name: string; short: string };
  };
  liveState: {
    currentBatter: string;
    currentBatterRuns: number;
    currentBatterBalls: number;
    currentBowler: string;
    currentBowlerOvers: string;
    currentBowlerRuns: number;
    currentBowlerWickets: number;
    partnershipRuns: number;
    partnershipBalls: number;
    runRate: number;
    requiredRunRate?: number;
    status: string; // e.g. "India needs 24 runs from 12 balls"
    lastEvents: string[]; // last 6 balls in the over
  };
  venue: string;
  tossInfo: string;
  commentary: AICommentaryLine[];
}

class LiveMatchDataService {
  private cache: Record<string, LiveMatchData> = {};
  private activeSimMatch: LiveMatchData | null = null;
  private subscribers: Set<(match: LiveMatchData) => void> = new Set();
  private pollingIntervalId: any = null;

  constructor() {
    this.initSimMatch();
    this.startPolling();
  }

  // Set up an active, exciting simulated match that updates in real-time
  private initSimMatch() {
    this.activeSimMatch = {
      id: "live-ind-pak-3000",
      teams: {
        batting: { name: "India", short: "IND", score: "238/5", overs: "46.2", runs: 238, wickets: 5, runsNeeded: 32, ballsRemaining: 22 },
        bowling: { name: "Pakistan", short: "PAK" }
      },
      liveState: {
        currentBatter: "Virat Kohli",
        currentBatterRuns: 88,
        currentBatterBalls: 72,
        currentBowler: "Shaheen Afridi",
        currentBowlerOvers: "8.2",
        currentBowlerRuns: 52,
        currentBowlerWickets: 2,
        partnershipRuns: 42,
        partnershipBalls: 28,
        runRate: 5.14,
        requiredRunRate: 8.73,
        status: "India needs 32 runs from 22 balls to win",
        lastEvents: ["1", "4", "0", "wd", "2", "w"]
      },
      venue: "Narendra Modi Stadium, Ahmedabad",
      tossInfo: "India won the toss and elected to bowl first (Pakistan made 269 all out in 50 overs)",
      commentary: [
        { text: "Late out-swing delivery beats the leading edge. Excellent carry to goalie.", type: "broadcast", timestamp: "46.2 Overs" },
        { text: "Kohli stands firm, adjusting to the extra bounce nicely.", type: "tactical", timestamp: "46.1 Overs" },
        { text: "WICKET! Shaheen gets the breakthrough, cleaning up the stumps with an inswinging yorker!", type: "critical", timestamp: "45.6 Overs" }
      ]
    };
  }

  public getMockMatches(): LiveMatchData[] {
    return [
      this.activeSimMatch!,
      {
        id: "live-aus-eng-9000",
        teams: {
          batting: { name: "Australia", short: "AUS", score: "344/3", overs: "90.0", runs: 344, wickets: 3 },
          bowling: { name: "England", short: "ENG" }
        },
        liveState: {
          currentBatter: "Steve Smith",
          currentBatterRuns: 114,
          currentBatterBalls: 210,
          currentBowler: "Mark Wood",
          currentBowlerOvers: "19.0",
          currentBowlerRuns: 88,
          currentBowlerWickets: 1,
          partnershipRuns: 142,
          partnershipBalls: 310,
          runRate: 3.82,
          status: "Stumps - Day 1. Australia dominating Headingley",
          lastEvents: ["0", "0", "1", "0", "4", "0"]
        },
        venue: "Lord's, London",
        tossInfo: "England won the toss and elected to field first",
        commentary: [
          { text: "Steve Smith completes a masterclass century. Absolute standing ovation.", type: "tactical", timestamp: "89.4 Overs" }
        ]
      }
    ];
  }

  // Advance match state by simulating a single ball bowled
  public advanceMatchBall(matchId?: string): LiveMatchData {
    if (!this.activeSimMatch) {
      this.initSimMatch();
    }
    const m = this.activeSimMatch!;
    let oversCount = parseFloat(m.teams.batting.overs);
    let oversWhole = Math.floor(oversCount);
    let ballInOver = Math.round((oversCount - oversWhole) * 10);

    ballInOver += 1;
    if (ballInOver >= 6) {
      oversWhole += 1;
      ballInOver = 0;
    }
    m.teams.batting.overs = `${oversWhole}.${ballInOver}`;

    // Simulate real event outcomes
    const events = ["0", "1", "2", "4", "6", "W", "wd", "nb"];
    const randIndex = [0, 0, 1, 1, 2, 3, 3, 4, 5, 6][Math.floor(Math.random() * 10)];
    const event = events[randIndex];

    m.liveState.partnershipBalls += 1;
    m.liveState.currentBatterBalls += 1;

    if (m.teams.batting.ballsRemaining) {
      m.teams.batting.ballsRemaining -= 1;
    }

    if (event === "W") {
      m.teams.batting.wickets += 1;
      m.liveState.lastEvents.push("W");
      m.commentary.unshift({
        text: `OUT! ${m.liveState.currentBatter} is dismissed! Stunned silence inside the stadium as the wicket is dislodged.`,
        type: "critical",
        timestamp: `${m.teams.batting.overs} Overs`
      });
      m.liveState.currentBatter = ["Hardik Pandya", "Ravindra Jadeja", "Jasprit Bumrah"][Math.floor(Math.random() * 3)];
      m.liveState.currentBatterRuns = 0;
      m.liveState.currentBatterBalls = 0;
      m.liveState.partnershipRuns = 0;
      m.liveState.partnershipBalls = 0;
      m.liveState.currentBowlerWickets += 1;
    } else if (event === "wd" || event === "nb") {
      m.teams.batting.runs += 1;
      m.liveState.partnershipRuns += 1;
      m.liveState.lastEvents.push(event);
      m.commentary.unshift({
        text: `Extra! Back of length delivery results in a ${event === "wd" ? "wide" : "no-ball"} down leg.`,
        type: "broadcast",
        timestamp: `${m.teams.batting.overs} Overs`
      });
      if (m.teams.batting.runsNeeded) m.teams.batting.runsNeeded -= 1;
    } else {
      const run = parseInt(event);
      m.teams.batting.runs += run;
      m.liveState.partnershipRuns += run;
      m.liveState.currentBatterRuns += run;
      m.liveState.lastEvents.push(event);

      if (m.teams.batting.runsNeeded) {
        m.teams.batting.runsNeeded = Math.max(0, m.teams.batting.runsNeeded - run);
      }

      if (run === 6) {
        m.commentary.unshift({
          text: `SIX! Inside-out over extra cover. Timing meets sweet-spot cleanly and lifts it effortlessly!`,
          type: "tactical",
          timestamp: `${m.teams.batting.overs} Overs`
        });
      } else if (run === 4) {
        m.commentary.unshift({
          text: `FOUR! Hammered through covers. The bowler loses length and gets punished instantly.`,
          type: "broadcast",
          timestamp: `${m.teams.batting.overs} Overs`
        });
      } else {
        m.commentary.unshift({
          text: `${m.liveState.currentBatter} nudges a slower delivery for ${run ? run + " run(s) to the outfield" : "a dot ball"}.`,
          type: "broadcast",
          timestamp: `${m.teams.batting.overs} Overs`
        });
      }
    }

    if (m.liveState.lastEvents.length > 6) {
      m.liveState.lastEvents.shift();
    }

    const totalBallsBowled = oversWhole * 6 + ballInOver;
    m.liveState.runRate = parseFloat(((m.teams.batting.runs / Math.max(1, totalBallsBowled)) * 6).toFixed(2));
    m.teams.batting.score = `${m.teams.batting.runs}/${m.teams.batting.wickets}`;

    if (m.teams.batting.runsNeeded && m.teams.batting.ballsRemaining) {
      m.liveState.requiredRunRate = parseFloat(((m.teams.batting.runsNeeded / m.teams.batting.ballsRemaining) * 6).toFixed(2));
      m.liveState.status = `${m.teams.batting.name} needs ${m.teams.batting.runsNeeded} runs from ${m.teams.batting.ballsRemaining} balls to win`;
      if (m.teams.batting.runsNeeded <= 0) {
        m.liveState.status = `${m.teams.batting.name} won the chase successfully!`;
        m.teams.batting.runsNeeded = undefined;
        m.teams.batting.ballsRemaining = undefined;
      }
    }

    if (m.commentary.length > 20) {
      m.commentary.pop();
    }

    this.subscribers.forEach(cb => cb({ ...m }));
    return { ...m };
  }

  // Active polling simulates a ball bowled every 6 seconds to show dynamic movement
  private startPolling() {
    if (this.pollingIntervalId) return;

    this.pollingIntervalId = setInterval(() => {
      this.advanceMatchBall();
    }, 6000);
  }

  public subscribeToLiveMatch(cb: (match: LiveMatchData) => void) {
    this.subscribers.add(cb);
    // Initial emission
    if (this.activeSimMatch) {
      cb({ ...this.activeSimMatch });
    }
    return () => {
      this.subscribers.delete(cb);
    };
  }

  // Support pulling real external REST sports matches if weather/sports APIs are configured
  public async fetchLiveMatchFromApi(matchID: string): Promise<LiveMatchData | null> {
    const key = process.env.CRICBUZZ_API_KEY;
    if (key) {
      try {
        const res = await fetch(`https://api.cricbuzz.com/v1/matches/${matchID}`, {
          headers: { "Authorization": `Bearer ${key}` }
        });
        if (res.ok) {
          const apiData = await res.json();
          // Map to LiveMatchData standard
          return apiData as LiveMatchData;
        }
      } catch (e) {
        console.error("Cricbuzz API Error. Falling back to simulated cache.", e);
      }
    }
    return this.activeSimMatch;
  }
}

export const MatchDataService = new LiveMatchDataService();
export default MatchDataService;
