import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../user.types';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fName!: string;

  @Prop({ required: true })
  lName!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Exclude()
  @Prop({ required: true })
  password!: string;

  @Prop({ enum: UserRole, default: UserRole.STUDENT })
  role!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
