import { PartialType } from '@nestjs/mapped-types';
import { CreateComment } from './create-comment.dto';

export class UpdateComment extends PartialType(CreateComment) {}
