// src/bot/bot.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config'; // Add this line
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class BotService {
  private subscribedUsers = new Set<number>();

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  subscribeUser(userId: number): void {
    this.subscribedUsers.add(userId);
  }

  unsubscribeUser(userId: number): void {
    this.subscribedUsers.delete(userId);
  }

  isUserSubscribed(userId: number): boolean {
    return this.subscribedUsers.has(userId);
  }

  async sendDailyWeatherUpdates(bot: TelegramBot): Promise<void> {
    const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const apiKey = this.configService.get<string>(
      '724ff323ad0b0c1a17ee1c755cdd7e92',
    );
    const city = 'New York'; // Replace with the desired city name

    try {
      const response = await this.httpService
        .get(weatherApiUrl, {
          params: {
            q: city,
            appid: apiKey,
            units: 'metric', // Use 'imperial' for Fahrenheit
          },
        })
        .toPromise();

      const weatherData = response.data;
      const weatherDescription = weatherData.weather[0].description;
      const temperature = weatherData.main.temp;
      const message = `Good morning! Here's the weather update for ${city}:\n${weatherDescription}, Temperature: ${temperature}°C.`;

      for (const userId of this.subscribedUsers) {
        await bot.sendMessage(userId, message);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }
}
