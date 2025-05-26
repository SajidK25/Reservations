import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Ime je obavezno.' })
  name: string;

  @IsEmail({}, { message: 'Email nije ispravan.' })
  email: string;

  @IsNotEmpty({ message: 'Lozinka je obavezna.' })
  @MinLength(6, { message: 'Lozinka mora imati barem 6 znakova.' })
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email nije ispravan.' })
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'Lozinka mora imati barem 6 znakova.' })
  password?: string;
}
