import {Controller,Get,Post,Body,Param,Delete,NotFoundException,ParseIntPipe,} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const city = await this.citiesService.findById(id);
    if (!city) {
      throw new NotFoundException('City not found');
    }
    return city;
  }

  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const city = await this.citiesService.findById(id);
    if (!city) {
      throw new NotFoundException('City not found');
    }
    await this.citiesService.remove(id);
    return { message: 'City deleted successfully' };
  }
}
