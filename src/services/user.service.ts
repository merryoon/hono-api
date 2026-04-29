// src/services/userService.ts
import { db } from '../db/index.js';
import { users, posts } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const userService = {
  async getAllUsers() {
    return await db.select().from(users);
  },

  async getUserById(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  },

  async createUser(data: { name: string; email: string }) {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  },

  async getPostsByUser(userId: number) {
    // Verify user exists
    const user = await this.getUserById(userId);
    if (!user) throw new Error('User not found');
    
    return await db.select().from(posts).where(eq(posts.userId, userId));
  },
};