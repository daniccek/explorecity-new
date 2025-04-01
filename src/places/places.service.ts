import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-places.dto';
import { City } from '../cities/entities/city.entity';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  findByCity(cityId: number) {
    return this.placeRepository.find({
      where: { city: { id: cityId } },
      order: { name: 'ASC' },
      relations: ['city'],
    });
  }

  async create(dto: CreatePlaceDto) {
    const city = await this.cityRepository.findOneBy({ id: dto.cityId });
    if (!city) throw new Error('City not found');

    const place = this.placeRepository.create({
    ...dto,
  city,
  });
}

  async update(id: number, dto: CreatePlaceDto) {
    const city = await this.cityRepository.findOneBy({ id: dto.cityId });
    if (!city) throw new Error('City not found');

    return this.placeRepository.save({ id, ...dto, city });
  }

  delete(id: number) {
    return this.placeRepository.delete(id);
  }

  findOne(id: number) {
    return this.placeRepository.findOne({
      where: { id },
      relations: ['comments', 'ratings'],
    });
  }
}
