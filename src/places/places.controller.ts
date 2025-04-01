import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-places.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('city/:id')
  findByCity(@Param('id') cityId: number) {
    return this.placesService.findByCity(cityId);
  }

  @Post()
  create(@Body() dto: CreatePlaceDto) {
    return this.placesService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: CreatePlaceDto) {
    return this.placesService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.placesService.delete(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.placesService.findOne(id);
  }
}
