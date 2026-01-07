import { GoogleWeatherData } from "@/types/weather";
import { tool as createTool } from "ai";
import { z } from "zod";

async function geocodeCity(
  city: string,
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
      },
    );

    if (!response.ok) return null;

    const data = await response.json();

    console.log("geo", data);

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    };
  } catch {
    return null;
  }
}

export const weatherTool = createTool({
  description:
    "當使用者想要獲得天氣資訊，並提供座標或城市名稱，獲取某個地點的當前天氣。",
  inputSchema: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    city: z
      .string()
      .describe(
        "城市名稱 (e.g., 'taipei', 'new Taipei', 'taichung') 請使用英文",
      )
      .optional(),
  }),
  execute: async (input) => {
    let latitude: number;
    let longitude: number;

    if (input.city) {
      const coords = await geocodeCity(input.city);
      if (!coords) {
        throw new Error(
          `Could not find coordinates for "${input.city}". Please check the city name.`,
        );
      }
      latitude = coords.latitude;
      longitude = coords.longitude;
    } else if (input.latitude !== undefined && input.longitude !== undefined) {
      latitude = input.latitude;
      longitude = input.longitude;
    } else {
      throw new Error(
        "Please provide either a city name or both latitude and longitude coordinates.",
      );
    }

    const response = await fetch(
      `https://weather.googleapis.com/v1/currentConditions:lookup?key=${process.env.GOOGLE_API_KEY}&location.latitude=${latitude}&location.longitude=${longitude}&languageCode=zh-tw`,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch weather data. Status: ${response.status}`,
      );
    }

    const weatherData: GoogleWeatherData = await response.json();
    weatherData.cityName = input.city;

    return weatherData;
  },
});

export const tools = {
  displayWeather: weatherTool,
};
