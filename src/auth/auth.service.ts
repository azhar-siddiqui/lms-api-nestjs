import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

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

    console.log('user', user);
    return { message: 'User created!', user };
  }
}
