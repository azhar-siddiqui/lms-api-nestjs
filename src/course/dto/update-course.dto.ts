import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsString } from 'class-validator';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  // @IsOptional()
  @IsString()
  name?: string;

  // @IsOptional()
  @IsString()
  description?: string;

  // @IsOptional()
  @IsString()
  level?: string;

  // @IsOptional()
  @IsNumber()
  price?: number;
}
