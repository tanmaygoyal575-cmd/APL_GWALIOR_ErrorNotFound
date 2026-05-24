import React from "react";
import { motion } from "motion/react";
import { Shield, Sparkles, Compass } from "lucide-react";

interface FieldMapVisualizerProps {
  fielding_adjustments: string[];
}

export const FieldMapVisualizer: React.FC<FieldMapVisualizerProps> = ({
  fielding_adjustments,
}) => {
  // Static positions on our 300x300 cricket fielding oval
  const defaultFielders = [
    { name: "Bowler", x: 150, y: 175, key: "bowler", isHighlighted: false },
    { name: "Wicket Keeper", x: 150, y: 110, key: "keeper", isHighlighted: false },
    { name: "Slip 1", x: 138, y: 104, key: "slip", isHighlighted: false },
    { name: "Gully / Point", x: 92, y: 130, key: "point", isHighlighted: false },
    { name: "Extra Cover", x: 95, y: 155, key: "cover", isHighlighted: false },
    { name: "Mid-off", x: 120, y: 185, key: "mid-off", isHighlighted: false },
    { name: "Mid-on", x: 180, y: 185, key: "mid-on", isHighlighted: false },
    { name: "Mid-wicket", x: 195, y: 150, key: "mid-wicket", isHighlighted: false },
    { name: "Square Leg", x: 205, y: 130, key: "square leg", isHighlighted: false },
    { name: "Short Leg", x: 162, y: 125, key: "short leg", isHighlighted: false },
    { name: "Deep Mid-Wicket", x: 245, y: 175, key: "deep mid-wicket", isHighlighted: false },
    { name: "Deep Square Leg", x: 235, y: 100, key: "deep square leg", isHighlighted: false },
    { name: "Deep Cover", x: 60, y: 185, key: "deep cover", isHighlighted: false },
    { name: "Third Man", x: 65, y: 80, key: "third man", isHighlighted: false },
    { name: "Fine Leg", x: 215, y: 70, key: "fine leg", isHighlighted: false }
  ];

  // Map text criteria to highlight corresponding fielders
  const checkHighlights = (key: string) => {
    const combinedText = fielding_adjustments.join(" ").toLowerCase();
    
    if (key === "slip" && (combinedText.includes("slip") || combinedText.includes("glove edge") || combinedText.includes("cather"))) return true;
    if (key === "point" && (combinedText.includes("point") || combinedText.includes("gully") || combinedText.includes("backward point"))) return true;
    if (key === "cover" && (combinedText.includes("cover") || combinedText.includes("drive protected"))) return true;
    if (key === "mid-off" && combinedText.includes("mid-off")) return true;
    if (key === "mid-on" && combinedText.includes("mid-on")) return true;
    if (key === "mid-wicket" && combinedText.includes("mid-wicket") && !combinedText.includes("deep mid-wicket")) return true;
    if (key === "square leg" && combinedText.includes("square leg") && !combinedText.includes("deep square")) return true;
    if (key === "short leg" && (combinedText.includes("short leg") || combinedText.includes("glove") || combinedText.includes("catch the glove"))) return true;
    if (key === "deep mid-wicket" && (combinedText.includes("deep mid-wicket") || combinedText.includes("mid-wicket 5 meters") || combinedText.includes("finer"))) return true;
    if (key === "deep square leg" && combinedText.includes("deep square")) return true;
    if (key === "deep cover" && (combinedText.includes("deep cover") || combinedText.includes("deep back"))) return true;
    if (key === "third man" && combinedText.includes("third man")) return true;
    if (key === "fine leg" && combinedText.includes("fine leg")) return true;

    return false;
  };

  const markedFielders = defaultFielders.map((f) => ({
    ...f,
    isHighlighted: checkHighlights(f.key)
  }));

  const anyHighlight = markedFielders.some(f => f.isHighlighted);

  return (
    <div className="liquid-glass p-6 md:p-7 rounded-[2rem] shadow-2xl relative flex flex-col gap-5.5 overflow-hidden transition-all duration-300 hover:border-white/[0.18]" id="tactical-fielding-board">
      
      {/* Gloss reflection shimmer overlay */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#00D1FF]/[0.02] rounded-full blur-[40px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1.2px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Dynamic Header */}
      <div className="border-b border-white/[0.08] pb-4">
        <h4 className="text-sm font-sans font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse" />
          Tactical Field Overlay
        </h4>
        <p className="text-[11px] text-[#8E94B0] mt-1 font-mono uppercase tracking-wider leading-relaxed">
          {anyHighlight 
            ? "⚠️ ADJUSTMENTS PROJECTED ONTO BOUNDARY COORDINATE GRIDS"
            : "Showing balanced field blueprint setup. Modify presets or slide vectors to sync adjustments."}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* VIEW: VISUAL OVAL WITH COORDINATES GRIDS */}
        <div className="w-full md:w-[48%] max-w-[260px] md:max-w-none aspect-square relative flex items-center justify-center bg-black/45 backdrop-blur-md rounded-2xl border border-white/[0.08] p-3 shadow-[inset_0_2px_12px_rgba(0,0,0,0.85)]">
          
          <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
            <defs>
              {/* Ground neon coordinate overlay filter */}
              <pattern id="coordinate-grid" width="15" height="15" patternUnits="userSpaceOnUse">
                <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.8" />
              </pattern>
              
              {/* Highlight neon aura */}
              <filter id="aura-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Coordinate mesh back-grid */}
            <rect width="300" height="300" className="opacity-80" fill="url(#coordinate-grid)" />

            {/* Outer boundary circle (75 yard rope) */}
            <circle cx="150" cy="150" r="132" className="fill-white/[0.005] stroke-white/[0.12] stroke-1.5" />
            
            {/* Center crosshair indicators */}
            <line x1="18" y1="150" x2="282" y2="150" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" strokeDasharray="1,6" />
            <line x1="150" y1="18" x2="150" y2="282" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" strokeDasharray="1,6" />

            {/* Inner 30-yard ring */}
            <circle cx="150" cy="150" r="82" className="fill-none stroke-white/[0.07] stroke-1" strokeDasharray="4,4" />

            {/* Central Turf representation */}
            <rect x="146" y="130" width="8" height="40" className="fill-stone-800/90 stroke-white/[0.1] stroke-1 rounded" />

            {/* Batter & Bowler creases */}
            <line x1="140" y1="135" x2="160" y2="135" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
            <line x1="140" y1="165" x2="160" y2="165" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />

            {/* Position Indicators */}
            <text x="35" y="154" className="fill-[#8E94B0]/20 text-[8px] font-mono tracking-[0.25em] font-bold">OFF SIDE</text>
            <text x="215" y="154" className="fill-[#8E94B0]/20 text-[8px] font-mono tracking-[0.25em] font-bold">LEG SIDE</text>

            {/* Render Fielders with glows */}
            {markedFielders.map((fielder) => (
              <g key={fielder.key}>
                {fielder.isHighlighted ? (
                  <g>
                    {/* Concentric expanding telemetry ripples */}
                    <motion.circle
                      animate={{ scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                      cx={fielder.x}
                      cy={fielder.y}
                      r="10"
                      fill="rgba(255, 77, 0, 0.15)"
                    />
                    <motion.circle
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                      cx={fielder.x}
                      cy={fielder.y}
                      r="7"
                      fill="none"
                      stroke="rgba(255, 77, 0, 0.45)"
                      strokeWidth="1"
                    />
                  </g>
                ) : null}

                {/* Main dot handle */}
                <circle
                  cx={fielder.x}
                  cy={fielder.y}
                  r={fielder.isHighlighted ? "4.5" : "3"}
                  className={`transition-all duration-300 ${
                    fielder.isHighlighted
                      ? "fill-[#FF4D00] stroke-black stroke-2 shadow-[0_0_10px_#ff4d00] pointer-events-none"
                      : "fill-[#8E94B0]/80 hover:fill-[#FF4D00] cursor-pointer hover:scale-125"
                  }`}
                  filter={fielder.isHighlighted ? "url(#aura-glow)" : undefined}
                />

                {/* Hover-safe minimal name label */}
                <text
                  x={fielder.x}
                  y={fielder.y - 7.5}
                  textAnchor="middle"
                  className={`font-mono text-[7px] pointer-events-none transition-all duration-300 ${
                    fielder.isHighlighted
                      ? "fill-[#FF4D00] font-black"
                      : "fill-[#8E94B0] font-medium"
                  }`}
                >
                  {fielder.name}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* SIDEBAR: ACTIVE STRATEGY ADVICE CARDS */}
        <div className="flex-1 flex flex-col gap-3 w-full">
          <span className="text-[10px] text-[#8E94B0] font-mono tracking-wider uppercase font-bold flex items-center gap-1.5 px-0.5">
            <Shield className="w-3.5 h-3.5 text-[#00D1FF]" />
            Active Placement Rules:
          </span>

          <div className="flex flex-col gap-2.5 max-h-[195px] overflow-y-auto pr-1">
            {fielding_adjustments.map((advice, idx) => {
              const matchesHighlighted = markedFielders.some(
                f => f.isHighlighted && advice.toLowerCase().includes(f.key)
              );

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.12 }}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-3 transition-all duration-300 ${
                    matchesHighlighted
                      ? "bg-[#FF4D00]/8 border-[#FF4D00]/22 text-white shadow-[0_4px_16px_rgba(255,77,0,0.08)] glow-orange-border"
                      : "bg-white/[0.015] border-white/[0.06] text-[#D2D5E3] hover:border-white/[0.12]"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 animate-pulse ${
                    matchesHighlighted ? "bg-[#FF4D00]" : "bg-[#8E94B0]/60"
                  }`} />
                  <div className="font-sans leading-relaxed text-[11.5px]">{advice}</div>
                </motion.div>
              );
            })}

            {fielding_adjustments.length === 0 && (
              <div className="text-xs text-[#8E94B0] italic py-8 text-center border border-dashed border-white/[0.08] rounded-xl bg-white/[0.005]">
                Balanced fielding grid active. Standard positions locked under current parameters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
