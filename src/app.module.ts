import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL!),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
