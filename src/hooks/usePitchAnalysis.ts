import { useMemo } from "react";
import { PitchService, PitchDegradationReport } from "../services/pitchService";

export function usePitchAnalysis(pitchType: string, ballOversUsed: number, dryRate: number): PitchDegradationReport {
  return useMemo(() => {
    return PitchService.calculatePitchWear(pitchType, ballOversUsed, dryRate);
  }, [pitchType, ballOversUsed, dryRate]);
}

export default usePitchAnalysis;
