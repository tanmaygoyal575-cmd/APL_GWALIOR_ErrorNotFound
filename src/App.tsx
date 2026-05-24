import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Zap,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle,
  HelpCircle,
  Flame,
  Wrench,
  Compass,
  ChevronsRight,
  TrendingUp,
  Target,
  AlertTriangle,
  Info,
  Gauge,
  Activity,
  Shield,
  RotateCw,
  RotateCcw,
  Wind,
  Layers,
  Swords,
  Sliders,
  History
} from "lucide-react";

import { CricAIScenario, SpinType, PitchType, BatterIntent } from "./types";
import { PRESET_SCENARIOS } from "./presets";
import { PitchVisualizer } from "./components/PitchVisualizer";
import { FieldMapVisualizer } from "./components/FieldMapVisualizer";
import { AIPredictionCockpit } from "./components/AIPredictionCockpit";
import { EngineOrchestrator } from "./engines/Orchestrator";

export default function App() {
  // Input parameters state
  const [ballSpeed, setBallSpeed] = useState<number>(135);
  const [spinType, setSpinType] = useState<SpinType>("Swing-Only");
  const [spinRate, setSpinRate] = useState<number>(1200);
  const [pitchType, setPitchType] = useState<PitchType>("Balanced");
  const [batterIntent, setBatterIntent] = useState<BatterIntent>("Balanced");

  // Extended high-fidelity parameters state
  const [grassLevel, setGrassLevel] = useState<number>(25);
  const [pitchMoisture, setPitchMoisture] = useState<number>(25);
  const [pitchCracks, setPitchCracks] = useState<number>(20);
  const [pitchDust, setPitchDust] = useState<number>(15);
  const [pitchHardness, setPitchHardness] = useState<number>(70);
  const [airTemperature, setAirTemperature] = useState<number>(30);
  const [airHumidity, setAirHumidity] = useState<number>(60);
  const [windSpeed, setWindSpeed] = useState<number>(10);
  const [windDirection, setWindDirection] = useState<"North" | "South" | "East" | "West" | "None">("East");

  // Ball states
  const [ballOversUsed, setBallOversUsed] = useState<number>(15);
  const [ballSeamWear, setBallSeamWear] = useState<number>(18);
  const [ballShineSideA, setBallShineSideA] = useState<number>(80);
  const [ballRoughnessSideB, setBallRoughnessSideB] = useState<number>(20);
  const [ballMoistureWet, setBallMoistureWet] = useState<number>(10);
  const [ballHardnessScore, setBallHardnessScore] = useState<number>(90);

  // Bat states
  const [batWoodAgeMonths, setBatWoodAgeMonths] = useState<number>(8);
  const [batSweetSpot, setBatSweetSpot] = useState<number>(92);
  const [batCracks, setBatCracks] = useState<number>(10);
  const [batEdgeDamage, setBatEdgeDamage] = useState<number>(15);
  const [batMoistureAbsorb, setBatMoistureAbsorb] = useState<number>(5);

  // Advanced toggles
  const [showAdvancedTuner, setShowAdvancedTuner] = useState<boolean>(false);

  // Orchestrated AI dynamic analysis state
  const [assessment, setAssessment] = useState<any>(null);

  // Sync secondary parameters when main types are updated
  useEffect(() => {
    if (pitchType === "Green/Grassy") {
      setGrassLevel(85);
      setPitchMoisture(45);
      setPitchCracks(10);
      setPitchDust(5);
      setPitchHardness(60);
    } else if (pitchType === "Dusty/Dry") {
      setGrassLevel(5);
      setPitchMoisture(8);
      setPitchCracks(75);
      setPitchDust(90);
      setPitchHardness(45);
    } else if (pitchType === "Concrete") {
      setGrassLevel(0);
      setPitchMoisture(0);
      setPitchCracks(0);
      setPitchDust(0);
      setPitchHardness(100);
    } else if (pitchType === "Mud") {
      setGrassLevel(40);
      setPitchMoisture(95);
      setPitchCracks(0);
      setPitchDust(25);
      setPitchHardness(15);
    } else { // Balanced
      setGrassLevel(25);
      setPitchMoisture(25);
      setPitchCracks(20);
      setPitchDust(15);
      setPitchHardness(70);
    }
  }, [pitchType]);

  // Sync ball wear properties with overs
  useEffect(() => {
    const calculatedWear = Math.min(100, Math.round(ballOversUsed * 1.1));
    const calculatedShine = Math.max(0, Math.round(95 - ballOversUsed * 1.5));
    const calculatedRoughness = Math.min(100, Math.round(ballOversUsed * 2.2));
    const calculatedHardness = Math.max(20, Math.round(100 - ballOversUsed * 0.8));

    setBallSeamWear(calculatedWear);
    setBallShineSideA(calculatedShine);
    setBallRoughnessSideB(calculatedRoughness);
    setBallHardnessScore(calculatedHardness);
  }, [ballOversUsed]);

  // Real-time local processing orchestrator loop
  useEffect(() => {
    const res = EngineOrchestrator.processAll({
      ball_speed_kmh: ballSpeed,
      spin_type: spinType,
      spin_rate_rpm: spinRate,
      pitch_type_modifier: pitchType,
      batter_intent: batterIntent,
      grass_level: grassLevel,
      pitch_moisture: pitchMoisture,
      pitch_cracks: pitchCracks,
      pitch_dust: pitchDust,
      pitch_hardness: pitchHardness,
      air_temperature: airTemperature,
      air_humidity: airHumidity,
      wind_speed_kmh: windSpeed,
      wind_direction: windDirection,
      ball_overs_used: ballOversUsed,
      ball_seam_wear: ballSeamWear,
      ball_shine_side_a: ballShineSideA,
      ball_roughness_side_b: ballRoughnessSideB,
      ball_moisture_wet: ballMoistureWet,
      ball_hardness_score: ballHardnessScore,
      bat_wood_age_months: batWoodAgeMonths,
      bat_sweet_spot: batSweetSpot,
      bat_cracks: batCracks,
      bat_edge_damage: batEdgeDamage,
      bat_moisture_absorb: batMoistureAbsorb
    });
    setAssessment(res);
  }, [
    ballSpeed, spinType, spinRate, pitchType, batterIntent,
    grassLevel, pitchMoisture, pitchCracks, pitchDust, pitchHardness,
    airTemperature, airHumidity, windSpeed, windDirection,
    ballOversUsed, ballSeamWear, ballShineSideA, ballRoughnessSideB, ballMoistureWet, ballHardnessScore,
    batWoodAgeMonths, batSweetSpot, batCracks, batEdgeDamage, batMoistureAbsorb
  ]);

  // Custom text query state
  const [customQuery, setCustomQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"sandbox" | "terminal" | "presets">("presets");

  // Output scenario state
  const [scenario, setScenario] = useState<CricAIScenario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorString, setErrorString] = useState<string>("");

  // Quick prompt suggestions
  const suggestions = [
    { label: "Day 5 Dusty Leg-break at 95km/h", query: "What happens if a spinner bowls a 2500 RPM leg-break at 95km/h on a crumbling day 5 dusty pitch?" },
    { label: "Medium pace to hit over Mid-On", query: "The local pitch is dry concrete, I am bowling medium pace. How do I stop a batsman who constantly hits over mid-on?" },
    { label: "Mitchell Starc fast yorker", query: "What happens if Mitchell Starc bowls a 155 km/h screaming swinging yorker onto the toes of an ultra-attacking batsman?" },
    { label: "Warne ball of the century", query: "Shane Warne's ball of the century to Mike Gatting leg-break 2400 RPM." }
  ];

  // Run simulation API
  const runSimulation = async (queryText?: string, specificParams?: any) => {
    setLoading(true);
    setErrorString("");
    try {
      // Setup payload matching backend requirements
      const payload: { query?: string; parameters?: any } = {};
      if (queryText) {
        payload.query = queryText;
      }
      
      // If specific parameters are supplied (e.g. from a click), override. Else use current workspace sliders
      payload.parameters = specificParams || {
        ball_speed_kmh: ballSpeed,
        spin_type: spinType,
        spin_rate_rpm: spinRate,
        pitch_type_modifier: pitchType,
        batter_intent: batterIntent,
      };

      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Simulation server returned a non-ok stream code.");
      }

      const parsed: CricAIScenario = await response.json();
      setScenario(parsed);

      // Sync slider state with loaded parameters for cohesion
      if (parsed.physics_parameters) {
        setBallSpeed(parsed.physics_parameters.ball_speed_kmh);
        setSpinType(parsed.physics_parameters.spin_type);
        setSpinRate(parsed.physics_parameters.spin_rate_rpm);
        setPitchType(parsed.physics_parameters.pitch_type_modifier);
        setBatterIntent(parsed.physics_parameters.batter_intent);
      }
    } catch (err: any) {
      console.error(err);
      setErrorString("Simulated backend failed to resolve parameters. Retrying soon.");
    } finally {
      setLoading(false);
    }
  };

  // Initial render simulation
  useEffect(() => {
    // Start with Shane Warne's classic ball highlight as primary visual showcase
    const defaultPreset = PRESET_SCENARIOS[2];
    runSimulation(defaultPreset.query, defaultPreset.parameters);
  }, []);

  // Load preset moment directly
  const handleLoadPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setCustomQuery(preset.query);
    setBallSpeed(preset.parameters.ball_speed_kmh);
    setSpinType(preset.parameters.spin_type);
    setSpinRate(preset.parameters.spin_rate_rpm);
    setPitchType(preset.parameters.pitch_type_modifier);
    setBatterIntent(preset.parameters.batter_intent);

    // Coordinate physical atmospherics and grain properties based on historical records
    if (preset.id === "warne-1993") {
      setGrassLevel(75);
      setPitchMoisture(45);
      setPitchCracks(15);
      setPitchDust(10);
      setBallOversUsed(1); // Standard brand new ball
      setBatWoodAgeMonths(12);
      setBatSweetSpot(95);
      setBatCracks(2);
      setAirHumidity(72);
      setWindSpeed(15);
      setWindDirection("North");
    } else if (preset.id === "dhoni-2011") {
      setGrassLevel(10);
      setPitchMoisture(12);
      setPitchCracks(55);
      setPitchDust(70);
      setBallOversUsed(44); // Old semi-soft cricket ball
      setBatWoodAgeMonths(6);
      setBatSweetSpot(99);
      setBatCracks(5);
      setAirHumidity(55);
      setWindSpeed(6);
      setWindDirection("East");
    } else if (preset.id === "stokes-2019" || preset.id === "legspin-theory") {
      setGrassLevel(12);
      setPitchMoisture(10);
      setPitchCracks(78);
      setPitchDust(82);
      setBallOversUsed(70); // Very old ball
      setBatWoodAgeMonths(16);
      setBatSweetSpot(82);
      setBatCracks(25);
      setAirHumidity(40);
      setWindSpeed(18);
      setWindDirection("South");
    } else if (preset.id === "kohli-2022") {
      setGrassLevel(25);
      setPitchMoisture(22);
      setPitchCracks(18);
      setPitchDust(8);
      setBallOversUsed(8); // Relatively shiny new ball
      setBatWoodAgeMonths(3);
      setBatSweetSpot(98);
      setBatCracks(1);
      setAirHumidity(64);
      setWindSpeed(12);
      setWindDirection("West");
    } else {
      // General standard defaults
      setGrassLevel(25);
      setPitchMoisture(25);
      setPitchCracks(20);
      setPitchDust(15);
      setBallOversUsed(15);
      setBatWoodAgeMonths(8);
      setBatSweetSpot(90);
    }

    runSimulation(preset.query, preset.parameters);
  };

  // Handle spin types rules: if SpinType is "None", reset Spin rate
  const handleSpinTypeToggle = (type: SpinType) => {
    setSpinType(type);
    if (type === "None") {
      setSpinRate(0);
    } else if (spinRate === 0) {
      setSpinRate(1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#030612] text-[#E4E6F0] flex flex-col font-sans relative antialiased leading-relaxed pb-16 selection:bg-[#FF4D00] selection:text-white overflow-x-hidden">
      
      {/* Visual background grids for scientific cockpit aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#07132a] via-[#030612] to-[#010309] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 opacity-45" />

      {/* Floating back fluid lighting accent layers */}
      <div className="absolute top-[-5%] left-[-10%] w-[700px] h-[700px] rounded-full bg-[#FF4D00]/[0.04] blur-[150px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[25%] right-[-15%] w-[600px] h-[600px] rounded-full bg-cyan-500/[0.03] blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-violet-500/[0.03] blur-[160px] pointer-events-none z-0" />

      {/* HEADER BAR */}
      <header className="border-b border-white/[0.08] bg-[#030612]/75 backdrop-blur-3xl sticky top-0 z-50 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        {/* Dynamic gloss highlight at the top of the header */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] liquid-shine-bar" />
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5.5 flex flex-col sm:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF6A00] to-[#FF4D00] flex items-center justify-center p-2.5 shrink-0 shadow-[0_0_28px_rgba(255,77,0,0.32)] border border-white/20">
              <Sparkles className="text-white w-full h-full stroke-[1.8]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-serif italic text-white tracking-tight font-semibold">
                  ThirdEye Sandbox
                </h1>
                <span className="text-[9px] bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/25 px-2.5 py-0.5 rounded-full font-mono font-black tracking-widest uppercase">
                  Physics Engine Active
                </span>
              </div>
              <p className="text-[#8E94B0] font-mono text-[9px] uppercase tracking-[0.22em] mt-0.5">
                Adaptive Cricket Trajectory Modeling System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shadow-[0_0_12px_#10B981]" />
              <span className="text-white font-mono text-[10px] tracking-wider uppercase font-bold text-white/90">
                Calculators Locked
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10 relative z-10 w-full grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CONTROLS & QUERY WORKSPACE (5 COLS) */}
        <section className="col-span-1 xl:col-span-5 flex flex-col gap-6.5">
          
          {/* TAB HEADERS (VisionOS-inspired rounded segment controller) */}
          <div className="liquid-glass p-1.5 rounded-2xl grid grid-cols-3 gap-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
            {/* Top glass bevel shine */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
            
            <button
              id="tab-presets"
              onClick={() => setActiveTab("presets")}
              className={`py-2 px-1 text-[10px] sm:text-xs font-mono uppercase tracking-widest rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${
                activeTab === "presets"
                  ? "bg-white/[0.12] text-white border border-white/10 shadow-[0_2px_12px_rgba(255,73,0,0.2)]"
                  : "text-[#8E94B0] hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <History className={`w-3.5 h-3.5 ${activeTab === "presets" ? "text-[#FF4D00]" : "text-[#8E94B0]"}`} />
              <span>PRESETS</span>
            </button>
            <button
              id="tab-sandbox"
              onClick={() => setActiveTab("sandbox")}
              className={`py-2 px-1 text-[10px] sm:text-xs font-mono uppercase tracking-widest rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${
                activeTab === "sandbox"
                  ? "bg-white/[0.12] text-white border border-white/10 shadow-[0_2px_12px_rgba(255,73,0,0.2)]"
                  : "text-[#8E94B0] hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <Sliders className={`w-3.5 h-3.5 ${activeTab === "sandbox" ? "text-[#FF4D00]" : "text-[#8E94B0]"}`} />
              <span>HAWKEYE</span>
            </button>
            <button
              id="tab-terminal"
              onClick={() => setActiveTab("terminal")}
              className={`py-2 px-1 text-[10px] sm:text-xs font-mono uppercase tracking-widest rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${
                activeTab === "terminal"
                  ? "bg-white/[0.12] text-white border border-white/10 shadow-[0_2px_12px_rgba(255,73,0,0.2)]"
                  : "text-[#8E94B0] hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeTab === "terminal" ? "text-[#FF4D00]" : "text-[#8E94B0]"}`} />
              <span>INQUIRY</span>
            </button>
          </div>

          {/* TAB CONTENT DYNAMIC SWITCHS (Luxury Liquid Glass card wrapper) */}
          <div className="liquid-glass-strong p-7.5 rounded-[2rem] min-h-[500px] flex flex-col justify-between relative overflow-hidden transition-all duration-500">
            {/* Soft Ambient glowing corner */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF4D00]/[0.03] rounded-full blur-[50px] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

            <div className="flex flex-col gap-5 flex-grow">
              {/* VIEW 1: PRESET HISTORICAL MOMENTS */}
              {activeTab === "presets" && (
                <div className="flex flex-col gap-4.5 flex-1">
                  <div className="flex items-center gap-2.5 mb-1 bg-white/[0.02] py-2 px-3.5 rounded-xl border border-white/[0.05]">
                    <History className="w-4 h-4 text-[#FF4D00]" />
                    <span className="text-[#FF4D00] text-[10px] font-mono font-bold tracking-widest uppercase">MOMENT ARCHIVE</span>
                  </div>
                  <p className="text-xs text-[#8E94B0] leading-relaxed">
                    Instantly project legendary cricket occurrences. The system will sync physics vectors to reconstruct the trajectory curves.
                  </p>

                  <div className="flex flex-col gap-3.5 mt-1.5">
                    {PRESET_SCENARIOS.map((p) => {
                      const isActive = scenario?.physics_parameters.ball_speed_kmh === p.parameters.ball_speed_kmh &&
                                       scenario?.physics_parameters.spin_type === p.parameters.spin_type;
                      
                      // Determine custom icon and theme based on iconType
                      const getIconMeta = (type: string) => {
                        switch (type) {
                          case "dhoni":
                            return { emoji: "🏏", color: "from-amber-500/15 to-amber-600/5", border: "border-amber-500/25", text: "text-amber-300", tag: "World Cup 2011" };
                          case "kohli":
                            return { emoji: "👑", color: "from-[#00D1FF]/15 to-blue-600/5", border: "border-[#00D1FF]/25", text: "text-[#00D1FF]", tag: "MCG Classic" };
                          case "warne":
                            return { emoji: "🌀", color: "from-purple-500/15 to-purple-600/5", border: "border-purple-500/25", text: "text-purple-300", tag: "Ball of the Century" };
                          case "stokes":
                            return { emoji: "🔥", color: "from-rose-500/15 to-rose-600/5", border: "border-rose-500/25", text: "text-rose-300", tag: "Headingley Heroics" };
                          default:
                            return { emoji: "🔬", color: "from-emerald-500/15 to-emerald-600/5", border: "border-emerald-500/25", text: "text-emerald-300", tag: "Trajectory Science" };
                        }
                      };

                      const meta = getIconMeta(p.iconType);

                      return (
                        <button
                          key={p.id}
                          onClick={() => handleLoadPreset(p)}
                          className={`text-left p-4.5 rounded-[1.25rem] border text-xs flex gap-4 transition-all duration-300 group relative overflow-hidden focus:outline-none cursor-pointer ${
                            isActive
                              ? "bg-white/[0.08] shadow-[0_12px_28px_rgba(255,77,0,0.15)] text-white glow-orange-border"
                              : "bg-white/[0.015] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.12] text-[#8E94B0] hover:translate-x-1"
                          }`}
                        >
                          {/* Left solid glowing active ribbon */}
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#FF6A00] to-[#FF4D00]" />
                          )}

                          {/* Gloss avatar */}
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.color} ${meta.border} border flex items-center justify-center text-xl shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                            {meta.emoji}
                          </div>

                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <div className="flex flex-wrap justify-between items-baseline gap-2">
                              <span className={`font-semibold text-xs tracking-wide transition-colors duration-200 truncate ${isActive ? "text-white" : "text-[#E4E6F0] group-hover:text-white"}`}>
                                {p.title}
                              </span>
                              <span className={`text-[9px] font-mono tracking-wider font-bold shrink-0 ${isActive ? "text-[#FF4D00]" : "text-[#8E94B0]"}`}>
                                {meta.tag}
                              </span>
                            </div>

                            <p className="text-[11px] text-[#A2A9C5] leading-relaxed line-clamp-1">
                              {p.description}
                            </p>

                            {/* Custom glass badges */}
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="font-mono text-[9px] px-2.5 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded-full text-white/80">
                                ⚡ {p.parameters.ball_speed_kmh} KM/H
                              </span>
                              <span className="font-mono text-[9px] px-2.5 py-0.5 bg-[#FF4D00]/5 border border-[#FF4D00]/15 rounded-full text-[#FF4D00]">
                                🌀 {p.parameters.spin_type}
                              </span>
                              <span className="font-mono text-[9px] px-2.5 py-0.5 bg-emerald-500/5 border border-emerald-500/15 rounded-full text-emerald-400">
                                🌱 {p.parameters.pitch_type_modifier}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* VIEW 2: HARDWARE SANDBOX SLIDER PANEL */}
              {activeTab === "sandbox" && (
                <div className="flex flex-col gap-5 flex-1 w-full">
                  <div className="flex items-center gap-2.5 mb-1 bg-white/[0.02] py-2 px-3.5 rounded-xl border border-white/[0.05]">
                    <Sliders className="w-4 h-4 text-[#FF4D00]" />
                    <span className="text-[#FF4D00] text-[10px] font-mono font-bold tracking-widest uppercase">HAWKEYE CONTROLS</span>
                  </div>

                  {/* Velocity Slider Card */}
                  <div className="flex flex-col gap-3 p-4.5 rounded-2xl bg-white/[0.025] border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.035]">
                    {/* Tiny high-tech bevel highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#D2D5E3]">
                        <Gauge className="w-4.5 h-4.5 text-[#FF4D00]" />
                        <span>Delivery Speed</span>
                      </div>
                      <span className="text-white text-xs font-bold font-mono px-3 py-1 rounded-full bg-[#FF4D00]/15 border border-[#FF4D00]/25 shadow-md flex items-center gap-1.5">
                        <span>{ballSpeed}</span>
                        <span className="text-[9px] text-[#8E94B0] font-normal">KM/H</span>
                      </span>
                    </div>
                    
                    <input
                      type="range"
                      min="80"
                      max="160"
                      value={ballSpeed}
                      onChange={(e) => setBallSpeed(parseInt(e.target.value))}
                      className="w-full h-1.5 cursor-pointer accent-[#FF4D00] focus:outline-none"
                    />
                    
                    <div className="flex items-center justify-between gap-1.5 mt-1">
                      <span className="text-[10px] font-mono text-[#8E94B0]">
                        {ballSpeed < 105 ? "◌ Spin Pace 🐢" : ballSpeed < 125 ? "◌ Medium Pace 🏏" : ballSpeed < 145 ? "◌ Fast Pace 🚀" : "⚡ Express Pace 🔥"}
                      </span>
                      <div className="flex items-center gap-1">
                        {([85, 115, 135, 155] as number[]).map((v) => (
                          <button
                            key={v}
                            onClick={() => setBallSpeed(v)}
                            className={`text-[9.5px] font-mono px-2 py-0.5 rounded border transition-all duration-200 cursor-pointer ${
                              ballSpeed === v
                                ? "bg-white/15 text-white border-white/25 shadow-sm"
                                : "bg-white/[0.015] text-[#8E94B0] border-transparent hover:bg-white/[0.06] hover:text-white"
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Spin Rate Slider Card */}
                  <div className="flex flex-col gap-3 p-4.5 rounded-2xl bg-white/[0.025] border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.035]">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#D2D5E3]">
                        <Activity className="w-4.5 h-4.5 text-[#FF4D00]" />
                        <span>Seam Rotation / Spin</span>
                      </div>
                      <span className={`${spinType === "None" ? "text-white/20 line-through bg-white/5 border border-white/5" : "text-white bg-[#FF4D00]/15 border border-[#FF4D00]/25"} text-xs font-bold font-mono px-3 py-1 rounded-full shadow-md flex items-center gap-1.5`}>
                        <span>{spinRate}</span>
                        <span className="text-[9px] text-[#8E94B0] font-normal">RPM</span>
                      </span>
                    </div>
                    
                    <input
                      type="range"
                      min="0"
                      max="2500"
                      disabled={spinType === "None"}
                      value={spinRate}
                      onChange={(e) => setSpinRate(parseInt(e.target.value))}
                      className="w-full h-1.5 cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed accent-[#FF4D00] focus:outline-none"
                    />
                    
                    <div className="flex items-center justify-between gap-1.5 mt-1">
                      <span className="text-[10px] font-mono text-[#8E94B0]">
                        {spinType === "None" ? "Rotation Suspended 🎯" : spinRate < 600 ? "◌ Low Revs Swing 🎯" : spinRate < 1600 ? "◌ Active Revs 🌪️" : "⚡ Extreme Over-Rip 🌀"}
                      </span>
                      {spinType !== "None" && (
                        <div className="flex items-center gap-1">
                          {([400, 1200, 1800, 2400] as number[]).map((v) => (
                            <button
                              key={v}
                              onClick={() => setSpinRate(v)}
                              className={`text-[9.5px] font-mono px-2 py-0.5 rounded border transition-all duration-200 cursor-pointer ${
                                spinRate === v
                                  ? "bg-white/15 text-white border-white/25 shadow-sm"
                                  : "bg-white/[0.015] text-[#8E94B0] border-transparent hover:bg-white/[0.06] hover:text-white"
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Spin / Swing Type Selector Grid */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#8E94B0] font-mono tracking-widest uppercase font-bold px-1">
                      <Wind className="w-3.5 h-3.5 text-[#FF4D00]" />
                      <span>Lateral Movement Type</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 bg-white/[0.015] p-1.5 rounded-2xl border border-white/[0.06]">
                      {([
                        { type: "None", label: "🎯 Flat" },
                        { type: "Swing-Only", label: "🍃 Swing" },
                        { type: "Off-Spin", label: "🌪️ Off" },
                        { type: "Leg-Spin", label: "🌀 Leg" },
                        { type: "Top-Spin", label: "🚀 Top" }
                      ]).map((opt) => (
                        <button
                          key={opt.type}
                          onClick={() => handleSpinTypeToggle(opt.type as SpinType)}
                          className={`py-2 px-0.5 rounded-xl text-[10px] font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                            spinType === opt.type
                              ? "bg-white/[0.12] text-white border-white/25 shadow-md scale-[1.03]"
                              : "text-[#8E94B0] border-transparent hover:text-white hover:bg-white/[0.03]"
                          }`}
                        >
                          <span className="text-base leading-none">{opt.label.split(" ")[0]}</span>
                          <span className="font-mono text-[9px] tracking-tight">{opt.label.split(" ")[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pitch surface Selector Grid */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#8E94B0] font-mono tracking-widest uppercase font-bold px-1">
                      <Layers className="w-3.5 h-3.5 text-[#FF4D00]" />
                      <span>Pitch Surface Preparation</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 bg-white/[0.015] p-1.5 rounded-2xl border border-white/[0.06]">
                      {([
                        { type: "Balanced", label: "⚖️ Standard" },
                        { type: "Green/Grassy", label: "🌱 Grassy" },
                        { type: "Dusty/Dry", label: "🏜️ Dusty" },
                        { type: "Concrete", label: "🧱 Concrete" },
                        { type: "Mud", label: "🌧️ Mud" }
                      ]).map((opt) => (
                        <button
                          key={opt.type}
                          onClick={() => setPitchType(opt.type as PitchType)}
                          className={`py-2 px-0.5 rounded-xl text-[10px] font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                            pitchType === opt.type
                              ? "bg-white/[0.12] text-white border-white/25 shadow-md scale-[1.03]"
                              : "text-[#8E94B0] border-transparent hover:text-white hover:bg-white/[0.03]"
                          }`}
                        >
                          <span className="text-base leading-none">{opt.label.split(" ")[0]}</span>
                          <span className="font-mono text-[9px] tracking-tight">{opt.label.split(" ")[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Batter Tactical Intent Selector */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#8E94B0] font-mono tracking-widest uppercase font-bold px-1">
                      <Swords className="w-3.5 h-3.5 text-[#FF4D00]" />
                      <span>Striker Tactical Stance</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 bg-white/[0.015] p-1.5 rounded-2xl border border-white/[0.06]">
                      {([
                        { type: "Defensive", label: "🛡️ Block" },
                        { type: "Balanced", label: "⚖️ Normal" },
                        { type: "Attacking", label: "🔥 Attack" },
                        { type: "Ultra-Attacking", label: "⚡ Smash" }
                      ]).map((opt) => (
                        <button
                          key={opt.type}
                          onClick={() => setBatterIntent(opt.type as BatterIntent)}
                          className={`py-2 px-0.5 rounded-xl text-[10px] font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                            batterIntent === opt.type
                              ? "bg-white/[0.12] text-white border-white/25 shadow-md scale-[1.03]"
                              : "text-[#8E94B0] border-transparent hover:text-white hover:bg-white/[0.03]"
                          }`}
                        >
                          <span className="text-base leading-none">{opt.label.split(" ")[0]}</span>
                          <span className="font-mono text-[9px] tracking-tight">{opt.label.split(" ")[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Tuning Expander Tag */}
                  <div className="mt-4 pt-4 border-t border-white/[0.04] flex flex-col gap-3">
                    <button
                      onClick={() => setShowAdvancedTuner(!showAdvancedTuner)}
                      className="w-full py-2.5 px-4 rounded-xl text-[9.5px] font-mono tracking-widest uppercase font-black text-center flex items-center justify-center gap-2 border bg-white/[0.015] border-white/[0.06] hover:bg-[#FF4D00]/10 hover:border-[#FF4D00]/30 hover:text-white transition-all duration-300 cursor-pointer"
                    >
                      <span>{showAdvancedTuner ? "⚙️ HALT CALIBRATION CONTROLS" : "⚙️ ENGAGE HIGH-FIDELITY PHYSICS TUNER"}</span>
                    </button>

                    <AnimatePresence>
                      {showAdvancedTuner && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-col gap-4 overflow-hidden pt-2"
                        >
                          {/* Part A: Pitch and Weather Atmospherics */}
                          <div className="p-4 bg-black/45 border border-white/[0.05] rounded-2xl flex flex-col gap-3">
                            <span className="text-[9px] font-mono text-[#FF4D00] font-bold uppercase tracking-wider">Desert / Deck Core Atmospherics</span>
                            
                            {/* Grass Slider */}
                            <div className="flex flex-col gap-1.5 text-xs text-[#D2D5E3]">
                              <div className="flex justify-between font-mono text-[10.5px]">
                                <span>Grass Coverage</span>
                                <span className="font-bold text-white">{grassLevel}%</span>
                              </div>
                              <input
                                type="range" min="0" max="100" value={grassLevel}
                                onChange={(e) => setGrassLevel(parseInt(e.target.value))}
                                className="w-full h-1 cursor-pointer accent-[#FF4D00]"
                              />
                            </div>

                            {/* Pitch Moisture Slider */}
                            <div className="flex flex-col gap-1.5 text-xs text-[#D2D5E3]">
                              <div className="flex justify-between font-mono text-[10.5px]">
                                <span>Pitch Moisture</span>
                                <span className="font-bold text-white">{pitchMoisture}%</span>
                              </div>
                              <input
                                type="range" min="0" max="100" value={pitchMoisture}
                                onChange={(e) => setPitchMoisture(parseInt(e.target.value))}
                                className="w-full h-1 cursor-pointer accent-[#FF4D00]"
                              />
                            </div>

                            {/* Pitch Cracks Slider */}
                            <div className="flex flex-col gap-1.5 text-xs text-[#D2D5E3]">
                              <div className="flex justify-between font-mono text-[10.5px]">
                                <span>Surface Fissure Cracks</span>
                                <span className="font-bold text-white">{pitchCracks}%</span>
                              </div>
                              <input
                                type="range" min="0" max="100" value={pitchCracks}
                                onChange={(e) => setPitchCracks(parseInt(e.target.value))}
                                className="w-full h-1 cursor-pointer accent-[#FF4D00]"
                              />
                            </div>

                            {/* Ambient Humidity */}
                            <div className="flex flex-col gap-1.5 text-xs text-[#D2D5E3]">
                              <div className="flex justify-between font-mono text-[10.5px]">
                                <span>Air Humidity</span>
                                <span className="font-bold text-white">{airHumidity}%</span>
                              </div>
                              <input
                                type="range" min="10" max="100" value={airHumidity}
                                onChange={(e) => setAirHumidity(parseInt(e.target.value))}
                                className="w-full h-1 cursor-pointer accent-blue-400"
                              />
                            </div>

                            {/* Wind Speed and Direction Selection */}
                            <div className="grid grid-cols-2 gap-2.5 pt-1.5 border-t border-white/[0.04]">
                              <div className="flex flex-col gap-1 text-[11px] font-mono text-[#D2D5E3]">
                                <span>Wind Speed</span>
                                <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-xl px-2 py-1">
                                  <input 
                                    type="number" min="0" max="50" value={windSpeed}
                                    onChange={(e) => setWindSpeed(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-full bg-transparent focus:outline-none text-white font-bold"
                                  />
                                  <span className="text-[9px] text-[#8E94B0]">KPH</span>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1 text-[11px] font-mono text-[#D2D5E3]">
                                <span>Wind Shear</span>
                                <select 
                                  value={windDirection}
                                  onChange={(e: any) => setWindDirection(e.target.value)}
                                  className="bg-black border border-white/[0.1] rounded-xl px-2 py-1 text-white text-[10.5px] cursor-pointer focus:outline-none focus:border-[#FF4D00]"
                                >
                                  <option value="None">None</option>
                                  <option value="North">North (Tailwind)</option>
                                  <option value="South">South (Headwind)</option>
                                  <option value="East">East (Cross-right)</option>
                                  <option value="West">West (Cross-left)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Part B: Ball Condition */}
                          <div className="p-4 bg-black/45 border border-white/[0.05] rounded-2xl flex flex-col gap-3">
                            <span className="text-[9px] font-mono text-[#FF4D00] font-bold uppercase tracking-wider">Ball Age & Roughness Spectrum</span>
                            
                            {/* Overs Used */}
                            <div className="flex flex-col gap-1.5 text-xs text-[#D2D5E3]">
                              <div className="flex justify-between font-mono text-[10.5px]">
                                <span>Laps / Overs Used</span>
                                <span className="font-bold text-white">{ballOversUsed} Overs</span>
                              </div>
                              <input
                                type="range" min="0" max="90" value={ballOversUsed}
                                onChange={(e) => setBallOversUsed(parseInt(e.target.value))}
                                className="w-full h-1 cursor-pointer accent-[#FF4D00]"
                              />
                            </div>

                            {/* Shine Side A vs Rough Side B */}
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#8E94B0] pt-1">
                              <div>
                                <span>Shine (Side A): <span className="text-white font-bold">{ballShineSideA}%</span></span>
                              </div>
                              <div className="text-right">
                                <span>Rough (Side B): <span className="text-white font-bold">{ballRoughnessSideB}%</span></span>
                              </div>
                            </div>
                          </div>

                          {/* Part C: Willow Performance Damage */}
                          <div className="p-4 bg-black/45 border border-white/[0.05] rounded-2xl flex flex-col gap-3">
                            <span className="text-[9px] font-mono text-[#FF4D00] font-bold uppercase tracking-wider">Willow Grain Performance</span>
                            
                            {/* Wood Age Slider */}
                            <div className="flex flex-col gap-1.5 text-xs text-[#D2D5E3]">
                              <div className="flex justify-between font-mono text-[10.5px]">
                                <span>Willow Age (Months)</span>
                                <span className="font-bold text-white">{batWoodAgeMonths} Mo.</span>
                              </div>
                              <input
                                type="range" min="1" max="48" value={batWoodAgeMonths}
                                onChange={(e) => setBatWoodAgeMonths(parseInt(e.target.value))}
                                className="w-full h-1 cursor-pointer accent-[#FF4D00]"
                              />
                            </div>

                            {/* Sweet spot state */}
                            <div className="flex flex-col gap-1.5 text-xs text-[#D2D5E3]">
                              <div className="flex justify-between font-mono text-[10.5px]">
                                <span>Sweet Spot Consistency</span>
                                <span className="font-bold text-white">{batSweetSpot}%</span>
                              </div>
                              <input
                                type="range" min="10" max="100" value={batSweetSpot}
                                onChange={(e) => setBatSweetSpot(parseInt(e.target.value))}
                                className="w-full h-1 cursor-pointer accent-emerald-400"
                              />
                            </div>

                            {/* Edge Damage state */}
                            <div className="flex flex-col gap-1.5 text-xs text-[#D2D5E3]">
                              <div className="flex justify-between font-mono text-[10.5px]">
                                <span>Boundary / Edge Crack Scatters</span>
                                <span className="font-bold text-white">{batEdgeDamage}%</span>
                              </div>
                              <input
                                type="range" min="0" max="100" value={batEdgeDamage}
                                onChange={(e) => setBatEdgeDamage(parseInt(e.target.value))}
                                className="w-full h-1 cursor-pointer accent-red-400"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* VIEW 3: PLAIN TEXT STRATEGIC TERMINAL ASK */}
              {activeTab === "terminal" && (
                <div className="flex flex-col gap-4.5 flex-1 w-full">
                  <div className="flex items-center gap-2.5 mb-1 bg-white/[0.02] py-2 px-3.5 rounded-xl border border-white/[0.05]">
                    <Sparkles className="w-4 h-4 text-[#FF4D00]" />
                    <span className="text-[#FF4D00] text-[10px] font-mono font-bold tracking-widest uppercase">STRATEGIC CHAT</span>
                  </div>
                  <p className="text-xs text-[#8E94B0] leading-relaxed">
                    Formulate customized physical combinations, extreme surface conditions, or query dynamic fielder adjustment rules.
                  </p>

                  <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                    <span className="text-[9px] text-[#8E94B0] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-[#FF4D00]" />
                      QUICK INQUIRY SUGGESTIONS
                    </span>
                    <div className="flex flex-col gap-2 mt-2.5">
                      {suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCustomQuery(s.query);
                            runSimulation(s.query);
                          }}
                          className="text-[10px] bg-white/[0.03] hover:bg-white/[0.08] px-3.5 py-2.5 rounded-xl border border-white/[0.06] hover:border-[#FF4D00]/30 hover:shadow-[0_4px_12px_rgba(255,100,0,0.08)] text-[#D2D5E3] font-mono transition-all duration-300 text-left cursor-pointer flex items-center gap-2.5"
                        >
                          <span className="text-[#FF4D00] text-xs">■</span>
                          <span className="truncate flex-1">{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-1">
                    <label className="text-[10px] text-[#8E94B0] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 px-1">
                      <Sliders className="w-3.5 h-3.5 text-[#FF4D00]" />
                      <span>CUSTOM SCENARIO PARAMETERS</span>
                    </label>
                    <textarea
                      id="custom-query-input"
                      rows={4}
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      placeholder="e.g. Mitchell Starc bowling 150km/h reverse swing on a grassy pitch with 4 slips and a gully."
                      className="w-full bg-[#04060f]/80 rounded-2xl border border-white/[0.1] focus:border-[#FF4D00]/50 p-4 text-xs text-white font-sans focus:outline-none placeholder:text-[#8E94B0]/40 resize-none transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* TRIGGER SIMULATION BOARD BUTTON (Futuristic high-tech HUD action handle) */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] relative">
              <button
                id="simulate-trigger"
                disabled={loading}
                onClick={() => {
                  const hasCustom = activeTab === "terminal" && customQuery;
                  runSimulation(hasCustom ? customQuery : undefined);
                }}
                className={`w-full py-4 px-5 rounded-2xl text-[10px] tracking-widest uppercase font-mono font-bold flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer ${
                  loading
                    ? "bg-[#040508]/40 text-[#70758A] border border-white/[0.05] cursor-not-allowed"
                    : "bg-gradient-to-r from-[#FF6A00] to-[#FF4D00] hover:opacity-95 text-white shadow-[0_12px_28px_rgba(255,77,0,0.3)] border border-white/[0.15] active:scale-[0.985] hover:scale-[1.01]"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>ORCHESTRATING TRAJECTORY...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white text-white" />
                    <span>RUN PHYSICS COMPUTATION</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* TRAJECTORY LAB DESCRIPTION INFORMATION */}
          <div className="liquid-glass p-5 flex flex-col gap-2 rounded-2xl border border-white/[0.1]">
            <div className="flex items-center gap-2 text-white font-semibold uppercase text-[10px] tracking-widest">
              <Info className="w-4 h-4 text-[#FF4D00]" />
              <span>Fluid Kinematics System</span>
            </div>
            <p className="font-mono text-[11.5px] text-[#8E94B0] leading-relaxed">
              ThirdEye computes kinetic curves based on boundary layer laminar airflow. It simulates friction loss, coefficient rebound multipliers (μ), bounce coordinates, and wicket threat assessment indices.
            </p>
          </div>

        </section>

        {/* RIGHT COLUMN: SIMULATOR & INSIGHTS DISPLAY (7 COLS) */}
        <section className="col-span-1 xl:col-span-7 flex flex-col gap-6.5">
          
          {loading && !scenario ? (
            /* DYNAMIC COSMIC GLASS LOADING GRID */
            <div className="liquid-glass py-32 flex flex-col items-center justify-center gap-5 text-center rounded-[2rem] relative overflow-hidden shadow-2xl min-h-[500px]">
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF4D00]/5 rounded-full blur-[40px] pointer-events-none" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF6A00] to-[#FF4D00] flex items-center justify-center p-3.5 shadow-[0_0_32px_rgba(255,73,0,0.45)] border border-white/20">
                <RefreshCw className="w-full h-full text-white animate-spin stroke-[2]" />
              </div>
              <div className="flex flex-col gap-1.5 px-6">
                <h3 className="text-white font-mono uppercase tracking-widest text-xs font-bold font-semibold">
                  Resolving ThirdEye Physics Scalars
                </h3>
                <p className="text-[11.5px] text-[#8E94B0] max-w-sm leading-relaxed">
                  Calibrating Magnus curve vectors, ground deformation ratios, and atmospheric friction scalars into simulated feedback.
                </p>
              </div>
            </div>
          ) : errorString ? (
            /* ERROR STATE CONTAINER */
            <div className="bg-[#1a060d]/75 backdrop-blur-3xl border border-rose-900/50 rounded-2xl p-8 flex items-start gap-4.5 text-rose-200 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-[4px] bg-rose-500" />
              <AlertTriangle className="w-6 h-6 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm tracking-wide">Mathematical System Interruption</h3>
                <p className="text-xs text-rose-300 mt-1.5 leading-relaxed">{errorString}</p>
                <button
                  onClick={() => runSimulation()}
                  className="mt-4 px-4.5 py-2 bg-rose-950/50 hover:bg-rose-900/40 transition-all border border-rose-800/45 rounded-xl text-xs text-rose-100 font-mono font-bold cursor-pointer"
                >
                  Force Reset Engine
                </button>
              </div>
            </div>
          ) : scenario ? (
            <div className="flex flex-col gap-7.5">

              {/* OVERVIEW CHIP CARD */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="liquid-glass duration-300 p-5 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex gap-4.5 items-start relative overflow-hidden"
              >
                {/* Visual marker */}
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#FF6A00] to-[#FF4D00]" />
                
                <div className="bg-[#FF4D00]/10 p-3 rounded-xl text-[#FF4D00] border border-[#FF4D00]/20 shrink-0 self-start">
                  <Compass className="w-5.5 h-5.5 animate-pulse" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] text-[#8E94B0] font-mono uppercase tracking-widest font-bold">
                    ThirdEye Neural Physics Summary
                  </span>
                  <p className="text-sm font-semibold text-white leading-relaxed font-sans mt-0.5">
                    {scenario.scenario_summary}
                  </p>
                </div>
              </motion.div>

              {/* DYNAMIC PITCH VECTOR TRAJECTORY VISUALIZER */}
              <PitchVisualizer
                ball_speed_kmh={ballSpeed}
                spin_type={spinType}
                spin_rate_rpm={spinRate}
                pitch_type_modifier={pitchType}
                total_deviation_cm={assessment ? parseFloat((assessment.swing.spinDeviationCm + assessment.swing.magnusForceDevCm).toFixed(1)) : scenario.calculated_metrics.total_deviation_cm}
                wicket_probability_percentage={assessment ? assessment.shotProbabilities.wicketProb : scenario.calculated_metrics.wicket_probability_percentage}
              />

              {/* CALCULATED PHYSICAL METRICS GRID BAR */}
              <div className="grid grid-cols-3 gap-4.5">
                
                {/* Stat block 1 */}
                <div className="liquid-glass hover:bg-white/[0.055] rounded-3xl p-5 flex flex-col items-center text-center justify-between gap-1 relative overflow-hidden shadow-lg transition-all duration-300 group hover:border-[#44D7B6]/30">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#44D7B6]/20 to-transparent" />
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#8E94B0] font-bold">
                    <TrendingUp className="w-4 h-4 text-[#44D7B6]" />
                    <span>Exit Velocity</span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-[#44D7B6] tracking-tight mt-1 px-1">
                    {assessment ? Math.round(ballSpeed * (assessment.bat.powerTransferEfficiency / 100) * (batterIntent === "Ultra-Attacking" ? 1.45 : batterIntent === "Attacking" ? 1.25 : batterIntent === "Defensive" ? 0.35 : 1)) : scenario.calculated_metrics.exit_velocity_kmh} <span className="text-xs font-sans text-[#8E94B0] font-normal">KM/H</span>
                  </span>
                  <div className="text-[9.5px] text-[#8E94B0] font-mono mt-0.5">
                    Based on <span className="text-white font-semibold">{batterIntent.toUpperCase()}</span> stance
                  </div>
                </div>

                {/* Stat block 2 */}
                <div className="liquid-glass hover:bg-white/[0.055] rounded-3xl p-5 flex flex-col items-center text-center justify-between gap-1 relative overflow-hidden shadow-lg transition-all duration-300 group hover:border-[#FF4D00]/30">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF4D00]/20 to-transparent" />
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#8E94B0] font-bold">
                    <Compass className="w-4 h-4 text-[#FF4D00]" />
                    <span>Spin Deviation</span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-[#FF4D00] tracking-tight mt-1 px-1">
                    {assessment ? (assessment.swing.spinDeviationCm > 0 ? "+" : "") + parseFloat(assessment.swing.spinDeviationCm.toFixed(1)) : (scenario.calculated_metrics.total_deviation_cm > 0 ? "+" : "") + scenario.calculated_metrics.total_deviation_cm} <span className="text-xs font-sans text-[#8E94B0] font-normal">CM</span>
                  </span>
                  <div className="text-[9.5px] text-[#8E94B0] font-mono mt-0.5">
                    Curve via <span className="text-white font-semibold">{spinType.split("-")[0].toUpperCase()}</span>
                  </div>
                </div>

                {/* Stat block 3 */}
                <div className="liquid-glass hover:bg-white/[0.055] rounded-3xl p-5 flex flex-col items-center text-center justify-between gap-1 relative overflow-hidden shadow-lg transition-all duration-300 group hover:border-rose-400/30">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rose-400/20 to-transparent" />
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#8E94B0] font-bold">
                    <Target className="w-4 h-4 text-rose-400" />
                    <span>Wicket Threat</span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-rose-400 tracking-tight mt-1 px-1">
                    {assessment ? assessment.shotProbabilities.wicketProb : scenario.calculated_metrics.wicket_probability_percentage}%
                  </span>
                  <div className="text-[9.5px] text-[#8E94B0] font-mono mt-0.5">
                    Striker safe coefficient
                  </div>
                </div>

              </div>

              {/* DYNAMIC FIELD MAP DISPLAYED WITH ADVICE HIGHLIGHTS */}
              <FieldMapVisualizer
                fielding_adjustments={assessment ? assessment.tactical.adjustments : scenario.ai_coach_insights.fielding_adjustments}
              />

              {/* ADVANCED COGNITIVE CRICKET PREDICTION COCKPIT */}
              <AIPredictionCockpit assessment={assessment} />

              {/* CRICAI STRATEGIC ASSESSMENT OUTLINE */}
              <div className="liquid-glass-strong rounded-[2rem] p-7 shadow-[0_24px_50px_rgba(0,0,0,0.6)] flex flex-col gap-5.5 relative overflow-hidden">
                {/* Accent neon background light */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF4D00]/10 rounded-full blur-[45px] pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                
                {/* Title */}
                <div className="flex items-center gap-3.5 border-b border-white/[0.1] pb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6A00]/20 to-[#FF4D00]/10 flex items-center justify-center text-[#FF4D00] border border-[#FF4D00]/25 shadow-md">
                    <Zap className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-sans font-bold text-white tracking-wide uppercase font-semibold">
                      Adaptive Coaching Instructions
                    </h4>
                    <p className="text-[9px] text-[#8E94B0] font-mono uppercase tracking-[0.18em]">Dynamic tactical assessment engine active</p>
                  </div>
                </div>

                {/* Tactical breakdown card */}
                <div className="bg-white/[0.015] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden flex flex-col gap-2.5 shadow-inner">
                  <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest text-[#FF4D00] font-bold">
                    <Wind className="w-4 h-4 text-[#FF4D00]" />
                    <span>Laminar Friction & Aerodynamic Drift</span>
                  </div>
                  <p className="text-xs text-[#D2D5E3] leading-relaxed font-sans">
                    {scenario.ai_coach_insights.tactical_breakdown}
                  </p>
                </div>

                {/* Counter Bowling advice */}
                <div className="bg-gradient-to-br from-[#FF4D00]/12 via-transparent to-transparent border border-white/[0.08] rounded-2xl p-5 self-stretch relative overflow-hidden shadow-2xl">
                  {/* Decorative glowing gradient borders */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF4D00]/40 to-transparent" />
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#FF4D00] font-bold mb-2 cursor-default">
                    <Flame className="w-4.5 h-4.5 text-[#FF4D00] animate-pulse" />
                    <span>Mastermind Positioning Overlay Strategy</span>
                  </div>
                  <p className="text-xs text-white leading-relaxed font-sans font-medium">
                    {scenario.ai_coach_insights.counter_strategy}
                  </p>
                </div>

              </div>

            </div>
          ) : null}

        </section>

      </main>
    </div>
  );
}
