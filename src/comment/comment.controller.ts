import {
  Body,
  Controller,
  UseGuards,
  Post,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateComment } from 'src/dto/comment/create-comment.dto';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { UpdateComment } from 'src/dto/comment/update-comment.dto';
import { CommentParamDto } from 'src/dto/comment/comment-param.dto';

@Controller('comment')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:post_id')
  async createCommnet(
    @Body() data: CreateComment,
    @GetUser() user: User,
    @Param('post_id') post_id: number,
  ) {
    const result = await this.commentService.createComment(
      data,
      post_id,
      user.id,
    );
    return {
      statusCode: 201,
      message: 'comment create success',
      result: result,
    };
  }

  @Patch('/:post_id/:comment_id')
  async updateComment(
    @Body() data: UpdateComment,
    @Param() ids: CommentParamDto,
    @GetUser() user: User,
  ) {
    const result = await this.commentService.updateComment(
      data,
      ids.comment_id,
      ids.post_id,
      user.id,
    );

    return {
      statusCode: 200,
      message: 'comment update success',
      result: result,
    };
  }

  @Delete('/:post_id/:comment_id')
  async deleteComment(@Param() ids: CommentParamDto, @GetUser() user: User) {
    const result = await this.commentService.deleteComment(
      ids.comment_id,
      ids.post_id,
      user.id,
    );

    return {
      statusCode: 200,
      message: 'comment delete success',
      result: result,
    };
  }
}
