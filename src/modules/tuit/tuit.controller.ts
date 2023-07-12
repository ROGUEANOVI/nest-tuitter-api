import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TuitService } from './tuit.service';
import { CreateTuitDto, UpdateTuitDto, PaginationQueryDto } from './dto';

@Controller('tuit')
export class TuitController {
  constructor(private readonly tuitService: TuitService) {}

  @Get()
  getAllTuits(@Query() pagination: PaginationQueryDto) {
    return this.tuitService.getAllTuits(pagination);
  }

  @Get(':id')
  getTuitById(@Param('id', ParseIntPipe) id: number) {
    return this.tuitService.getTuitById(id);
  }

  @Post()
  addTuit(@Body() newTuit: CreateTuitDto) {
    return this.tuitService.createTuit(newTuit);
  }

  @Patch(':id')
  updateTuit(
    @Param('id', ParseIntPipe) id: number,
    @Body() tuit: UpdateTuitDto,
  ) {
    return this.tuitService.updateTuit(id, tuit);
  }

  @Delete(':id')
  deleteTuit(@Param('id', ParseIntPipe) id: number) {
    return this.tuitService.deleteTuit(id);
  }
}
