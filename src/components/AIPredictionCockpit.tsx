import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Layers, 
  Wind, 
  Wrench, 
  Compass, 
  Target, 
  TrendingUp, 
  MessageSquare,
  AlertTriangle,
  Flame,
  CheckCircle,
  Gauge,
  Sparkles
} from "lucide-react";
import { CompleteEnginePayload } from "../engines/Orchestrator";

interface AIPredictionCockpitProps {
  assessment: CompleteEnginePayload | null;
}

export const AIPredictionCockpit: React.FC<AIPredictionCockpitProps> = ({ assessment }) => {
  const [activeSubTab, setActiveSubTab] = useState<"pitch" | "ball" | "willow" | "physics" | "shots" | "match" | "commentary">("pitch");

  if (!assessment) {
    return (
      <div className="liquid-glass p-8 text-center rounded-[2rem] border border-white/5 bg-white/[0.005]">
        <span className="text-[#8E94B0] text-xs font-mono">Initializing analytic dashboard telemetry...</span>
      </div>
    );
  }

  const { pitch, ball, bat, swing, spinPhysics, tactical, match, commentary, shotProbabilities } = assessment;

  // Rating gauge helper
  const renderProgressBar = (value: number, colorClass: string, label: string) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex justify-between text-[11px] font-mono">
          <span className="text-[#8E94B0]">{label}</span>
          <span className="text-white font-bold">{value}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative border border-white/[0.02]">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="liquid-glass-strong rounded-[2rem] p-6.5 shadow-2xl relative border border-white/[0.1] overflow-hidden flex flex-col gap-6" id="prediction-cockpit">
      
      {/* Top subtle gloss line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF4D00]/20 to-transparent pointer-events-none" />
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <h4 className="text-sm font-sans font-black text-white tracking-widest uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF4D00] animate-pulse" />
            AI Prediction Cockpit
          </h4>
          <p className="text-[10px] text-[#8E94B0] font-mono uppercase tracking-wider mt-0.5">Cricket Strategy Analytics & Realtime Simulation</p>
        </div>
        <div className="flex items-center gap-2 bg-[#FF4D00]/5 border border-[#FF4D00]/20 px-3 py-1 rounded-full text-[#FF4D00] text-[9.5px] font-mono font-bold tracking-widest uppercase animate-pulse">
          <span>COGNITIVE ENGINES ENGAGED</span>
        </div>
      </div>

      {/* Cockpit Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-black/45 p-1.5 rounded-2xl border border-white/[0.05] shadow-inner overscroll-x-contain overflow-x-auto max-w-full">
        {[
          { id: "pitch", icon: Layers, label: "Pitch" },
          { id: "ball", icon: Wind, label: "Aero & Ball" },
          { id: "willow", icon: Wrench, label: "Willow" },
          { id: "physics", icon: Compass, label: "Flight Info" },
          { id: "shots", icon: Target, label: "Target Map" },
          { id: "match", icon: TrendingUp, label: "Context" },
          { id: "commentary", icon: MessageSquare, label: "Calling Ticker" }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`py-2 px-3 rounded-xl text-[10.5px] font-mono uppercase tracking-widest font-semibold flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-[#FF4D00]/15 text-[#FF4D00] border border-[#FF4D00]/22"
                  : "text-[#8E94B0] hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <Icon className="w-3.5 h-3.5 stroke-[2]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Sub-tab Panel Container */}
      <div className="min-h-[290px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col gap-4"
          >
            {/* SUB-PANEL 1: PITCH DIAGNOSTIC */}
            {activeSubTab === "pitch" && (
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#FF4D00]" />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono tracking-wider font-bold text-[#FF4D00] uppercase">SURFACE THREAT DIAGNOSIS</span>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold">
                      Danger Profile: {pitch.dangerRating}
                    </span>
                  </div>
                  <p className="text-xs text-[#D2D5E3] font-medium leading-relaxed font-sans">
                    {pitch.tacticalText}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3.5">
                    {renderProgressBar(pitch.bounceConsistency, "bg-cyan-400", "Bounce Regularity")}
                    {renderProgressBar(pitch.spinAssistance, "bg-amber-400", "Spin Surface Bite")}
                    {renderProgressBar(pitch.seamMovement, "bg-emerald-400", "Seam Lateral Play")}
                  </div>
                  <div className="flex flex-col gap-3.5">
                    {renderProgressBar(pitch.swingSupport, "bg-indigo-400", "Atmospheric Swing Lift")}
                    {renderProgressBar(pitch.paceSupport, "bg-rose-400", "Raw Pace Carry")}
                    {renderProgressBar(pitch.pitchDeterioration, "bg-orange-400", "Surface Decay Risk")}
                  </div>
                </div>

                <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl text-[11px] font-mono text-[#8E94B0] flex items-center justify-between">
                  <span>Rebound Index (CRIM): <span className="text-white font-bold">{(pitch.paceSupport / 100).toFixed(2)}</span></span>
                  <span>Batting Difficulty Factor: <span className="text-white font-bold">{pitch.battingDifficulty}/100</span></span>
                </div>
              </div>
            )}

            {/* SUB-PANEL 2: AERO & BALL WEAR PROFILE */}
            {activeSubTab === "ball" && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex flex-col justify-between gap-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#FF4D00]/[0.02] rounded-full blur-2xl pointer-events-none" />
                    <span className="text-[10px] font-mono tracking-wider font-bold text-[#FF4D00] uppercase">CURRENT BALL STATE</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-lg font-serif italic font-bold text-white leading-tight">
                        {ball.ballStateLabel}
                      </span>
                      <span className="text-[10px] text-[#8E94B0] font-mono">
                        Seam abrasion factor tracking active
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-[11px] font-mono text-white/90 border-t border-white/[0.05] pt-2.5 mt-1.5">
                      <div className="flex justify-between">
                        <span>Boundary Friction Speed:</span>
                        <span className="font-bold text-[#FF4D00]">{ball.degradabilitySpeed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Speed drag loss:</span>
                        <span className="font-bold">-{ball.velocityLossPercent}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 justify-center">
                    {renderProgressBar(ball.conventionalSwingPotential, "bg-[#FF4D00]", "Conventional Swing Margin")}
                    {renderProgressBar(ball.reverseSwingPotential, "bg-purple-400", "Asymmetric Reverse Swing Opportunity")}
                    {renderProgressBar(ball.driftPotential, "bg-blue-400", "Magnus Air Drift Scope")}
                    {renderProgressBar(ball.spinGripPotential, "bg-yellow-500", "Friction Casing Grip")}
                  </div>
                </div>

                <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl text-[11px] font-mono text-[#8E94B0] text-center">
                  ⚠️ Older covers lose elastic momentum, diminishing high-impact rebound bounce of the core by <span className="text-white font-bold">{ball.bounceDecayPercent}%</span>.
                </div>
              </div>
            )}

            {/* SUB-PANEL 3: WILLOW STRESS ANALYSIS */}
            {activeSubTab === "willow" && (
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-[#FF4D00]/5 border border-[#FF4D00]/20 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
                  <span className="text-[10px] font-mono text-[#FF4D00] font-bold tracking-widest uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#FF4D00]" />
                    Willow Performance Damage Report
                  </span>
                  <p className="text-xs text-white leading-relaxed font-sans font-medium">
                    {bat.performanceReductionText}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3.5">
                    {renderProgressBar(bat.batHealthScore, "bg-emerald-400", "Willow Structural Soundness")}
                    {renderProgressBar(bat.powerTransferEfficiency, "bg-amber-400", "Elastic Power Translation")}
                    {renderProgressBar(bat.sweetSpotEffectiveness, "bg-cyan-400", "Composite Sweet Spot Margin")}
                  </div>
                  <div className="flex flex-col gap-3.5">
                    {renderProgressBar(bat.timingEfficiency, "bg-indigo-400", "Timing Window Precision")}
                    {renderProgressBar(bat.mistimeProbability, "bg-rose-400", "Edge catch Probability")}
                    {renderProgressBar(bat.vibrationIntensity, "bg-amber-600", "Kinetic Handle Vibration (Feedback)")}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PANEL 4: FLIGHT MATH & TRAJECTORY ANALYSIS */}
            {activeSubTab === "physics" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col gap-3 font-mono text-xs text-[#D2D5E3] leading-relaxed">
                  <span className="text-[#FF4D00] text-[10px] font-bold tracking-widest uppercase mb-1">AERODYNAMIC VECTORS</span>
                  <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                    <span>Magnus Drift Force:</span>
                    <span className="text-white font-bold">{spinPhysics.driftLateralForceNewtons || 0}N ({swing.swingDirection})</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                    <span>Rotational Torque:</span>
                    <span className="text-white font-bold">{spinPhysics.effectiveTorqueNm || 0} N·m</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                    <span>Flight Dip Coefficient:</span>
                    <span className="text-white font-bold">+{swing.dipEffectCm} CM</span>
                  </div>
                  <div className="flex justify-between pb-0.5">
                    <span>Rebound Angle Projection:</span>
                    <span className="text-[#00D1FF] font-bold">{swing.predictedBounceAngleDeg}° Angle</span>
                  </div>
                </div>

                <div className="p-4 bg-[#030612]/50 border border-white/[0.05] rounded-2xl flex flex-col gap-3">
                  <span className="text-[#FF4D00] text-[10px] font-semibold tracking-widest uppercase font-mono">Aerodynamics Telemetry</span>
                  <div className="flex flex-col gap-2 font-mono text-[11px] text-[#8E94B0]">
                    <div className="flex justify-between">
                      <span>Lateral Seam Deviation:</span>
                      <span className="text-white font-bold">{swing.spinDeviationCm} cm</span>
                    </div>
                    {renderProgressBar(swing.deviationProbability, "bg-cyan-500", "Flight Vector Consistency Probability")}
                  </div>
                  <p className="text-[10.5px] leading-relaxed text-[#8E94B0] font-sans">
                    The boundary layers utilize <span className="font-bold text-white">{(1.2 - (swing.swingIntensity * 0.015)).toFixed(3)} kg/m³</span> air displacement to alter flight paths before turf drop.
                  </p>
                </div>
              </div>
            )}

            {/* SUB-PANEL 5: SHOT TARGET MAP & HEAT ZONE */}
            {activeSubTab === "shots" && (
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono text-[#8E94B0] uppercase tracking-widest font-bold">STRIKER TARGET ARC DENSITY</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Visual Radial Pie Chart Mock with HTML elements */}
                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center h-48 relative">
                    <div className="w-32 h-32 rounded-full border border-white/[0.1] relative flex items-center justify-center">
                      {/* Interactive radial segments mimicking heatmap zones */}
                      <div className="absolute inset-2 rounded-full border border-dashed border-[#FF4D00]/20" />
                      <div className="absolute inset-6 rounded-full border border-double border-white/5" />
                      
                      {/* Shot direction lines */}
                      <div className="absolute h-full w-[1px] bg-white/[0.04]" />
                      <div className="absolute w-full h-[1px] bg-white/[0.04]" />
                      
                      {/* Heat circles mapping frequency */}
                      {Object.keys(shotProbabilities.shotZoneFrequencies).map((key, i) => {
                        const val = shotProbabilities.shotZoneFrequencies[key];
                        // rotate to distribute around circle
                        const rotationDeg = i * 45;
                        const distance = 25 + val * 0.45;
                        return (
                          <div 
                            key={i} 
                            style={{ 
                              transform: `rotate(${rotationDeg}deg) translateY(-${distance}px)`,
                            }}
                            className="absolute flex flex-col items-center justify-center transition-all duration-500"
                          >
                            <div 
                              className={`rounded-full transition-all duration-500 cursor-default ${
                                val > 15 ? "bg-[#FF4D00] shadow-[0_0_12px_rgba(255,100,0,0.6)] animate-pulse" : val > 10 ? "bg-[#FF6A00]/70" : "bg-cyan-500/50"
                              }`}
                              style={{ 
                                width: `${Math.max(8, val * 0.85)}px`, 
                                height: `${Math.max(8, val * 0.85)}px` 
                              }}
                            />
                          </div>
                        );
                      })}
                      <div className="w-4 h-4 bg-white rounded-full z-10 border border-black flex items-center justify-center text-[7px] text-black font-black">ST</div>
                    </div>
                    
                    <div className="absolute top-2 left-3 font-mono text-[8px] uppercase tracking-wider text-[#8E94B0]">HEAT MAP OUTLINE</div>
                    <div className="absolute bottom-2.5 text-[10px] text-[#A2A9C5] font-sans">
                      Target zones mapped clockwise, origin: Wicket Keeper
                    </div>
                  </div>

                  {/* List of shot probabilities */}
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                    {Object.keys(shotProbabilities.shotZoneFrequencies).map((zone, idx) => {
                      const f = shotProbabilities.shotZoneFrequencies[zone];
                      return (
                        <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white/[0.015] border border-white/[0.04] rounded-xl hover:bg-white/[0.04] transition-all duration-200">
                          <span className="font-sans text-[#D2D5E3] font-medium">{zone}</span>
                          <span className={`font-mono font-bold ${f > 15 ? "text-[#FF4D00]" : "text-emerald-400"}`}>{f}% density</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PANEL 6: MATCH CONTEXT & SCENARIO PROJECTIONS */}
            {activeSubTab === "match" && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-white/[0.015] border border-white/[0.05] rounded-2xl flex flex-col justify-between items-center h-28 shadow-md">
                    <span className="text-[10px] font-mono tracking-wider text-[#8E94B0] uppercase">Chase Hardness</span>
                    <span className="text-3xl font-bold font-mono text-cyan-400">{match.chaseDifficulty}<span className="text-xs text-[#8E94B0] font-normal">/10</span></span>
                    <span className="text-[10px] font-mono text-[#8E94B0]">{match.chaseDifficulty > 7 ? "Hostile Chase" : "Stable Run Rate"}</span>
                  </div>

                  <div className="p-4 bg-white/[0.015] border border-white/[0.05] rounded-2xl flex flex-col justify-between items-center h-28 shadow-md">
                    <span className="text-[10px] font-mono tracking-wider text-[#8E94B0] uppercase">Collapse Prob</span>
                    <span className="text-3xl font-bold font-mono text-rose-400">{match.collapseProbability}%</span>
                    <span className="text-[10px] font-mono text-[#8E94B0]">{match.collapseProbability > 50 ? "High Panic Threat" : "Batting Calm"}</span>
                  </div>

                  <div className="p-4 bg-white/[0.015] border border-white/[0.05] rounded-2xl flex flex-col justify-between items-center h-28 shadow-md">
                    <span className="text-[10px] font-mono tracking-wider text-[#8E94B0] uppercase">Aggression Level</span>
                    <span className="text-3xl font-bold font-mono text-[#FF4D00]">{Math.round(match.aggressionModifier * 100)}%</span>
                    <span className="text-[10px] font-mono text-[#8E94B0]">Power Amplification</span>
                  </div>
                </div>

                {/* Live Momentum Balance Meter */}
                <div className="p-4.5 bg-white/[0.015] border border-white/[0.05] rounded-2xl flex flex-col gap-3.5 relative overflow-hidden shadow-inner">
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00D1FF]/10 to-transparent pointer-events-none" />
                  <div className="flex justify-between items-baseline font-mono text-[11px]">
                    <span className="text-cyan-400 font-bold">Batting Momentum</span>
                    <span className="text-[#8E94B0] text-[10px] uppercase font-bold tracking-widest text-[#FF6A00] animate-pulse">Match Momentum: {match.momentumGaugeScore > 0 ? `+${match.momentumGaugeScore}` : match.momentumGaugeScore}</span>
                    <span className="text-rose-400 font-bold">Bowling Grip</span>
                  </div>
                  {/* Two-sided horizontal momentum slider bar */}
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden flex relative border border-white/[0.04]">
                    <div 
                      className="h-full bg-cyan-400 hover:opacity-90 transition-all duration-500"
                      style={{ width: `${match.battingWinProbability}%` }}
                    />
                    <div 
                      className="h-full bg-rose-500 hover:opacity-90 transition-all duration-500"
                      style={{ width: `${100 - match.battingWinProbability}%` }}
                    />
                    {/* Centered balance node pin */}
                    <div className="absolute h-4 w-1 bg-white top-[-3px] left-[50%] transform translate-x-[-50%] border shadow" />
                  </div>
                  <div className="text-xs text-[#D2D5E3] font-medium leading-relaxed font-sans pt-1">
                    <span className="text-[#FF4D00] font-mono text-[10.5px] font-bold uppercase block mb-1">Live Scenario Strategy Advice:</span>
                    {match.recommendedTactics}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PANEL 7: REALTIME ANALYTICAL COMMENTARY LOGS */}
            {activeSubTab === "commentary" && (
              <div className="flex flex-col gap-3.5">
                <span className="text-[10px] font-mono text-[#8E94B0] uppercase tracking-widest font-bold px-0.5">BROADCAST COMMENTARY FEED</span>
                <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {commentary.map((line, idx) => {
                    let typeColor = "text-[#FF6A00] bg-[#FF4D00]/5 border-[#FF4D00]/20";
                    if (line.type === "critical") typeColor = "text-rose-400 bg-rose-500/5 border-rose-500/20";
                    if (line.type === "physical") typeColor = "text-cyan-400 bg-cyan-500/5 border-cyan-500/20";
                    if (line.type === "broadcast") typeColor = "text-emerald-400 bg-emerald-500/5 border-emerald-500/20";

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.12 }}
                        className={`p-3.5 rounded-xl border flex flex-col gap-2 relative overflow-hidden transition-all duration-300 ${typeColor}`}
                      >
                        <div className="flex justify-between items-center text-[9px] font-mono font-bold tracking-wider uppercase">
                          <span>{line.type} Broadcast log</span>
                          <span className="opacity-60">{line.timestamp}</span>
                        </div>
                        <p className="text-xs italic leading-relaxed font-sans text-white font-medium">
                          {line.text}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
