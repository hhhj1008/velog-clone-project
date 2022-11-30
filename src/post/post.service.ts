import { Injectable } from '@nestjs/common';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { UpdatePostDto } from 'src/dto/post/update-post.dto';
import { User } from 'src/entity/user.entity';
import { PostRepository } from 'src/repository/post.repository';
import { SeriesService } from 'src/series/series.service';
import { TagService } from 'src/tag/tag.service';
import { getImageURL, deleteImageFile } from 'src/lib/multerOptions';
import { PaginationDto } from 'src/dto/pagination.dto';
import { CommentService } from 'src/comment/comment.service';

/**
 * @todo 게시글 삭제 시에 tag 테이블의 post_count 관련 기능은 추후 구현할 예정..
 * -> 현재는 post_tag 테이블 삭제까지만 구현되어 있음
 */

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private tagService: TagService,
    private seriesService: SeriesService,
  ) {}

  async createPost(user: User, data: CreatePostDto, status: number) {
    const create_post = await this.postRepository.createPost(
      user,
      data,
      status,
    );

    if (data.tags.length > 0)
      // 게시글 태그 관련
      await this.tagService.tagAction(data.tags, create_post, user.id);

    if (data.series_id) {
      // 게시글 시리즈 관련
      await this.seriesService.createPostSeries(
        create_post,
        data.series_id,
        user.id,
      );
    }

    const series = await this.seriesService.selectPostSeriesList(create_post);
    const post = await this.selectPostOne(user.id, create_post);

    return { post, create_post, series };
  }

  async selectPostOne(user_id: number, post_id: number, user?: User) {
    const post = await this.postRepository.selectPostOne(
      user_id,
      post_id,
      user,
    );
    if (post !== 0) {
      for (let i = 0; i < post.length; i++) {
        if (post[i].tags) {
          const to_json = JSON.parse(post[i].tags);

          post[i].tags = to_json;
        }
      }
    }

    const next_post = await this.postRepository.selectNextPost(
      post_id,
      user_id,
    );
    const pre_post = await this.postRepository.selectPrePost(post_id, user_id);

    const interested_posts = await this.postRepository.interestedPostList();

    return { post, next_post, pre_post, interested_posts };
  }

  async updatePost(
    user: User,
    data: UpdatePostDto,
    post_id: number,
    status: number,
  ): Promise<any> {
    await this.postRepository.selectPostOne(user.id, post_id);
    const update_post = await this.postRepository.updatePost(
      user,
      data,
      post_id,
      status,
    );

    if (data.tags.length > 0) {
      await this.tagService.deletePostTag(post_id);
      await this.tagService.tagAction(data.tags, post_id, user.id);
    }

    if (!data.series_id) {
      // 시리즈에서 제외 시켰을 경우 post_series 테이블에 삭제되어야 함.
      await this.seriesService.deletePostSeries(post_id, user.id, 0);
    } else {
      await this.seriesService.createPostSeries(
        post_id,
        data.series_id,
        user.id,
      );
    }

    const post = await this.postRepository.selectPostOne(user.id, post_id);
    const series = await this.seriesService.selectPostSeriesList(post_id);

    return { post, update_post, series };
  }

  async deletePost(user: User, post_id: number) {
    const post = await this.postRepository.selectPostOne(user.id, post_id);
    await this.tagService.deletePostTag(post_id);
    const delete_post = await this.postRepository.deletePost(user, post_id);
    return { post, delete_post };
  }

  async selectPostList(
    user_id: number,
    tag_id: number,
    saves: boolean,
    pagination: PaginationDto,
  ) {
    const posts = await this.postRepository.selectPostList(
      user_id,
      true,
      tag_id,
      saves,
      pagination.offset,
      pagination.limit,
    );

    for (let i = 0; i < posts.length; i++) {
      if (posts[i].tags) {
        const to_json = JSON.parse(posts[i].tags);

        posts[i].tags = to_json;
      }
    }

    return posts;
  }

  async createSeries(user_id: number, series_name: string) {
    return this.seriesService.createSeries(user_id, series_name);
  }

  async getSeriesList(user_id: number) {
    return this.seriesService.selectSeriesList(user_id);
  }

  async selectPostListForMain(type: string, period: string) {
    if (type == 'TREND' && !period) return 0;

    const posts = await this.postRepository.selectPostListForMain(type, period);

    return posts;
  }
}
