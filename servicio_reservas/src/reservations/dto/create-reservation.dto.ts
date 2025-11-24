import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  space_name: string;

  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;
}