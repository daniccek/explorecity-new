import {Controller,Get,Post, Body, Param,ParseIntPipe,} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}


  @Post()
  create(@Body() dto: CreateRatingDto) {
    return this.ratingsService.create(dto);
  }

  @Get('place/:placeId')
  findByPlace(@Param('placeId', ParseIntPipe) placeId: number) {
    return this.ratingsService.findByPlace(placeId);
  }
}
