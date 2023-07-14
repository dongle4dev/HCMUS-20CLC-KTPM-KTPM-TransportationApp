import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tutorial } from './schemas/tutorial.schema';
import mongoose from 'mongoose';

@Injectable()
export class TutorialService {
  // Cài model để tương tác với MongoDB
  constructor(
    @InjectModel(Tutorial.name)
    private tutorialModel: mongoose.Model<Tutorial>,
  ) {}

  async findAll(): Promise<Tutorial[]> {
    const tutorials = await this.tutorialModel.find();
    return tutorials;
  }

  async findById(id: string): Promise<Tutorial> {
    const tutorial = await this.tutorialModel.findById(id);

    if (!tutorial) {
      throw new NotFoundException(`tutorial not found with id ${id}`);
    }

    return tutorial;
  }

  async findByAuthorAndViews(
    author: string,
    minView: number,
  ): Promise<Tutorial[]> {
    const tutorial = await this.tutorialModel
      .find()
      .where('author').equals(author)
      .where('view')
      .gt(minView);

    if (tutorial.length <= 0) {
      throw new NotFoundException(`tutorial not found`);
    }

    return tutorial;
  }

  async create(tutorial: Tutorial): Promise<Tutorial> {
    const created = await this.tutorialModel.create(tutorial);
    return created;
  }
}
