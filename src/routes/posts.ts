// src/routes/posts.ts
import { Hono } from 'hono';
import { postService } from '../services/postService.js';

const postsRouter = new Hono();

// GET /posts - Get all posts
postsRouter.get('/', async (c) => {
  const posts = await postService.getAllPosts();
  return c.json(posts);
});

// GET /posts/:id - Get post by ID
postsRouter.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400);
  
  const post = await postService.getPostById(id);
  if (!post) return c.json({ error: 'Post not found' }, 404);
  
  return c.json(post);
});

// POST /posts - Create new post
postsRouter.post('/', async (c) => {
  const body = await c.req.json();
  
  if (!body.title || !body.content || !body.userId) {
    return c.json({ error: 'Title, content, and userId are required' }, 400);
  }
  
  try {
    const post = await postService.createPost({
      title: body.title,
      content: body.content,
      userId: body.userId,
    });
    return c.json(post, 201);
  } catch (error: any) {
    const status = error.message === 'User not found' ? 404 : 400;
    return c.json({ error: error.message }, status);
  }
});

// GET /posts/:postId/comments - Fetch comments for a specific post
postsRouter.get('/:postId/comments', async (c) => {
  const postId = parseInt(c.req.param('postId'));
  if (isNaN(postId)) return c.json({ error: 'Invalid post ID' }, 400);
  
  try {
    const comments = await postService.getCommentsByPostId(postId);
    return c.json(comments);
  } catch (error: any) {
    if (error.message === 'Post not found') {
      return c.json({ error: 'Post not found' }, 404);
    }
    return c.json({ error: error.message }, 400);
  }
});

export default postsRouter;