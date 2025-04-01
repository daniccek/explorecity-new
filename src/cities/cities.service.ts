import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { CreateCityDto } from './dto/create-city.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  findAll(): Promise<City[]> {
    return this.cityRepository.find({ order: { name: 'ASC' } });
  }

  create(dto: CreateCityDto): Promise<City> {
    const city = this.cityRepository.create(dto);
    return this.cityRepository.save(city);
  }
}
