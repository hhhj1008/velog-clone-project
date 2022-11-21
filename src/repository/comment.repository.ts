import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateComment } from 'src/dto/comment/create-comment.dto';
import { UpdateComment } from 'src/dto/comment/update-comment.dto';
import { Comment } from 'src/entity/comment.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async createComment(data: CreateComment, post_id: number, user_id: number) {
    const comment = this.create({
      user: user_id,
      board: post_id,
      content: data.content,
      depth: data.depth,
    });

    try {
      return await this.save(comment);
    } catch (err) {
      if (err.errno) throw new BadRequestException(`comment create failed`);

      throw new InternalServerErrorException();
    }
  }

  async updateComment(
    data: UpdateComment,
    comment_id: number,
    post_id: number,
    user_id: number,
  ) {
    const comment = this.createQueryBuilder()
      .update(Comment)
      .set({
        content: data.content,
      })
      .where(`id = :comment_id AND post_id = :post_id AND user_id = :user_id`, {
        comment_id: comment_id,
        post_id: post_id,
        user_id: user_id,
      });

    try {
      return await comment.execute();
    } catch (err) {
      if (err.errno) throw new BadRequestException(`comment update failed`);

      throw new InternalServerErrorException();
    }
  }

  async deleteComment(comment_id: number, post_id: number, user_id: number) {
    const comment = this.createQueryBuilder()
      .delete()
      .from(Comment)
      .where(`id = :comment_id AND post_id = :post_id AND user_id = :user_id`, {
        comment_id: comment_id,
        post_id: post_id,
        user_id: user_id,
      });

    try {
      return await comment.execute();
    } catch (err) {
      if (err.errno) throw new BadRequestException(`comment delete failed`);

      throw new InternalServerErrorException();
    }
  }
}
