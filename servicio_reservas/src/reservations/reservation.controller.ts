import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ReservationService, Reservation } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto): Promise<Reservation> {
    return this.reservationService.createReservation(createReservationDto);
  }

  @Get()
  async findAll(): Promise<Reservation[]> {
    return this.reservationService.getReservations();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Reservation | null> {
    return this.reservationService.getReservationById(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation | null> {
    return this.reservationService.updateReservation(id, updateReservationDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ deleted: boolean }> {
    const deleted = await this.reservationService.deleteReservation(id);
    return { deleted };
  }
}