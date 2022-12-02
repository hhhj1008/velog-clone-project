import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ValidateToken } from 'src/custom-decorator/validate-token.decorator';
import { User } from 'src/entity/user.entity';
import { AboutBlogDto } from 'src/dto/user/about-blog.dto';
import { LologService } from './lolog.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { PaginationDto } from 'src/dto/pagination.dto';

@Controller('lolog')
export class LologController {
  constructor(private readonly lologService: LologService) {}

  @Get('/:user_id/series')
  async getSeries(@Param('user_id') user_id: number) {
    const result = await this.lologService.getSeries(user_id);

    return { statusCode: 200, series: result };
  }

  @Get('/:user_id/about')
  async getAbout(@Param('user_id') user_id: number) {
    const result = await this.lologService.getAboutBlog(user_id);

    return { statusCode: 200, about: result };
  }

  @Get('/:user_id')
  async getLolog(
    @Param('user_id') user_id: number,
    @Query() pagination: PaginationDto,
    @ValidateToken() user?: User,
  ) {
    const result = await this.lologService.getLolog(user_id, pagination, user);

    return { statusCode: 200, posts: result.posts, tags: result.tags };
  }

  @Patch('/:user_id/about')
  async editAboutBlog(
    @Param('user_id') user_id: number,
    @Body() data: AboutBlogDto,
  ) {
    const result = await this.lologService.editAboutBlog(
      user_id,
      data.about_blog,
    );

    return { statusCode: 200, about: result };
  }

  @Post('/:post_id/like')
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('post_id') post_id: number, @GetUser() user: User) {
    await this.lologService.likePost(user.id, post_id);
    return { statusCode: 201 };
  }

  @Delete('/:post_id/like')
  @UseGuards(JwtAuthGuard)
  async unlikePost(@Param('post_id') post_id: number, @GetUser() user: User) {
    await this.lologService.unlikePost(user.id, post_id);
    return { statusCode: 204 };
  }
}
