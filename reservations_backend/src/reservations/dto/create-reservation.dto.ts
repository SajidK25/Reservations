import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateReservationDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsInt()
  spaceId: number;

  @IsString()
  request: string;

  @IsString()
  title: string;
}
