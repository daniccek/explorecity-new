import {Controller,Get,Post, Body,Param, Delete, ParseIntPipe,NotFoundException,} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @Get('place/:placeId')
  findByPlace(@Param('placeId', ParseIntPipe) placeId: number) {
    return this.commentsService.findByPlace(placeId);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const comment = await this.commentsService.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    return this.commentsService.delete(id);
  }
}
