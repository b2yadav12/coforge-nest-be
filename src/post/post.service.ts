import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from '../db-models/entities/post.entity';
import { CreatePostDto, Post } from './types';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async createPost(data: CreatePostDto, userId: string): Promise<Post> {
    const post = new PostEntity();
    post.title = data.title;
    post.description = data.description;
    post.userId = userId;
    return await this.postRepository.save(post);
  }

  async getPosts(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPostById(id: string): Promise<Post | null> {
    return this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async updatePost(id: string, data: CreatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    
    post.title = data.title;
    post.description = data.description;
    return this.postRepository.save(post);
  }
}
