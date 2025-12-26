import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Sun, CloudRain, CloudSnow, Wind } from "lucide-react";

interface WeatherProps {
  data: {
    weather: string;
    temperature: number;
    location: string;
  };
}

export function WeatherCard({ data }: WeatherProps) {
  const { weather, temperature, location } = data;

  const getWeatherIcon = (weather: string) => {
    switch (weather.toLowerCase()) {
      case "sunny":
        return <Sun className="h-10 w-10 text-yellow-500" />;
      case "cloudy":
        return <CloudSun className="h-10 w-10 text-gray-500" />;
      case "rainy":
        return <CloudRain className="h-10 w-10 text-blue-500" />;
      case "snowy":
        return <CloudSnow className="h-10 w-10 text-blue-300" />;
      default:
        return <Sun className="h-10 w-10 text-yellow-500" />;
    }
  };

  return (
    <Card className="w-full max-w-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 border-none shadow-lg overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-lg font-medium text-slate-700 dark:text-slate-200">
          <span>{location}</span>
          <Wind className="h-5 w-5 text-slate-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between py-4">
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">
              {temperature}°
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">
              {weather}
            </span>
          </div>
          <div className="bg-white/50 dark:bg-slate-700/50 p-4 rounded-full shadow-inner">
            {getWeatherIcon(weather)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
