import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './schema/course.schema';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async create(createCourseDto: CreateCourseDto) {
    try {
      return await this.courseModel.create({
        name: createCourseDto.name,
        description: createCourseDto.description,
        level: createCourseDto.level,
        price: createCourseDto.price,
      });
    } catch (error) {
      throw error; // rethrow other unexpected errors
    }
  }

  async findAll() {
    try {
      return await this.courseModel.find();
    } catch (error) {
      throw error; // rethrow other unexpected errors
    }
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid course ID format: ${id}`);
    }
    try {
      const course = await this.courseModel.findById({ _id: id }).exec();
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      return course;
    } catch (error) {
      throw error; // rethrow other unexpected errors
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid course ID format: ${id}`);
    }

    try {
      // const course = await this.courseModel.findById({ _id: id }).exec();
      // if (!course) {
      //   throw new NotFoundException(`Course with ID ${id} not found`);
      // }
      // Object.assign(course, updateCourseDto); // or use individual setters
      // return course.save();

      // Option B: atomic update (faster, but skips some Mongoose hooks)
      const updatedCourse = await this.courseModel
        .findByIdAndUpdate(id, updateCourseDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedCourse) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      return {
        message: 'Course updated successfully',
        course: updatedCourse,
      };
    } catch (error) {
      throw error; // rethrow other unexpected errors
    }
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid course ID format: ${id}`);
    }
    try {
      const deletedCourse = await this.courseModel
        .findByIdAndDelete({ _id: id })
        .exec();

      if (!deletedCourse) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      // You can return different shapes — this is clean & informative
      return {
        message: 'Course deleted successfully',
      };
    } catch (error) {
      throw error; // rethrow other unexpected errors
    }
  }
}
