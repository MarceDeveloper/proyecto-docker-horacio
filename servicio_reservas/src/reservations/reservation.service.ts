import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

export interface Reservation {
  id?: number;
  space_name: string;
  user_name: string;
  start_time: string;
  end_time: string;
}

@Injectable()
export class ReservationService {
  constructor(
    private dbService: DatabaseService,
    private whatsappService: WhatsappService,
  ) {}

  async checkTimeConflict(spaceName: string, startTime: string, endTime: string, excludeId?: number): Promise<boolean> {
    const excludeCondition = excludeId ? ' AND id != $4' : '';
    const query = `
      SELECT COUNT(*) as count
      FROM reservations
      WHERE space_name = $1
        AND (
          (start_time <= $2 AND end_time > $2) OR
          (start_time < $3 AND end_time >= $3) OR
          (start_time >= $2 AND end_time <= $3)
        )${excludeCondition}
    `;

    const values = excludeId
      ? [spaceName, startTime, endTime, excludeId]
      : [spaceName, startTime, endTime];

    const result = await this.dbService.query(query, values);
    return parseInt(result.rows[0].count) > 0;
  }

  async createReservation(reservation: Omit<Reservation, 'id'>): Promise<Reservation> {
    // Check for time conflicts
    const hasConflict = await this.checkTimeConflict(
      reservation.space_name,
      reservation.start_time,
      reservation.end_time
    );

    if (hasConflict) {
      throw new BadRequestException(`El espacio "${reservation.space_name}" ya está reservado en el horario solicitado`);
    }

    const query = `
      INSERT INTO reservations (space_name, user_name, start_time, end_time)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [reservation.space_name, reservation.user_name, reservation.start_time, reservation.end_time];
    const result = await this.dbService.query(query, values);
    const createdReservation = result.rows[0];

    // Send WhatsApp notification
    const message = `Nueva reserva creada:\nEspacio: ${reservation.space_name}\nUsuario: ${reservation.user_name}\nInicio: ${reservation.start_time}\nFin: ${reservation.end_time}`;
    await this.whatsappService.sendMessage(process.env.WHATSAPP_RECIPIENT || '+59165811806', message);

    return createdReservation;
  }

  async getReservations(): Promise<Reservation[]> {
    const query = 'SELECT * FROM reservations ORDER BY start_time';
    const result = await this.dbService.query(query);
    return result.rows;
  }

  async getReservationById(id: number): Promise<Reservation | null> {
    const query = 'SELECT * FROM reservations WHERE id = $1';
    const result = await this.dbService.query(query, [id]);
    return result.rows[0] || null;
  }

  async updateReservation(id: number, reservation: Partial<Reservation>): Promise<Reservation | null> {
    // Get current reservation first
    const currentReservation = await this.getReservationById(id);
    if (!currentReservation) {
      return null;
    }

    // Merge updates with current data
    const updatedData = { ...currentReservation, ...reservation };

    // Check for time conflicts if time fields are being updated
    if (reservation.start_time || reservation.end_time || reservation.space_name) {
      const spaceName = reservation.space_name || currentReservation.space_name;
      const startTime = reservation.start_time || currentReservation.start_time;
      const endTime = reservation.end_time || currentReservation.end_time;

      const hasConflict = await this.checkTimeConflict(spaceName, startTime, endTime, id);

      if (hasConflict) {
        throw new BadRequestException(`El espacio "${spaceName}" ya está reservado en el horario solicitado`);
      }
    }

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (reservation.space_name) {
      fields.push(`space_name = $${paramIndex++}`);
      values.push(reservation.space_name);
    }
    if (reservation.user_name) {
      fields.push(`user_name = $${paramIndex++}`);
      values.push(reservation.user_name);
    }
    if (reservation.start_time) {
      fields.push(`start_time = $${paramIndex++}`);
      values.push(reservation.start_time);
    }
    if (reservation.end_time) {
      fields.push(`end_time = $${paramIndex++}`);
      values.push(reservation.end_time);
    }

    if (fields.length === 0) return currentReservation;

    const query = `UPDATE reservations SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    values.push(id);

    const result = await this.dbService.query(query, values);
    return result.rows[0] || null;
  }

  async deleteReservation(id: number): Promise<boolean> {
    const query = 'DELETE FROM reservations WHERE id = $1';
    const result = await this.dbService.query(query, [id]);
    return result.rowCount > 0;
  }
}