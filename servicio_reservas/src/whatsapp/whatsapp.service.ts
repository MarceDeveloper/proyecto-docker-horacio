import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private readonly whatsappServiceUrl = process.env.WHATSAPP_SERVICE_URL || 'http://servicio_whatsapp:3001';

  async sendMessage(number: string, text: string): Promise<any> {
    try {
      const response = await axios.post(`${this.whatsappServiceUrl}/whatsapp/send`, {
        number,
        text,
      });

      return response.data;
    } catch (error) {
      console.error('Error calling WhatsApp service:', error);
      // Don't throw error to avoid breaking reservation flow
      return { error: 'Failed to send WhatsApp message' };
    }
  }
}