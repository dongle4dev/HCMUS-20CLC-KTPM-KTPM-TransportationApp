import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { TutorialService } from './tutorial.service';
import { Tutorial } from './schemas/tutorial.schema';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { IsObjectId } from 'src/utils/is-object-id.pipe';

@Controller('tutorial')
export class TutorialController {
  // Cài đặt service
  constructor(private tutorialService: TutorialService) {}


  @Get()
  async getAllTutorials(): Promise<Tutorial[]> {
    return this.tutorialService.findAll();
  }

  @Post()
  async createTutorial(
    @Body()
    tutorial: CreateTutorialDto,
  ): Promise<Tutorial> {
    return this.tutorialService.create(tutorial);
  }

  @Get('search')
  async findTutorialByAuthorAndView(
    @Query('author')
    author: string,
    @Query('min-view')
    minView: number,
  ): Promise<Tutorial[]> {
    return this.tutorialService.findByAuthorAndViews(author, minView);
  }

  @Get(':id')
  async findTutorialById(
    @Param('id', IsObjectId)
    id: string,
  ): Promise<Tutorial> {
    return this.tutorialService.findById(id);
  }

  
}
