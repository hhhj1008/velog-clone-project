import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/user.repository';
import {
  IsBooleanOrNullConstraint,
  IsEmailOrNullConstraint,
  IsUrlOrNullConstraint,
} from 'src/validations/user.validation';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  exports: [TypeOrmModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    IsEmailOrNullConstraint,
    IsUrlOrNullConstraint,
    IsBooleanOrNullConstraint,
  ],
})
export class UserModule {}
