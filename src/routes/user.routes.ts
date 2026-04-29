// src/routes/users.ts
import { Hono } from 'hono';
import { userService } from '../services/user.service.js';

const usersRouter = new Hono();

// GET /users - Get all users
usersRouter.get('/', async (c) => {
  const users = await userService.getAllUsers();
  return c.json(users);
});

// GET /users/:id - Get user by ID
usersRouter.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400);
  
  const user = await userService.getUserById(id);
  if (!user) return c.json({ error: 'User not found' }, 404);
  
  return c.json(user);
});

// POST /users - Create new user
usersRouter.post('/', async (c) => {
  const body = await c.req.json();
  
  if (!body.name || !body.email) {
    return c.json({ error: 'Name and email are required' }, 400);
  }
  
  try {
    const user = await userService.createUser({
      name: body.name,
      email: body.email,
    });
    return c.json(user, 201);
  } catch (error: any) {
    if (error.message?.includes('UNIQUE')) {
      return c.json({ error: 'Email already exists' }, 400);
    }
    return c.json({ error: error.message }, 400);
  }
});

// GET /users/:id/posts - Fetch posts for a specific user
usersRouter.get('/:id/posts', async (c) => {
  const userId = parseInt(c.req.param('id'));
  if (isNaN(userId)) return c.json({ error: 'Invalid user ID' }, 400);
  
  try {
    const posts = await userService.getPostsByUser(userId);
    return c.json(posts);
  } catch (error: any) {
    if (error.message === 'User not found') {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json({ error: error.message }, 400);
  }
});

export default usersRouter;