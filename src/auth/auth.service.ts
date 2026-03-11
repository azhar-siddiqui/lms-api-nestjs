import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { RegisterUserDto } from './dto/registerUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    /**
     * 1. Check if the user already exists in the database
     * 2. Hash the user's password using bcrypt
     * 3. (optional) Generate a verification token and send a verification email to the user
     * 4. Save the user to the database
     * 5. Generate a JWT token for the user and return it in the response
     * 6. Return a success message or the created user object
     */
    const saultRounds = 10;
    const hashPassword = await bcrypt.hash(
      registerUserDto.password,
      saultRounds,
    );

    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hashPassword,
    });

    const payload = {
      sub: user._id,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(payload);

    return { accessToken: token };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    /**
     * 1. Check if the user exists in the database using the provided email
     * 2. If the user does not exist, return an error response indicating invalid credentials
     * 3. If the user exists, compare the provided password with the stored hashed password using bcrypt
     * 4. If the passwords do not match, return an error response indicating invalid credentials
     * 5. If the passwords match, generate a JWT token for the user and return it in the response
     * 6. Return a success message or the user object along with the token
     */

    // 1. Find user
    const user = await this.userService.findUser(email);

    // 2. User not found → same error message (prevents email enumeration)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4. Optional: check if user is active / verified / not locked
    // if (!user.isActive) {
    //   throw new UnauthorizedException('Account is inactive. Please verify your email.');
    // }

    const payload = {
      sub: user._id,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    return { accessToken: token };
  }
}
