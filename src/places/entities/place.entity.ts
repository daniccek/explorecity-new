import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { City } from '../../cities/entities/city.entity';
import { PlaceType } from '../../shared/enums/place-type.enum';
import { Comment } from '../../comments/entities/comments.entity';
import { Rating } from '../../ratings/entities/rating.entity';

@Entity()
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
d
  @Column()
  address: string;

  @Column({ type: 'enum', enum: PlaceType })
  type: PlaceType;

  @ManyToOne(() => City, (city) => city.places, { onDelete: 'CASCADE' })
  city: City;

  @OneToMany(() => Comment, (comment) => comment.place)
  comments: Comment[];

  @OneToMany(() => Rating, (rating) => rating.place)
  ratings: Rating[];

  @Column({ nullable: true })
  image: string;
}
