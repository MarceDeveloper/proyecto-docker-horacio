import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { DatabaseModule } from '../database/database.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [DatabaseModule, WhatsappModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}