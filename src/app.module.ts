import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';
import { CommentModule } from './comment/comment.module';
import { InsideModule } from './inside/inside.module';
import { SeriesModule } from './series/series.module';
import { ListsModule } from './lists/lists.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    PostModule,
    TagModule,
    CommentModule,
    InsideModule,
    SeriesModule,
    ListsModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
