import React from "react";
import { motion } from "motion/react";
import { SpinType, PitchType } from "../types";
import { Wind, Target, TrendingUp, Gauge, RefreshCw, Compass } from "lucide-react";

interface PitchVisualizerProps {
  ball_speed_kmh: number;
  spin_type: SpinType;
  spin_rate_rpm: number;
  pitch_type_modifier: PitchType;
  total_deviation_cm: number;
  wicket_probability_percentage: number;
}

export const PitchVisualizer: React.FC<PitchVisualizerProps> = ({
  ball_speed_kmh,
  spin_type,
  spin_rate_rpm,
  pitch_type_modifier,
  total_deviation_cm,
  wicket_probability_percentage,
}) => {
  // Determine pitch visual styling based on modifier
  const getPitchStyle = () => {
    switch (pitch_type_modifier) {
      case "Green/Grassy":
        return {
          bg: "bg-emerald-950/20 border-emerald-500/25",
          color: "text-emerald-400",
          texture: (
            <div className="absolute inset-0 pointer-events-none opacity-[0.08]" id="grassy-overlay">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="grass-grid" width="12" height="12" patternUnits="userSpaceOnUse">
                    <line x1="2" y1="2" x2="4" y2="10" stroke="#10b981" strokeWidth="1.5" />
                    <line x1="6" y1="1" x2="8" y2="11" stroke="#059669" strokeWidth="1.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grass-grid)" />
              </svg>
            </div>
          ),
          label: "Damp Grassy Deck (Seam Play Active)",
        };
      case "Dusty/Dry":
        return {
          bg: "bg-amber-950/20 border-amber-500/25",
          color: "text-amber-400",
          texture: (
            <div className="absolute inset-0 pointer-events-none opacity-[0.08]" id="dusty-overlay">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="dust-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 0 10 L 10 0 M 10 24 L 24 10 M 12 12 L 18 24" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dust-grid)" />
              </svg>
            </div>
          ),
          label: "Crumbling Dusty Deck (Extravagant Spin)",
        };
      case "Concrete":
        return {
          bg: "bg-slate-900/35 border-slate-600/25",
          color: "text-slate-400",
          texture: null,
          label: "Rigid Concrete Ground (Low Friction Speed)",
        };
      case "Mud":
        return {
          bg: "bg-stone-900/30 border-stone-705/30",
          color: "text-stone-500",
          texture: (
            <div className="absolute inset-0 pointer-events-none opacity-[0.12]" id="muddy-overlay">
              <svg className="w-full h-full">
                <circle cx="25" cy="35" r="2" fill="#78350f" />
                <circle cx="95" cy="55" r="3" fill="#451a03" />
                <circle cx="170" cy="20" r="1.5" fill="#5c1f06" />
              </svg>
            </div>
          ),
          label: "Damp Muddy Outfield (Dragged Rebound)",
        };
      case "Balanced":
      default:
        return {
          bg: "bg-white/[0.015] border-white/[0.06]",
          color: "text-amber-400",
          texture: null,
          label: "Standard Balanced Clay Face",
        };
    }
  };

  const pitchConfig = getPitchStyle();

  // Top-Down Calculation
  const xStart = 50;
  const xBounce = 380; 
  const xEnd = 550;

  const yCenter = 75; 
  const deviationPx = total_deviation_cm * 1.5;
  const yBounce = yCenter;
  const yEndReal = yCenter + deviationPx;

  const straightPathStr = `M ${xStart} ${yCenter} L ${xEnd} ${yCenter}`;
  const realPathStr = `M ${xStart} ${yCenter} Q ${(xStart + xBounce) / 2} ${yCenter} ${xBounce} ${yBounce} Q ${(xBounce + xEnd) / 2} ${(yBounce + yEndReal) / 2} ${xEnd} ${yEndReal}`;

  // Side view dimensions
  const yGround = 120;
  const yHeightRelease = 40; 
  const speedRatio = (ball_speed_kmh - 80) / 80; 
  const bounceIntensity = spin_type === "Top-Spin" ? 1.55 : spin_type === "Leg-Spin" || spin_type === "Off-Spin" ? 1.28 : 1.0;
  const yHeightEnd = yGround - ((46 * bounceIntensity) - (speedRatio * 15));

  const realFlightStr = `M ${xStart} ${yHeightRelease} Q ${(xStart + xBounce) / 2} ${(yHeightRelease + yGround) / 2 - 10} ${xBounce} ${yGround} Q ${(xBounce + xEnd) / 2} ${(yGround + yHeightEnd) / 2 - 15} ${xEnd} ${yHeightEnd}`;

  return (
    <div className="liquid-glass p-6 md:p-7.5 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col gap-6 transition-all duration-300 hover:border-white/[0.18]" id="trajectory-dashboard">
      
      {/* CSS Animation styles for interactive airflow vectors */}
      <style>{`
        @keyframes air-flow-dash {
          to {
            stroke-dashoffset: -30;
          }
        }
        .kinetic-airflow-line {
          stroke-dasharray: 8, 5;
          animation: air-flow-dash 1.2s infinite linear;
        }
      `}</style>

      {/* Gloss background shimmer overlay */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF4D00]/5 rounded-full blur-[45px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Visual Header */}
      <div className="flex justify-between items-start border-b border-white/[0.08] pb-4.5">
        <div>
          <h3 className="text-sm font-sans font-bold text-white tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-ping" />
            Holographic Flight Viewport
          </h3>
          <p className="text-[11px] mt-1 font-mono tracking-wider text-[#8E94B0] uppercase flex items-center gap-1">
            <span>Surface Assessment:</span>
            <span className="text-[#FF4D00] font-semibold">{pitchConfig.label}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono px-3 py-1 bg-white/[0.03] rounded-lg border border-white/[0.06] text-[#8E94B0] tracking-widest uppercase">
            VECTOR MODE LIVE
          </span>
        </div>
      </div>

      {pitchConfig.texture}

      {/* SVGs Grid Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        
        {/* VIEW 1: TOP-DOWN VIEW (LATERAL DEVIATION) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] uppercase tracking-wider font-mono text-[#8E94B0] font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#FF4D00]" />
              Top-Down Axis // Drift Deviation
            </span>
            <span className="text-xs font-mono text-[#FF4D00] font-bold px-2.5 py-0.5 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/20 shadow-md">
              DEV: {total_deviation_cm > 0 ? "+" : ""}{total_deviation_cm} CM
            </span>
          </div>

          <div className={`relative h-44 rounded-2xl ${pitchConfig.bg} border p-4 flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]`}>
            {/* Visual pitch zones */}
            <div className="absolute left-[50px] top-0 bottom-0 border-l border-white/5 border-dashed" />
            <div className="absolute right-[50px] top-0 bottom-0 border-r border-white/5 border-dashed" />
            <div className="absolute left-[380px] top-0 bottom-0 border-l border-white/[0.08]" />

            <svg viewBox="0 0 600 150" className="w-full h-full overflow-visible">
              <defs>
                {/* Neon trajectory path glow filter */}
                <filter id="trajectory-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#FF4D00" floodOpacity="0.75" />
                </filter>
                <filter id="straight-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#00D1FF" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Pitch central coordinate line */}
              <line x1="50" y1={yCenter} x2="550" y2={yCenter} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

              {/* Bowler crease markers */}
              <line x1="50" y1="40" x2="50" y2="110" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <circle cx="50" cy="75" r="3.5" fill="#8E94B0" />

              {/* Batter crease wickets */}
              <line x1="550" y1="40" x2="550" y2="110" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <circle cx="550" cy="65" r="2" fill="#E4E6F0" />
              <circle cx="550" cy="75" r="2" fill="#E4E6F0" />
              <circle cx="550" cy="85" r="2" fill="#E4E6F0" />

              {/* Standard Straight Path */}
              <path d={straightPathStr} fill="none" stroke="rgba(0, 209, 255, 0.25)" strokeWidth="1.5" strokeDasharray="3,3" filter="url(#straight-glow)" />

              {/* Kinetic airflow streaks along the curve */}
              <path
                d={realPathStr}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="5"
                className="kinetic-airflow-line"
              />

              {/* Actual curve with premium neon glow */}
              <motion.path
                id="topdownPath"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                d={realPathStr}
                fill="none"
                stroke={Math.abs(total_deviation_cm) > 10 ? "#FF4D00" : "#ffffff"}
                strokeWidth="2.5"
                filter="url(#trajectory-glow)"
              />

              {/* Navigation Indicators */}
              {Math.abs(total_deviation_cm) > 1.5 && (
                <g>
                  <line
                    x1="550"
                    y1={yCenter}
                    x2="550"
                    y2={yEndReal}
                    stroke="#FF4D00"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                  <path
                    d={`M 547 ${yEndReal - (deviationPx > 0 ? 4 : -4)} L 550 ${yEndReal} L 553 ${yEndReal - (deviationPx > 0 ? 4 : -4)}`}
                    fill="none"
                    stroke="#FF4D00"
                    strokeWidth="1.5"
                  />
                </g>
              )}

              {/* Landing rebound circle */}
              <motion.circle
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                cx={xBounce}
                cy={yBounce}
                r="5"
                className="fill-white stroke-slate-950 stroke-2"
              />

              {/* Final target address landing */}
              <motion.circle
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.8, 1.2], opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                cx={xEnd}
                cy={yEndReal}
                r="6"
                className="fill-[#FF4D00] stroke-slate-950 stroke-2 shadow-lg filter drop-shadow-[0_0_8px_#ff4d00]"
              />

              {/* HUD texts */}
              <text x="35" y="130" className="fill-[#8E94B0] font-mono text-[8px] tracking-wider uppercase font-semibold">Bowler</text>
              <text x="525" y="130" className="fill-[#8E94B0] font-mono text-[8px] tracking-wider uppercase font-semibold">Batter</text>
              <text x={xBounce - 22} y={yBounce - 12} className="fill-white font-mono text-[8px] tracking-wide font-black uppercase">PITCH IMPACT</text>
              <text x={xEnd - 55} y={yEndReal + (deviationPx > 0 ? 15 : -10)} className="fill-[#FF4D00] font-mono text-[9px] font-bold">
                {total_deviation_cm > 0 ? "OUTSWING / LEG-BREAK" : total_deviation_cm < 0 ? "INSWING / OFF-BREAK" : "FLAT SEAM"}
              </text>
            </svg>
          </div>
        </div>

        {/* VIEW 2: SIDE PROFILE VIEW (HEIGHT & BOUNCE PATH) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] uppercase tracking-wider font-mono text-[#8E94B0] font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#FF4D00]" />
              Side Profile // Vertical Flight Profile
            </span>
            <span className="text-xs font-mono text-white px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] shadow-md">
              SPEED: {ball_speed_kmh} KM/H
            </span>
          </div>

          <div className={`relative h-44 rounded-2xl ${pitchConfig.bg} border p-4 flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]`}>
            {/* Ground height limit vector indicator */}
            <div className="absolute left-[50px] right-[50px] bottom-[30px] border-b border-white/[0.08]" />

            <svg viewBox="0 0 600 150" className="w-full h-full overflow-visible">
              {/* Ground level line */}
              <line x1="30" y1={yGround} x2="570" y2={yGround} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

              {/* Bowler crease vertical line */}
              <line x1="50" y1={yGround} x2="50" y2={yGround - 50} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

              {/* Stumps profiles */}
              <line x1="550" y1={yGround} x2="550" y2={yGround - 35} stroke="#E4E6F0" strokeWidth="2.5" />
              <line x1="550" y1={yGround - 35} x2="550" y2={yGround - 39} stroke="#FF4D00" strokeWidth="2.5" />

              {/* Thin straight baseline */}
              <line x1="50" y1={yGround} x2="550" y2={yGround} stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="3,3" />

              {/* Kinetic airflow streaks along Vertical profiling */}
              <path
                d={realFlightStr}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="5"
                className="kinetic-airflow-line"
              />

              {/* Splined trajectory flow */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                d={realFlightStr}
                fill="none"
                stroke="#FF4D00"
                strokeWidth="2.5"
                filter="url(#trajectory-glow)"
              />

              {/* Release sphere */}
              <circle cx={xStart} cy={yHeightRelease} r="4.5" fill="#E4E6F0" />

              {/* Ground pitch footprint */}
              <motion.circle
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                cx={xBounce}
                cy={yGround}
                r="5"
                className="fill-white stroke-slate-950 stroke-1.5"
              />

              {/* Striker hit coordinates */}
              <motion.circle
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.8, 1.2], opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                cx={xEnd}
                cy={yHeightEnd}
                r="5.5"
                className="fill-[#FF4D00] stroke-slate-950 stroke-1.5 filter drop-shadow-[0_0_8px_#ff4d00]"
              />

              {/* Data tags */}
              <text x={xStart - 10} y={yHeightRelease - 12} className="fill-[#8E94B0] font-mono text-[7px] tracking-wide uppercase font-black">Release</text>
              <text x={xBounce - 22} y={yGround + 15} className="fill-white font-mono text-[7px] tracking-wide uppercase font-black">Bounce</text>
              <text x={xEnd - 45} y={yHeightEnd - 12} className="fill-[#FF4D00] font-mono text-[7px] tracking-wide uppercase font-black">Strike Height</text>
            </svg>
          </div>
        </div>

      </div>

      {/* Modern Liquid Glass Telemetry Summary cards */}
      <div className="bg-[#04060f]/60 rounded-2xl border border-white/[0.08] p-4 text-xs font-mono grid grid-cols-1 md:grid-cols-3 gap-4.5 text-[#8E94B0] shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex flex-col gap-1 px-1">
          <span className="text-[10px] text-[#8E94B0] uppercase tracking-wider font-bold flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-[#FF4D00]" />
            Aero Magnus Multiplier
          </span>
          <span className="text-[#E4E6F0] font-medium leading-relaxed">
            {spin_type === "None" ? (
              <span>Zero Air-Grip (Passive Seam)</span>
            ) : spin_type === "Swing-Only" ? (
              <span className="text-[#FF4D00] font-bold">Laminar Magnus Active ({spin_rate_rpm} RPM)</span>
            ) : (
              <span>Viscous Vortex Curve ({spin_rate_rpm} RPM)</span>
            )}
          </span>
        </div>
        <div className="flex flex-col gap-1 px-1">
          <span className="text-[10px] text-[#8E94B0] uppercase tracking-wider font-bold flex items-center gap-1">
            <RefreshCw className="w-4 h-4 text-[#FF4D00]" />
            Deformation Friction (μ)
          </span>
          <span className="bg-white/[0.04] border border-white/[0.08] rounded-full px-3 py-0.5 text-[#E4E6F0] text-center font-bold text-[11px] self-start mt-0.5">
            {pitch_type_modifier === "Dusty/Dry" ? "Heavy Friction: μ = 0.85" : 
             pitch_type_modifier === "Green/Grassy" ? "Damp Slide: μ = 0.40" : 
             pitch_type_modifier === "Concrete" ? "Frictionless: μ = 0.15" : "Medium Balance: μ = 0.55"}
          </span>
        </div>
        <div className="flex flex-col gap-1 px-1">
          <span className="text-[10px] text-[#8E94B0] uppercase tracking-wider font-bold flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-rose-400" />
            Wicket Strike Threat
          </span>
          <span>
            {wicket_probability_percentage > 60 ? (
              <span className="text-rose-400 font-bold tracking-wide">⚡ CRITICAL THREAT ({wicket_probability_percentage}%)</span>
            ) : wicket_probability_percentage > 30 ? (
              <span className="text-amber-400 font-bold">MODERATE HAZARD ({wicket_probability_percentage}%)</span>
            ) : (
              <span className="text-[#8E94B0] font-semibold">STABLE QUOTIENT ({wicket_probability_percentage}%)</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
