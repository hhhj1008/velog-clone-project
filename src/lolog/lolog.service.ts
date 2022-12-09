import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { PostLikeRepository } from 'src/repository/post-like.repository';
import { PaginationDto } from 'src/dto/pagination.dto';
import { User } from 'src/entity/user.entity';
import { PostTagRepository } from 'src/repository/post-tag.repository';
import { SeriesRepository } from 'src/repository/series.repository';

@Injectable()
export class LologService {
  constructor(
    private postService: PostService,
    private postLikeRepository: PostLikeRepository,
    private postTagRepository: PostTagRepository,
    private seriesRepository: SeriesRepository,
  ) {}

  async getLolog(user_id: number, pagination: PaginationDto, user?: User) {
    const posts = await this.postService.selectPostList(user_id, pagination, user);
    const tags = await this.postTagRepository.selectTagListByUserId(user_id);

    return { posts, tags };
  }

  async getSeries(user_id: number) {
    const series = await this.seriesRepository.selectSeriesList(user_id);
    return series;
  }

  async likePost(user_id: number, post_id: number) {
    const data = await this.postLikeRepository.getLikedPostOne(user_id, post_id);
    if (data) {
      throw new ConflictException('이미 좋아요 한 게시글 입니다');
    }
    await this.postLikeRepository.likePost(user_id, post_id);
  }

  async unlikePost(user_id: number, post_id: number) {
    const data = await this.postLikeRepository.getLikedPostOne(user_id, post_id);
    if (!data) {
      throw new NotFoundException('좋아요를 하지 않은 게시글입니다');
    }
    await this.postLikeRepository.unlikePost(user_id, post_id);
  }
}
