// TypeScript 型別定義
export interface GoogleWeatherData {
  cityName?: string;
  currentTime: string;
  timeZone: {
    id: string;
  };
  isDaytime: boolean;
  weatherCondition: {
    iconBaseUri: string;
    description: {
      text: string;
      languageCode: string;
    };
    type: string;
  };
  temperature: {
    degrees: number;
    unit: string;
  };
  feelsLikeTemperature: {
    degrees: number;
    unit: string;
  };
  dewPoint: {
    degrees: number;
    unit: string;
  };
  heatIndex?: {
    degrees: number;
    unit: string;
  };
  windChill?: {
    degrees: number;
    unit: string;
  };
  relativeHumidity: number;
  uvIndex: number;
  precipitation: {
    probability: {
      percent: number;
      type: string;
    };
    qpf: {
      quantity: number;
      unit: string;
    };
  };
  thunderstormProbability?: number;
  airPressure: {
    meanSeaLevelMillibars: number;
  };
  wind: {
    direction: {
      degrees: number;
      cardinal: string;
    };
    speed: {
      value: number;
      unit: string;
    };
    gust: {
      value: number;
      unit: string;
    };
  };
  visibility: {
    distance: number;
    unit: string;
  };
  cloudCover: number;
  currentConditionsHistory: {
    temperatureChange: {
      degrees: number;
      unit: string;
    };
    maxTemperature: {
      degrees: number;
      unit: string;
    };
    minTemperature: {
      degrees: number;
      unit: string;
    };
    qpf: {
      quantity: number;
      unit: string;
    };
  };
}
