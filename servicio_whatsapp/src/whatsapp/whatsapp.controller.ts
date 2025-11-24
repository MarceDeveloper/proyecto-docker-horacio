import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('send')
  async sendMessage(@Body() body: { number: string; text: string }) {
    return this.whatsappService.sendMessage(body.number, body.text);
  }
}