import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';
import { PostLikeRepository } from 'src/repository/post-like.repository';
import { PostTagRepository } from 'src/repository/post-tag.repository';
import { SeriesRepository } from 'src/repository/series.repository';
import { LologController } from './lolog.controller';
import { LologService } from './lolog.service';

@Module({
  imports: [
    PostModule,
    TypeOrmModule.forFeature([PostLikeRepository, PostTagRepository, SeriesRepository]),
  ],
  controllers: [LologController],
  providers: [LologService],
})
export class LologModule {}
