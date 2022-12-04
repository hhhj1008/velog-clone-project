import { Injectable } from '@nestjs/common';
import { PostTagRepository } from 'src/repository/post-tag.repository';
import { TagRepository } from 'src/repository/tag.repository';

@Injectable()
export class TagService {
  constructor(
    private tagRepository: TagRepository,
    private postTagRepository: PostTagRepository,
  ) {}

  async createTag(tags: string[], post_id: number, user_id: number) {
    let tag_ids: number[] = [];
    for (let i = 0; i < tags.length; i++) {
      await this.tagRepository.insertTag(tags[i], '');
      const tag_id = await this.tagRepository.findOne({ name: tags[i] });

      tag_ids.push(tag_id.id);
    }

    for (let i = 0; i < tag_ids.length; i++) {
      await this.postTagRepository.insertPostTag(tag_ids[i], post_id);
    }
  }

  async selectTagListByUserId(user_id: number) {
    const tags = await this.postTagRepository.selectTagListByUserId(user_id);

    return tags;
  }
}
