import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Neispravan email ili lozinka.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Neispravan email ili lozinka.');
    }

    const payload = { sub: user.id, email: user.email };

    try {
      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'tajna123',
      });

      return { access_token: token };
    } catch (err) {
      throw new InternalServerErrorException('Greška kod generiranja tokena.');
    }
  }

  async register(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new BadRequestException('Ime, email i lozinka su obavezni.');
    }

    try {
      const existing = await this.usersService.findByEmail(email);
      if (existing) {
        throw new BadRequestException('Korisnik s tim emailom već postoji.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.usersService.create(
        name,
        email,
        hashedPassword,
      );

      // Vrati bez lozinke
      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (err: any) {
      // Proslijedi postojeće HttpExceptions (BadRequest/Conflict)
      if (err?.status && err?.message) {
        throw err;
      }
      console.error('Greška kod registracije:', err);
      throw new InternalServerErrorException('Registracija nije uspjela.');
    }
  }
}
