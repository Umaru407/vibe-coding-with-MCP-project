import { GoogleWeatherData } from "@/types/weather";
import {
  Cloud,
  Wind,
  Droplets,
  Eye,
  Gauge,
  ThermometerSun,
  Sun,
  CloudRain,
} from "lucide-react";

interface WeatherProps {
  weatherData: GoogleWeatherData;
}

const WeatherCard = ({ weatherData }: WeatherProps) => {
  const formatTime = (isoTime: string) => {
    return new Date(isoTime).toLocaleString("zh-TW", {
      timeZone: weatherData.timeZone.id,
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  const getWeatherIcon = () => {
    const type = weatherData.weatherCondition.type;
    if (type === "CLEAR") return <Sun className="h-10 w-10 text-yellow-400" />;
    if (type === "RAIN")
      return <CloudRain className="h-10 w-10 text-blue-400" />;
    return <Cloud className="h-10 w-10 text-gray-400" />;
  };

  return (
    <div className="mx-auto max-w-sm rounded-sm bg-blue-600 p-3">
      {/* 主要天氣卡片 */}
      <div className="mb-4 rounded-sm bg-white/10 p-4 text-white shadow-2xl backdrop-blur-lg">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-bold">{weatherData.cityName}</h1>
            <h1 className="mb-1 text-2xl font-bold">
              {weatherData.temperature.degrees}°C
            </h1>
            <p className="text-sm opacity-90">
              {weatherData.weatherCondition.description.text}
            </p>
            <p className="mt-1 text-sm opacity-75">
              體感溫度 {weatherData.feelsLikeTemperature.degrees}°C
            </p>
          </div>
          <div className="flex flex-col items-center">
            {getWeatherIcon()}
            <p className="mt-2 text-sm opacity-75">
              {formatTime(weatherData.currentTime)}
            </p>
          </div>
        </div>

        {/* 今日溫度範圍 */}
        <div className="flex items-center justify-between rounded-sm bg-white/10 p-3">
          <div className="flex-1 text-center">
            <p className="text-sm opacity-75">最高溫</p>
            <p className="text-lg font-bold">
              {weatherData.currentConditionsHistory.maxTemperature.degrees}°
            </p>
          </div>
          <div className="flex-1 border-x border-white/20 text-center">
            <p className="text-sm opacity-75">最低溫</p>
            <p className="text-lg font-bold">
              {weatherData.currentConditionsHistory.minTemperature.degrees}°
            </p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-sm opacity-75">變化</p>
            <p className="text-lg font-bold">
              {weatherData.currentConditionsHistory.temperatureChange.degrees >
              0
                ? "+"
                : ""}
              {weatherData.currentConditionsHistory.temperatureChange.degrees}°
            </p>
          </div>
        </div>
      </div>

      {/* 詳細資訊網格 */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {/* 風速 */}
        <div className="rounded-sm bg-white/10 p-3 text-white backdrop-blur-lg">
          <div className="mb-2 flex items-center">
            <Wind className="mr-2 h-4 w-4 text-blue-200" />
            <span className="text-sm opacity-75">風速</span>
          </div>
          <p className="text-lg font-bold">
            {weatherData.wind.speed.value} km/h
          </p>
          <p className="mt-1 text-xs opacity-75">
            {weatherData.wind.direction.cardinal}
          </p>
          <p className="text-xs opacity-75">
            陣風 {weatherData.wind.gust.value} km/h
          </p>
        </div>

        {/* 濕度 */}
        <div className="rounded-sm bg-white/10 p-3 text-white backdrop-blur-lg">
          <div className="mb-3 flex items-center">
            <Droplets className="mr-2 h-4 w-4 text-blue-200" />
            <span className="text-sm opacity-75">濕度</span>
          </div>
          <p className="text-lg font-bold">{weatherData.relativeHumidity}%</p>
          <p className="mt-1 text-xs opacity-75">
            露點 {weatherData.dewPoint.degrees}°C
          </p>
        </div>

        {/* 能見度 */}
        <div className="rounded-sm bg-white/10 p-6 text-white backdrop-blur-lg">
          <div className="mb-3 flex items-center">
            <Eye className="mr-2 h-4 w-4 text-blue-200" />
            <span className="text-sm opacity-75">能見度</span>
          </div>
          <p className="text-lg font-bold">
            {weatherData.visibility.distance} km
          </p>
          <p className="mt-1 text-xs opacity-75">極佳</p>
        </div>

        {/* 氣壓 */}
        <div className="rounded-sm bg-white/10 p-6 text-white backdrop-blur-lg">
          <div className="mb-3 flex items-center">
            <Gauge className="mr-2 h-4 w-4 text-blue-200" />
            <span className="text-sm opacity-75">氣壓</span>
          </div>
          <p className="text-lg font-bold">
            {weatherData.airPressure.meanSeaLevelMillibars.toFixed(0)}
          </p>
          <p className="mt-1 text-xs opacity-75">毫巴</p>
        </div>

        {/* UV指數 */}
        <div className="rounded-sm bg-white/10 p-6 text-white backdrop-blur-lg">
          <div className="mb-3 flex items-center">
            <ThermometerSun className="mr-2 h-4 w-4 text-blue-200" />
            <span className="text-sm opacity-75">UV 指數</span>
          </div>
          <p className="text-lg font-bold">{weatherData.uvIndex}</p>
          <p className="mt-1 text-xs opacity-75">低</p>
        </div>

        {/* 降雨機率 */}
        <div className="rounded-sm bg-white/10 p-6 text-white backdrop-blur-lg">
          <div className="mb-3 flex items-center">
            <CloudRain className="mr-2 h-4 w-4 text-blue-200" />
            <span className="text-sm opacity-75">降雨機率</span>
          </div>
          <p className="text-lg font-bold">
            {weatherData.precipitation.probability.percent}%
          </p>
          <p className="mt-1 text-xs opacity-75">無降雨</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
