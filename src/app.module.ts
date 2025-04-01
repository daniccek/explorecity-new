import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesModule } from './cities/cities.module';
import { PlacesModule } from './places/places.module';
import { CommentsModule } from './comments/comments.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'explorecity',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CitiesModule,
    PlacesModule,
    CommentsModule,
    RatingsModule,
  ],
})
export class AppModule {}
