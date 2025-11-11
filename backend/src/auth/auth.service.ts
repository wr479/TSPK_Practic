import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TimingSafeEqual } from '../common/utils/timing-safe-equal';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly configService: ConfigService) {}

  validateAdminCredentials(username: string, password: string): boolean {
    const expectedUser = this.configService.get<string>('ADMIN_LOGIN');
    const expectedPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!expectedUser || !expectedPassword) {
      this.logger.warn('Админские учетные данные не настроены');
      return false;
    }

    const usernameMatch = TimingSafeEqual.compare(username, expectedUser);
    const passwordMatch = TimingSafeEqual.compare(password, expectedPassword);

    return usernameMatch && passwordMatch;
  }
}
