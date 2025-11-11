import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AdminAuthGuard } from './guards/admin-auth.guard';

@Module({
  imports: [ConfigModule],
  providers: [AuthService, AdminAuthGuard],
  exports: [AuthService, AdminAuthGuard],
})
export class AuthModule {}
