import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ReservationModule } from './reservations/reservation.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [DatabaseModule, ReservationModule, WhatsappModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
