// src/routes/comments.ts
import { Hono } from 'hono';
import { commentService } from '../services/commentService.js';

const commentsRouter = new Hono();

// GET /comments - Get all comments (optionally filter by postId)
commentsRouter.get('/', async (c) => {
  const postId = c.req.query('postId');
  
  if (postId) {
    const postIdNum = parseInt(postId);
    if (isNaN(postIdNum)) return c.json({ error: 'Invalid postId parameter' }, 400);
    
    const comments = await commentService.getAllComments(postIdNum);
    return c.json(comments);
  }
  
  const comments = await commentService.getAllComments();
  return c.json(comments);
});

// GET /comments/:id - Get comment by ID
commentsRouter.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400);
  
  const comment = await commentService.getCommentById(id);
  if (!comment) return c.json({ error: 'Comment not found' }, 404);
  
  return c.json(comment);
});

// POST /comments - Create new comment
commentsRouter.post('/', async (c) => {
  const body = await c.req.json();
  
  if (!body.content || !body.postId) {
    return c.json({ error: 'Content and postId are required' }, 400);
  }
  
  try {
    const comment = await commentService.createComment({
      content: body.content,
      postId: body.postId,
    });
    return c.json(comment, 201);
  } catch (error: any) {
    const status = error.message === 'Post not found' ? 404 : 400;
    return c.json({ error: error.message }, status);
  }
});

export default commentsRouter;