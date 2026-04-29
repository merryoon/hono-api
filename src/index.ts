import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from './routes/comment.routes.js';

const app = new Hono();

// Mount modular routes
app.route('/api/users', userRoutes);
app.route('/api/posts', postRoutes);
app.route('/api/comments', commentRoutes);

// Health check
app.get('/', (c) => c.json({ message: 'API is running!' }));

// Start server
const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: port
});