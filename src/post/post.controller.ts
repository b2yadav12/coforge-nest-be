
import { Controller, Get, Param, Patch, Body, Post, NotFoundException, BadRequestException } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostDto, CreatePostDto } from './types';
import { User } from '../auth/types';
import { AuthDecorator, RequiresLogin } from '../utils/auth.decorator';

@Controller('posts')
export class PostController {

  constructor(private readonly postService: PostService) {}

  @Post()
  @RequiresLogin()
  async create(
    @AuthDecorator() user: User,
    @Body() postPayload: CreatePostDto
  ): Promise<PostDto> {
    return this.postService.createPost(postPayload, user.id);
  }

  @Get()
  async list(): Promise<PostDto[]> {
    return this.postService.getPosts();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<PostDto> {
    const post = await this.postService.getPostById(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  @Patch(':id')
  @RequiresLogin()
  async update(@Param('id') id: string, @Body() postPayload: CreatePostDto): Promise<PostDto> {
    return this.postService.updatePost(id, postPayload);
  }
}
