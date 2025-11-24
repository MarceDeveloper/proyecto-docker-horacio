import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  // Asegúrate de que esta URL sea correcta (incluyendo la instancia)
  private readonly evolutionApiUrl = process.env.EVOLUTION_API_URL || 'https://automatica-evolution-api.ol1ump.easypanel.host/message/sendText/Automatica%20Bot';
  private readonly evolutionApiToken = process.env.EVOLUTION_API_TOKEN || '1247D016ED4B-4D60-952C-9BAC238F353F'; // Este es el valor de tu apikey

  async sendMessage(number: string, text: string): Promise<any> {
    try {
      const response = await axios.post(
        this.evolutionApiUrl,
        {
          number: number,
          text: text,
        },
        {
          headers: {
            'apikey': this.evolutionApiToken, // <--- ✅ CORRECCIÓN
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response ? error.response.data : error.message); // Mejor manejo de error
      throw error;
    }
  }
}