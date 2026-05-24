import { useState, useEffect } from "react";
import { MatchDataService, LiveMatchData } from "../services/matchService";

export function useMatchData() {
  const [liveMatches, setLiveMatches] = useState<LiveMatchData[]>([]);
  const [activeMatch, setActiveMatch] = useState<LiveMatchData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Collect pre-loaded list
    const list = MatchDataService.getMockMatches();
    setLiveMatches(list);
    if (list.length > 0) {
      setActiveMatch(list[0]);
    }
    setLoading(false);

    // Subscribe to live ball-by-ball developments
    const unsubscribe = MatchDataService.subscribeToLiveMatch((updatedMatch) => {
      setLiveMatches(prev => {
        return prev.map(m => m.id === updatedMatch.id ? updatedMatch : m);
      });
      setActiveMatch(prev => {
        if (prev && prev.id === updatedMatch.id) {
          return updatedMatch;
        }
        return prev;
      });
    });

    return () => unsubscribe();
  }, []);

  return {
    liveMatches,
    activeMatch,
    setActiveMatch,
    loading
  };
}
