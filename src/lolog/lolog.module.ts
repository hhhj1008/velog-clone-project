import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';
import { PostLikeRepository } from 'src/repository/post-like.repository';
import { UserRepository } from 'src/repository/user.repository';
import { SeriesModule } from 'src/series/series.module';
import { LologController } from './lolog.controller';
import { LologService } from './lolog.service';

@Module({
  imports: [
    PostModule,
    SeriesModule,
    TypeOrmModule.forFeature([PostLikeRepository, UserRepository]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [LologController],
  providers: [LologService],
})
export class LologModule {}
