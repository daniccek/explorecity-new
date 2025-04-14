import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comments.entity';
import { CreateCommentDto } from './dto/create-comments.dto';
import { Place } from '../places/entities/place.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
  ) {}

  async create(dto: CreateCommentDto) {
    const place = await this.placeRepository.findOneBy({ id: dto.placeId });
    if (!place) throw new Error('Place not found');

    const comment = this.commentRepository.create({
      ...dto,
      place,
      createdAt: new Date(),
    });

    return this.commentRepository.save(comment);
  }

  findByPlace(placeId: number) {
    return this.commentRepository.find({
      where: { place: { id: placeId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<Comment | null> {
    return this.commentRepository.findOneBy({ id });
  }

  delete(id: number) {
    return this.commentRepository.delete(id);
  }
}
