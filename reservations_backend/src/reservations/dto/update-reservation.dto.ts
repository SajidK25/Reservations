import { IsNotEmpty, IsString, IsDateString, IsInt } from 'class-validator';

export class UpdateReservationDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsInt()
  space_id: number;

  @IsString()
  request: string;

  @IsString()
  title: string;
}