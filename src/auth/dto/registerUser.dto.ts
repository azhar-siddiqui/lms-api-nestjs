// import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  fName!: string;
  lName!: string;
  email!: string;
  password!: string;
}
