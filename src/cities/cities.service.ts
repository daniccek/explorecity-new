import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { CreateCityDto } from './dto/create-city.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}
  
  findAll(): Promise<City[]> {
    return this.cityRepository.find({
      order: { name: 'ASC' },
    });
  }

  findById(id: number): Promise<City | null> {
    return this.cityRepository.findOne({
      where: { id },
      relations: ['places'],
    });
  }

  create(dto: CreateCityDto): Promise<City> {
    const city = this.cityRepository.create(dto);
    return this.cityRepository.save(city);
  }

  async remove(id: number): Promise<void> {
    await this.cityRepository.delete(id);
  }
}
