import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Place } from '../places/entities/place.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
  ) {}

  async create(dto: CreateRatingDto) {
    const place = await this.placeRepository.findOneBy({ id: dto.placeId });
    if (!place) throw new Error('Place not found');

    const rating = this.ratingRepository.create({
      ...dto,
      place,
    });

    return this.ratingRepository.save(rating);
  }

  findByPlace(placeId: number) {
    return this.ratingRepository.find({
      where: { place: { id: placeId } },
    });
  }
}
