import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ApplicationType } from '../applications/entities/application.entity';

interface TelegramPayload {
  type: ApplicationType;
  fullName?: string;
  phone: string;
  email: string;
  city?: string;
  participationFormat?: string;
  companyName?: string;
  contactPerson?: string;
  tariff?: string;
  comment?: string;
  createdAt: string;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(private readonly configService: ConfigService) {}

  async notifyNewApplication(payload: TelegramPayload): Promise<void> {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    const chatIdsRaw = this.configService.get<string>('TELEGRAM_CHAT_IDS');

    if (!botToken || !chatIdsRaw) {
      this.logger.debug('Telegram уведомления отключены: не заданы токен или chat ids');
      return;
    }

    const chatIds = chatIdsRaw
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    if (!chatIds.length) {
      this.logger.warn('Telegram уведомления не отправлены: список chat ids пуст');
      return;
    }

    const message = this.composeMessage(payload);
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    await Promise.allSettled(
      chatIds.map((chatId) =>
        axios
          .post(apiUrl, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
          })
          .catch((error) => {
            this.logger.error(
              `Ошибка отправки сообщения Telegram в чат ${chatId}`,
              error?.response?.data ?? error.message,
            );
            throw error;
          }),
      ),
    );
  }

  private composeMessage({
    type,
    fullName,
    phone,
    email,
    city,
    participationFormat,
    companyName,
    contactPerson,
    tariff,
    comment,
    createdAt,
  }: TelegramPayload): string {
    const lines: string[] = [
      '<b>Новая заявка</b>',
      `Тип: ${type === ApplicationType.INDIVIDUAL ? 'Частное лицо' : 'Компания'}`,
      `Телефон: ${phone}`,
      `Email: ${email}`,
      `Создана: ${createdAt}`,
    ];

    if (fullName) {
      lines.push(`Имя: ${fullName}`);
    }

    if (city) {
      lines.push(`Город: ${city}`);
    }

    if (participationFormat) {
      lines.push(`Формат: ${participationFormat}`);
    }

    if (companyName) {
      lines.push(`Компания: ${companyName}`);
    }

    if (contactPerson) {
      lines.push(`Контактное лицо: ${contactPerson}`);
    }

    if (tariff) {
      lines.push(`Тариф: ${tariff}`);
    }

    if (comment) {
      lines.push(`Комментарий: ${comment}`);
    }

    return lines.join('\n');
  }
}
