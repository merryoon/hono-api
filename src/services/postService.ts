// src/services/postService.ts
import { db } from '../db/index.js';
import { posts, comments } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { userService } from './userService.js';

export const postService = {
  async getAllPosts() {
    return await db.select().from(posts);
  },

  async getPostById(id: number) {
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result[0] || null;
  },

  async createPost(data: { title: string; content: string; userId: number }) {
    // Verify user exists before creating post
    const user = await userService.getUserById(data.userId);
    if (!user) throw new Error('User not found');
    
    const result = await db.insert(posts).values(data).returning();
    return result[0];
  },

  async getCommentsByPostId(postId: number) {
    // Verify post exists
    const post = await this.getPostById(postId);
    if (!post) throw new Error('Post not found');
    
    return await db.select().from(comments).where(eq(comments.postId, postId));
  },
};