import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { UpdatePostDto } from 'src/dto/post/update-post.dto';
import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
import { Brackets, EntityRepository, Repository } from 'typeorm';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async createPost(
    user: User,
    title: string,
    content: string,
    status: number,
    thumbnail: string,
    post_url: string,
  ) {
    const post = this.create({
      title: title,
      content: content,
      status: status,
      thumbnail: thumbnail,
      post_url: post_url,
      user: user,
    });

    await this.save(post);

    return post.id;
  }

  async selectPostOne(login_user_id: number, post_id: number) {
    let query = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoin('post.tags', 'tags')
      .select([
        'user.id AS user_id',
        'user.login_id',
        'user.name',
        'user.profile_image',
        'user.about_me',
        'post.id AS post_id',
        'post.title',
        'post.status',
        'post.content',
        'post.create_at',
        'post.comment_count',
        'post.likes',
        'IF(post.user_id = :userId, 1, 0) AS is_writer',
        'IF(INSTR(tags.tags,\'"tag_id": null\'), null, tags.tags) AS tags',
      ])
      .setParameter('userId', login_user_id)
      .andWhere('post.id = :post_id', { post_id: post_id });

    if (login_user_id > -1) {
      query
        .addSelect([
          'EXISTS (SELECT * FROM follow WHERE follow.follower_id = :id AND follow.followee_id = post.user_id) AS IsFollower',
        ])
        .setParameter('id', login_user_id);
    }

    const post = await query.getRawMany();

    if (post.length <= 0) return 0;

    return post;
  }

  async updatePost(user: User, data: UpdatePostDto, post_id: number) {
    const post = this.createQueryBuilder()
      .update(Post)
      .set({
        title: data.title,
        content: data.content,
        status: data.status,
        thumbnail: data.thumbnail,
      })
      .where(`id = :post_id AND user_id = :user_id`, {
        post_id: post_id,
        user_id: user.id,
      });

    await post.execute();
  }

  async deletePost(user: User, post_id: number) {
    const post = this.createQueryBuilder()
      .delete()
      .from(Post)
      .where(`id = :post_id AND user_id = :user_id`, {
        post_id: post_id,
        user_id: user.id,
      });

    await post.execute();
  }

  async selectPostList(
    user_id: number,
    is_owner: boolean,
    tag_id: number,
    offset: number,
    limit: number,
  ) {
    let posts = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoin('post.tags', 'tags')
      .leftJoin('post.post_tag', 'post_tag')
      .where(`post.user_id = :user_id`, { user_id: user_id })
      .select([
        'user.id as user_id',
        'post.id as post_id',
        'post.thumbnail',
        'post.title',
        'post.content',
        'IF(INSTR(tags.tags,\'"tag_id": null\'), null, tags.tags) AS tags',
        'post.create_at',
        'post.comment_count',
        'post.likes',
        'post.status',
      ])
      .groupBy('post.id')
      .orderBy('post.create_at', 'DESC');

    if (is_owner) {
      posts.andWhere("post.status REGEXP '1|2'");
    } else {
      posts.andWhere('post.status = 1');
    }

    if (tag_id) posts.andWhere('post_tag.tag_id = :tag_id', { tag_id: tag_id });

    posts.offset(offset * limit - limit);
    posts.limit(limit);

    return await posts.getRawMany();
  }

  async selectSaves(user_id: number) {
    const saves = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .select([
        'post.id AS post_id',
        'user.id AS user_id',
        'post.title AS title',
        'post.content AS content',
        'post.create_at AS create_at',
      ])
      .where('user.id = :user_id', { user_id: user_id })
      .andWhere('post.status = 3')
      .orderBy('post.create_at', 'DESC');

    return await saves.getRawMany();
  }

  async selectNextPost(post_id: number, user_id: number) {
    const next_post = await this.query(
      `SELECT 
    post.id AS post_id,
    post.title
    FROM post
    WHERE id = (SELECT id FROM post WHERE id > ? ORDER BY id LIMIT 1)
    AND post.user_id = ?`,
      [post_id, user_id],
    );

    return next_post;
  }

  async selectPrePost(post_id: number, user_id: number) {
    const pre_post = await this.query(
      `SELECT 
    post.id AS post_id,
    post.title
    FROM post
    WHERE id = (SELECT id FROM post WHERE id < ? ORDER BY id DESC LIMIT 1)
    AND post.user_id = ?`,
      [post_id, user_id],
    );

    return pre_post;
  }

  async updateLikeCount(post_id: number) {
    await this.query(
      `UPDATE post SET likes = (SELECT COUNT(*) FROM post_like WHERE post_id = ?) WHERE id = ?`,
      [post_id, post_id],
    );
  }

  async selectPostListForMain(type: string, period: string) {
    let main_posts = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .select([
        'user.id AS user_id',
        'user.profile_image',
        'user.login_id',
        'post.id AS post_id',
        'post.thumbnail',
        'post.title',
        'post.content',
        'post.create_at',
        'post.comment_count',
        'post.likes',
        'post.views',
      ]);

    switch (period) {
      case 'TODAY':
        main_posts.where('DAYOFMONTH(post.create_at) = DAYOFMONTH(CURDATE())');
        break;
      case 'WEEK':
        main_posts.where(
          "post.create_at BETWEEN DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (DAYOFWEEK(CURDATE())-1) DAY), '%Y/%m/%d')" +
            "AND DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (DAYOFWEEK(CURDATE())-7) DAY), '%Y/%m/%d')",
        );
        break;
      case 'MONTH':
        main_posts.where('MONTH(post.create_at) = MONTH(NOW())');
        break;
      case 'YEAR':
        main_posts.where('WHERE YEAR(post.create_at) = YEAR(NOW())');
        break;
    }

    switch (type) {
      case 'NEW':
        main_posts.orderBy('post.create_at', 'DESC');
        break;
      case 'TREND':
        main_posts.andWhere('post.likes > 0 AND post.views > 0');
        main_posts.groupBy('post.id');
        main_posts.orderBy('SUM(post.likes + post.views)', 'DESC');
        break;
    }

    return await main_posts.getRawMany();
  }

  async interestedPostList() {
    // 관심 있을 만한 포스트는 임의로 랜덤 12개 가지고 오도록 하였음.
    const posts = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoin('post.post_tag', 'post_tag')
      .leftJoin('tag', 'tag', 'post_tag.tag_id = tag.id')
      .select([
        'user.id AS user_id',
        'user.profile_image',
        'user.login_id',
        'post.id AS post_id',
        'post.thumbnail',
        'post.title',
        'post.content',
        'post.create_at',
        'post.comment_count',
        'post.likes',
        'post.views',
      ])
      .orderBy('RAND()')
      .limit(12);
    return await posts.getRawMany();
  }

  async mainSearch(
    keywords: string,
    userId: number,
    user: User,
    offset: number,
    limit: number,
  ) {
    let main_search = this.createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoin('post.tags', 'tags')
      .leftJoin('post_tag', 'post_tag', 'post.id = post_tag.post_id')
      .leftJoin('tag', 'tag', 'post_tag.tag_id = tag.id')
      .select([
        'user.id AS user_id',
        'user.profile_image',
        'user.login_id',
        'post.id AS post_id',
        'post.thumbnail',
        'post.title',
        'post.content',
        'post.create_at',
        'post.comment_count',
        'IF(INSTR(tags.tags,\'"tag_id": null\'), null, tags.tags) AS tags',
      ])
      .andWhere(
        new Brackets((qb) => {
          qb.orWhere('post.title REGEXP :keywords', { keywords: keywords })
            .orWhere('post.content REGEXP :keywords', { keywords: keywords })
            .orWhere('tag.name REGEXP :keywords', { keywords: keywords });
        }),
      )
      .groupBy('post.id')
      .orderBy('post.id', 'DESC');

    if (userId) {
      main_search.andWhere('post.user_id = :userId', { userId: userId });
    }

    if (user) {
      main_search
        .addSelect([
          'EXISTS (SELECT * FROM follow WHERE follow.follower_id = :user_id AND follow.followee_id = post.user_id) AS IsFollower',
        ])
        .setParameter('user_id', user['sub']);
    }

    main_search.offset(offset * limit - limit);
    main_search.limit(limit);

    return await main_search.getRawMany();
  }
}
