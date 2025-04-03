import { IsNotEmpty, IsString, IsDateString, IsInt } from 'class-validator';

export class CreateReservationDto {
    @IsInt()
    spaceId: number;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endTime: string;
}
