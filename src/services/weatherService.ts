export interface StadiumWeather {
  stadiumName: string;
  city: string;
  country: string;
  temperature: number;      // Celsius
  humidity: number;         // %
  windSpeed: number;        // km/h
  windDirection: "North" | "South" | "East" | "West" | "None";
  dewFactor: number;        // 0-100% chance of slick outfield
  environmentalInfluence: {
    swingModifier: number;     // e.g. 1.25 multiplier
    reverseSwingAileron: number; // e.g. 0.90
    pitchDryRate: number;      // e.g. 1.10
    spinGripRatio: number;     // e.g. 0.95
  };
  recommendation: string;
}

export const STADIUM_PRESETS: Record<string, StadiumWeather> = {
  "lords": {
    stadiumName: "Lord's Cricket Ground",
    city: "London",
    country: "United Kingdom",
    temperature: 17,
    humidity: 82,
    windSpeed: 18,
    windDirection: "North",
    dewFactor: 15,
    environmentalInfluence: {
      swingModifier: 1.45,       // high humidity and cold air creates major swing
      reverseSwingAileron: 0.50, // damp green outfield prevents reverse
      pitchDryRate: 0.60,        // slow drying
      spinGripRatio: 0.90
    },
    recommendation: "Overcast cloud cover and heavy atmospheric humidity will trigger radical late aerial swing. Bowl full lengths in the corridor."
  },
  "mcg": {
    stadiumName: "Melbourne Cricket Ground",
    city: "Melbourne",
    country: "Australia",
    temperature: 19,
    humidity: 55,
    windSpeed: 24,
    windDirection: "West",
    dewFactor: 10,
    environmentalInfluence: {
      swingModifier: 1.10,
      reverseSwingAileron: 1.15, // abrasive turf scuffs ball
      pitchDryRate: 1.20,        // fast drying
      spinGripRatio: 1.05
    },
    recommendation: "Substantial crosswinds will cause lateral drift prior to pitch landing. Use bouncers to leverage the steep stadium clay carry."
  },
  "wankhede": {
    stadiumName: "Wankhede Stadium",
    city: "Mumbai",
    country: "India",
    temperature: 31,
    humidity: 72,
    windSpeed: 12,
    windDirection: "South",
    dewFactor: 60, // Heavy evening dew on coastal ground
    environmentalInfluence: {
      swingModifier: 0.95,
      reverseSwingAileron: 0.80,
      pitchDryRate: 1.15,
      spinGripRatio: 0.70        // moisture wets the ball, making it slip
    },
    recommendation: "Heavy coastal dew active. The ball will become wet and slippery, making spin grip difficult. Bowlers should wipe the seam frequently."
  },
  "eden-gardens": {
    stadiumName: "Eden Gardens",
    city: "Kolkata",
    country: "India",
    temperature: 29,
    humidity: 68,
    windSpeed: 10,
    windDirection: "East",
    dewFactor: 45,
    environmentalInfluence: {
      swingModifier: 1.05,
      reverseSwingAileron: 1.00,
      pitchDryRate: 1.05,
      spinGripRatio: 0.88
    },
    recommendation: "Moderate damp evening factor. Spinners will require clean dry towels. Expect dry afternoon soil to assist off-break grip initially."
  },
  "gabba": {
    stadiumName: "The Gabba",
    city: "Brisbane",
    country: "Australia",
    temperature: 26,
    humidity: 48,
    windSpeed: 16,
    windDirection: "South",
    dewFactor: 5,
    environmentalInfluence: {
      swingModifier: 1.00,
      reverseSwingAileron: 1.30, // extremely hot dry deck
      pitchDryRate: 1.40,
      spinGripRatio: 1.10
    },
    recommendation: "A highly abrasive and dry out-dirt zone. Outstanding reverse swing potential is expected past 35 overs. Target the tail on the pads."
  }
};

class WeatherIntelligenceService {
  public getStadiumPreset(id: string): StadiumWeather | undefined {
    return STADIUM_PRESETS[id];
  }

  public getStadiumsList() {
    return Object.entries(STADIUM_PRESETS).map(([key, value]) => ({
      id: key,
      stadiumName: value.stadiumName,
      city: value.city,
      country: value.country
    }));
  }

  /**
   * Calculates specific physics modifiers derived from real/simulated climate metrics.
   */
  public calculateClimateModifiers(temperature: number, humidity: number, windSpeed: number) {
    // Standard humidity swing threshold: humidity > 70% enhances air viscosity & laminar drift
    const swingModifier = parseFloat(Math.max(0.7, Math.min(1.6, 1.0 + (humidity - 50) * 0.01 + (22 - temperature) * 0.005)).toFixed(2));
    
    // Abrasive friction dry-out rate: high temperature dry air accelerates hydration loss
    const pitchDryRate = parseFloat(Math.max(0.5, Math.min(2.0, 1.0 + (temperature - 25) * 0.03 - (humidity - 50) * 0.01)).toFixed(2));
    
    // Ball reverse swing speed: hot dry temperatures and hard soil scuff ball
    const reverseSwingAileron = parseFloat(Math.max(0.4, Math.min(1.8, 1.0 + (temperature - 22) * 0.02 - (humidity - 40) * 0.008)).toFixed(2));

    // Spin grip ratio
    const spinGripRatio = parseFloat(Math.max(0.6, Math.min(1.3, 1.1 - (humidity > 70 ? (humidity - 70) * 0.012 : 0))).toFixed(2));

    return {
      swingModifier,
      pitchDryRate,
      reverseSwingAileron,
      spinGripRatio
    };
  }

  /**
   * Pull real-world city location weather from OpenWeather if key is available
   */
  public async fetchRealWeather(city: string): Promise<Partial<StadiumWeather> | null> {
    const key = process.env.OPENWEATHER_API_KEY;
    if (key) {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`);
        if (res.ok) {
          const apiData = await res.json();
          const temp = apiData.main.temp;
          const hum = apiData.main.humidity;
          const ws = Math.round((apiData.wind?.speed || 0) * 3.6); // m/s to km/h
          const deg = apiData.wind?.deg || 0;
          
          let dir: "North" | "South" | "East" | "West" | "None" = "None";
          if (deg >= 315 || deg < 45) dir = "North";
          else if (deg >= 45 && deg < 135) dir = "East";
          else if (deg >= 135 && deg < 225) dir = "South";
          else if (deg >= 225 && deg < 315) dir = "West";

          const mods = this.calculateClimateModifiers(temp, hum, ws);

          return {
            temperature: temp,
            humidity: hum,
            windSpeed: ws,
            windDirection: dir,
            environmentalInfluence: {
              swingModifier: mods.swingModifier,
              reverseSwingAileron: mods.reverseSwingAileron,
              pitchDryRate: mods.pitchDryRate,
              spinGripRatio: mods.spinGripRatio
            }
          };
        }
      } catch (e) {
        console.error("OpenWeather API query error. Falling back to simulated stadium.", e);
      }
    }
    return null;
  }
}

export const WeatherService = new WeatherIntelligenceService();
export default WeatherService;
