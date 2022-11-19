import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { UpdatePostDto } from 'src/dto/post/update-post.dto';
import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async selectPostOne(post_id: number) {
    const post = await this.query(
      `SELECT id, status, views, likes, create_at, update_at, user_id, title, content, thumbnail 
         FROM post
         WHERE id = ?`,
      [post_id],
    );

    if (post.length <= 0)
      throw new NotFoundException(`해당 게시글을 찾을 수 없습니다.`);

    return post;
  }

  async createPost(user: User, data: CreatePostDto, status: number) {
    const post = this.create({
      title: data.title,
      content: data.content,
      status: status,
      thumbnail: data.thumbnail,
      user: user,
    });

    try {
      await this.save(post);

      const result = await this.selectPostOne(post.id);

      return result;
    } catch (err) {
      if (err.errno) throw new BadRequestException(`posting create failed`);

      throw new InternalServerErrorException();
    }
  }

  async updatePost(
    user: User,
    data: UpdatePostDto,
    post_id: number,
    status: number,
  ) {
    await this.selectPostOne(post_id);

    const post = this.createQueryBuilder()
      .update(Post)
      .set({
        title: data.title,
        content: data.content,
        status: status,
        thumbnail: data.thumbnail,
      })
      .where(`id = :post_id AND userid = :user_id`, {
        post_id: post_id,
        user_id: user.id,
      });

    try {
      await post.execute();

      return await this.selectPostOne(post_id);
    } catch (err) {
      if (err.errno) throw new BadRequestException(`posting update failed`);

      throw new InternalServerErrorException();
    }
  }

  async deletePost(user: User, post_id: number) {
    await this.selectPostOne(post_id);

    const post = this.createQueryBuilder()
      .delete()
      .from(Post)
      .where(`id = :post_id AND userid = :user_id`, {
        post_id: post_id,
        user_id: user.id,
      });

    try {
      return await post.execute();
    } catch (err) {
      if (err.errno) throw new BadRequestException(`posting update failed`);

      throw new InternalServerErrorException();
    }
  }
}
