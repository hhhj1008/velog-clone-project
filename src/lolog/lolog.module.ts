import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';
import { PostLikeRepository } from 'src/repository/post-like.repository';
import { SeriesModule } from 'src/series/series.module';
import { LologController } from './lolog.controller';
import { LologService } from './lolog.service';

@Module({
  imports: [PostModule, SeriesModule, TypeOrmModule.forFeature([PostLikeRepository])],
  controllers: [LologController],
  providers: [LologService],
})
export class LologModule {}
