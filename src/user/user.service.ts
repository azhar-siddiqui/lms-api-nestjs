import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from 'src/auth/dto/registerUser.dto';
import { User } from './schemas/user.schema';
import { UserRole } from './user.types';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(registerUserDto: RegisterUserDto) {
    try {
      return await this.userModel.create({
        fName: registerUserDto.fName,
        lName: registerUserDto.lName,
        email: registerUserDto.email,
        password: registerUserDto.password,
        role: UserRole.STUDENT,
      });
    } catch (error) {
      const DUPLICATE_KEY_ERROR_CODE = 11000;
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === DUPLICATE_KEY_ERROR_CODE
      ) {
        // MongoServerError: E11000 duplicate key error collection...

        const mongoError = error as any; // or import { MongoServerError } from 'mongodb'

        // Most reliable way in recent versions
        const duplicatedField =
          Object.keys(mongoError.keyValue || {})[0] || 'field';
        // const duplicatedValue =
        //   mongoError.keyValue?.[duplicatedField] || 'value';

        throw new ConflictException(`${duplicatedField} already exists`);
      }

      throw error; // rethrow other unexpected errors
    }
  }

  async findUser(email: string) {
    try {
      // 1. Find user
      const user = await this.userModel.findOne({ email });
      return user;
    } catch (error) {
      console.log('Error in loginUser:', error);
      throw error; // rethrow other unexpected errors
    }
  }

  async findUserById(id: string) {
    try {
      return await this.userModel.findById({ _id: id }).select('-password');
    } catch (error) {
      console.log('Error in findUserById:', error);
      throw error; // rethrow other unexpected errors
    }
  }

  // async findOne(email: string) {
  //   return this.userModel.findOne({ email });
  // }
}
