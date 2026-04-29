// src/services/commentService.ts
import { db } from '../db/index.js';
import { comments } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { postService } from './post.service.js';

export const commentService = {
  async getAllComments(postId?: number) {
    if (postId) {
      return await db.select().from(comments).where(eq(comments.postId, postId));
    }
    return await db.select().from(comments);
  },

  async getCommentById(id: number) {
    const result = await db.select().from(comments).where(eq(comments.id, id));
    return result[0] || null;
  },

  async createComment(data: { content: string; postId: number }) {
    // Verify post exists before creating comment
    const post = await postService.getPostById(data.postId);
    if (!post) throw new Error('Post not found');
    
    const result = await db.insert(comments).values(data).returning();
    return result[0];
  },
};