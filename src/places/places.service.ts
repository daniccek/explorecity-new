import { Injectable, NotFoundException } from '@nestjs/common';
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
    if (!city) throw new NotFoundException('City not found');

    const place = this.placeRepository.create({ ...dto, city });
    return this.placeRepository.save(place);
  }

  async delete(id: number) {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) throw new NotFoundException('Place not found');
    return this.placeRepository.remove(place);
  }

  findOne(id: number) {
    return this.placeRepository.findOne({
      where: { id },
      relations: ['comments', 'ratings'],
    });
  }
}
