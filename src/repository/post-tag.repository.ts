import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { PostTag } from 'src/entity/post-tag.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PostTag)
export class PostTagRepository extends Repository<PostTag> {
  async insertPostTag(tag_id: number, post_id: number) {
    const post_tag = this.create({
      tag: tag_id,
      post: post_id,
    });

    try {
      return await this.save(post_tag);
    } catch (err) {
      console.log(err);
    }
  }

  async deletePostTag(post_id: number) {
    const post_tag = this.createQueryBuilder()
      .delete()
      .from(PostTag)
      .where(`post_id = :post_id`, { post_id: post_id });

    try {
      return await post_tag.execute();
    } catch (err) {
      console.log(err);
    }
  }
}
