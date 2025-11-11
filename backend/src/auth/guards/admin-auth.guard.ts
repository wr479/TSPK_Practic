import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization;

    if (!header || !header.startsWith('Basic ')) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    const encodedCredentials = header.replace('Basic ', '').trim();
    let decoded = '';

    try {
      decoded = Buffer.from(encodedCredentials, 'base64').toString('utf8');
    } catch {
      throw new UnauthorizedException('Неверный формат токена');
    }

    const [login, ...rest] = decoded.split(':');
    const password = rest.join(':');

    if (!login || !password) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const isValid = this.authService.validateAdminCredentials(login, password);

    if (!isValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    return true;
  }
}

