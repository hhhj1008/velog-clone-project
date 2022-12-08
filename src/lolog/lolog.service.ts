import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { SeriesService } from 'src/series/series.service';
import { PostLikeRepository } from 'src/repository/post-like.repository';
import { PaginationDto } from 'src/dto/pagination.dto';
import { User } from 'src/entity/user.entity';
import { PostTagRepository } from 'src/repository/post-tag.repository';
import { UserRepository } from 'src/repository/user.repository';

@Injectable()
export class LologService {
  constructor(
    private postService: PostService,
    private seriesService: SeriesService,
    private postLikeRepository: PostLikeRepository,
    private postTagRepository: PostTagRepository,
    private userRepository: UserRepository,
  ) {}

  async getLolog(user_id: number, pagination: PaginationDto, user?: User) {
    const posts = await this.postService.selectPostList(user_id, pagination, user);
    const tags = await this.postTagRepository.selectTagListByUserId(user_id);

    return { posts, tags };
  }

  async getSeries(user_id: number) {
    const series = await this.seriesService.selectSeriesList(user_id);
    return series;
  }

  async getAboutBlog(user_id: number, user?: User) {
    let login_user_id = -1;

    if (user != null) {
      login_user_id = user['sub'];
    }
    const about = await this.userRepository.selectAboutBlog(user_id, login_user_id);
    return about[0];
  }

  async editAboutBlog(about_blog: string, user: User) {
    await this.userRepository.updateAboutBlog(user.id, about_blog);

    return await this.getAboutBlog(user.id);
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
