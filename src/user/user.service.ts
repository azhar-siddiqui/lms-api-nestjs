import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from 'src/auth/dto/registerUser.dto';
import { User } from './schemas/user.schema';
import { UserRole } from './user.types';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(registerUserDto: RegisterUserDto) {
    return await this.userModel.create({
      fName: registerUserDto.fName,
      lName: registerUserDto.lName,
      email: registerUserDto.email,
      password: registerUserDto.password,
      role: UserRole.STUDENT,
    });
  }
}
