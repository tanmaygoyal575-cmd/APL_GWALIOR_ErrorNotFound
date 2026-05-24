import { useState } from "react";
import { WeatherService, StadiumWeather, STADIUM_PRESETS } from "../services/weatherService";

export function useWeatherData() {
  const [selectedStadium, setSelectedStadium] = useState<string>("lords");
  const [currentWeather, setCurrentWeather] = useState<StadiumWeather>(STADIUM_PRESETS["lords"]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorWord, setErrorWord] = useState<string>("");

  const stadiumsList = WeatherService.getStadiumsList();

  const changeStadium = async (stadiumId: string) => {
    setLoading(true);
    setErrorWord("");
    const preset = WeatherService.getStadiumPreset(stadiumId);
    if (preset) {
      setSelectedStadium(stadiumId);
      setCurrentWeather(preset);

      // Attempt real-time OpenWeather fetch if possible matching the preset city coordinates
      const realTime = await WeatherService.fetchRealWeather(preset.city);
      if (realTime) {
        setCurrentWeather(prev => ({
          ...prev,
          temperature: realTime.temperature ?? prev.temperature,
          humidity: realTime.humidity ?? prev.humidity,
          windSpeed: realTime.windSpeed ?? prev.windSpeed,
          windDirection: realTime.windDirection ?? prev.windDirection,
          environmentalInfluence: realTime.environmentalInfluence 
            ? { ...prev.environmentalInfluence, ...realTime.environmentalInfluence }
            : prev.environmentalInfluence
        }));
      }
    } else {
      setErrorWord("Failed to load stadium details");
    }
    setLoading(false);
  };

  return {
    selectedStadium,
    currentWeather,
    stadiumsList,
    changeStadium,
    loading,
    errorWord
  };
}
export default useWeatherData;
