import { Injectable } from '@nestjs/common';
import { CreateComment } from 'src/dto/comment/create-comment.dto';
import { UpdateComment } from 'src/dto/comment/update-comment.dto';
import { CommentRepository } from 'src/repository/comment.repository';

@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async createComment(data: CreateComment, post_id: number, user_id: number) {
    return this.commentRepository.createComment(data, post_id, user_id);
  }

  async updateComment(
    data: UpdateComment,
    comment_id: number,
    post_id: number,
    user_id: number,
  ) {
    return this.commentRepository.updateComment(
      data,
      comment_id,
      post_id,
      user_id,
    );
  }

  async deleteComment(comment_id: number, post_id: number, user_id: number) {
    return this.commentRepository.deleteComment(comment_id, post_id, user_id);
  }
}
