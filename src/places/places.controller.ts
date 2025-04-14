import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-places.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('city/:id')
  findByCity(@Param('id', ParseIntPipe) cityId: number) {
    return this.placesService.findByCity(cityId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const place = await this.placesService.findOne(id);
    if (!place) {
      throw new NotFoundException('Place not found');
    }
    return place;
  }

  @Post()
  create(@Body() dto: CreatePlaceDto) {
    return this.placesService.create(dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const place = await this.placesService.findOne(id);
    if (!place) {
      throw new NotFoundException('Place not found');
    }
    return this.placesService.delete(id);
  }
}
