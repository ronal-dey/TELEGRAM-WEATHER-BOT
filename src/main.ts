// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import TelegramBot from 'node-telegram-bot-api';
import { BotService } from './bot/bot.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const botToken = 'YOUR_BOT_TOKEN'; // Replace with your bot token
  const apiMethod = 'sendMessage';
  const url = `https://api.telegram.org/bot${botToken}/${apiMethod}`;
  const bot = new TelegramBot(botToken, { polling: true });

  const botService = app.get(BotService);
  bot.onText(/\/subscribe/, (msg) => {
    const userId = msg.chat.id;
    botService.subscribeUser(userId);
    bot.sendMessage(userId, 'You have subscribed to daily weather updates.');
    console.log('URL:', url);
  });

  bot.onText(/\/unsubscribe/, (msg) => {
    const userId = msg.chat.id;
    botService.unsubscribeUser(userId);
    bot.sendMessage(
      userId,
      'You have unsubscribed from daily weather updates.',
    );
  });

  await app.listen(3000);
}
bootstrap();
