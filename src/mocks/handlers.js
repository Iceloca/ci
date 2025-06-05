import { http, graphql } from 'msw';
import { HttpResponse } from 'msw';
import { SignJWT } from 'jose';
import { communities, accounts } from './data.js';
import { db } from './db.js';
import { faker } from '@faker-js/faker';

const JWT_CONFIG = {
  secret: new TextEncoder().encode('secret-key'),
  expiresIn: '24h',
};

function getTimeAgo(isoDate) {
  const now = new Date();
  const date = new Date(isoDate);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      const key = `timeAgo.${unit}`;
      return {
        key,
        value: `${interval} `,
      };
    }
  }

  return { key: 'timeAgo.justNow', value: 'Just now' };
}

const generateToken = async (userId) => {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_CONFIG.expiresIn)
    .sign(JWT_CONFIG.secret);
};

const registerHandler = http.post('/api/auth/reg', async ({ request }) => {
  const { email, password } = await request.json();
  const existingUser = db.user.findFirst({
    where: {
      email: { equals: email },
    },
  });
  if (existingUser) {
    return HttpResponse.json(
      {
        success: false,
        error: 'This email is already registered',
      },
      { status: 409 },
    );
  }
  const newUser = db.user.create({
    id: crypto.randomUUID(),
    email,
    password,
    userName: faker.person.fullName(),
    userTag: '@' + faker.person.firstName(),
    userAvatar: faker.image.avatar(),
    theme: 'dark',
    description: '',
  });
  const token = await generateToken(newUser.id);
  return HttpResponse.json({
    success: true,
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      userName: newUser.userName,
      userAvatar: newUser.userAvatar,
      theme: newUser.theme,
    },
  });
});

const loginHandler = http.post('/api/auth/login', async ({ request }) => {
  const { email, password } = await request.json();
  const user = db.user.findFirst({
    where: {
      email: { equals: email },
      password: { equals: password },
    },
  });

  if (!user) {
    console.log('none');
    return HttpResponse.json(
      {
        success: false,
        error: 'Invalid credentials',
      },
      { status: 401 },
    );
  }
  const token = await generateToken(user.id);
  return HttpResponse.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      userName: user.userName,
      userAvatar: user.userAvatar,
      theme: user.theme,
    },
  });
});

const postsGETHandler = http.get('/api/posts', async ({ request }) => {
  const url = new URL(request.url);
  let { startIndex, amount } = Object.fromEntries(new URLSearchParams(url.search).entries());
  startIndex = Number(startIndex);
  amount = Number(amount);
  const enrichedPosts = db.post
    .getAll()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((post) => {
      const postAuthor = db.user.findFirst({
        where: {
          id: {
            equals: post.userId,
          },
        },
      });

      const postComments = db.comment.findMany({
        where: {
          postId: {
            equals: post.id,
          },
        },
      });
      const timeAgo = getTimeAgo(post.createdAt);

      return {
        ...post,
        username: postAuthor?.userName || 'Unknown',
        userAvatar: postAuthor?.userAvatar || '',
        timeAgo,
        comments: postComments || [],
      };
    });
  const hasMore = startIndex + amount < enrichedPosts.length;
  if (startIndex !== undefined && amount) {
    const paginatedPosts = enrichedPosts.slice(startIndex, startIndex + amount);
    return HttpResponse.json({
      posts: paginatedPosts,
      hasMore,
    });
  }

  return HttpResponse.json({
    posts: enrichedPosts,
    hasMore,
  });
});

const postsPOSTHandler = http.post('api/posts', async ({ request }) => {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId');
    const title = formData.get('title');
    const description = formData.get('description');
    const file = formData.get('file');

    const user = db.user.findFirst({
      where: {
        id: {
          equals: userId,
        },
      },
    });

    if (!user) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const newPost = db.post.create({
      id: crypto.randomUUID(),
      userId: user.id,
      title: title || '',
      description,
      likes: 0,
      postImage: file ? URL.createObjectURL(file) : null,
      createdAt: new Date().toISOString(),
    });
    console.log(db.post.getAll());
    return HttpResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Mock server error:', error);
    return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
const communitiesHandler = http.get('api/communities', ({ request }) => {
  const url = new URL(request.url);
  let params = new URLSearchParams(url.search);
  params = Object.fromEntries(params.entries());
  return HttpResponse.json(communities.slice(0, Number(params.amount)));
});

const accountsHandler = http.get('/api/accounts', ({ request }) => {
  const url = new URL(request.url);
  let params = new URLSearchParams(url.search);
  params = Object.fromEntries(params.entries());
  return HttpResponse.json(accounts.slice(0, Number(params.amount)));
});

const usersGETHandler = http.get('/api/users/:id', ({ params }) => {
  const userId = params.id;
  const user = db.user.findFirst({
    where: {
      id: { equals: userId },
    },
  });
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' },
  });
});

const postsPATCHHandler = http.patch('/api/posts/:postId', async ({ request, params }) => {
  try {
    const { likes } = await request.json();
    const postId = params.postId;

    const existingPost = db.post.findFirst({
      where: {
        id: {
          equals: postId,
        },
      },
    });

    if (!existingPost) {
      return HttpResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const result = db.post.update({
      where: {
        id: {
          equals: postId,
        },
      },
      data: {
        likes: likes,
      },
    });

    return HttpResponse.json(result);
  } catch (error) {
    console.error('Error updating post likes:', error);
    return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

const commentsPOSTHandler = http.post('/api/comments', async ({ request }) => {
  try {
    const comment = await request.json();
    const post = db.post.findFirst({
      where: {
        id: {
          equals: comment.postId,
        },
      },
    });

    if (!post) {
      return HttpResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    const author = db.user.findFirst({
      where: {
        id: {
          equals: comment.authorId,
        },
      },
    });

    if (!author) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }
    let newComment = {
      id: crypto.randomUUID(),
      ...comment,
    };
    newComment = db.comment.create(newComment);
    return HttpResponse.json(
      {
        ...newComment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error adding comment:', error);
    return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

const commentsDELETEHandler = http.delete('/api/comments/:commentId', async ({ params }) => {
  try {
    const commentId = params.commentId;

    const comment = db.comment.findFirst({
      where: {
        id: {
          equals: commentId,
        },
      },
    });

    if (!comment) {
      return HttpResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    db.comment.delete({
      where: {
        id: {
          equals: commentId,
        },
      },
    });

    return new HttpResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const usersPATCHHandler = http.patch('/api/users/:userId', async ({ request, params }) => {
  try {
    const formData = await request.formData();
    const userId = params.userId;

    const existingUser = db.user.findFirst({
      where: {
        id: { equals: userId },
      },
    });

    if (!existingUser) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updates = {};
    formData.forEach((value, key) => {
      if (value instanceof File) {
        const fakeUrl = URL.createObjectURL(value);
        updates[key] = fakeUrl;
      } else {
        updates[key] = value;
      }
    });

    const result = db.user.update({
      where: {
        id: { equals: userId },
      },
      data: updates,
    });

    return HttpResponse.json(result);
  } catch (error) {
    console.error('Error updating user:', error);
    return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

const graphqlHandler = graphql.query('GetPosts', (req) => {
  const { amount, startIndex } = req.variables;

  const enrichedPosts = db.post
    .getAll()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((post) => {
      const postAuthor = db.user.findFirst({
        where: {
          id: {
            equals: post.userId,
          },
        },
      });
      const postComments = db.comment.findMany({
        where: {
          postId: {
            equals: post.id,
          },
        },
      });
      const timeAgo = getTimeAgo(post.createdAt);
      return {
        ...post,
        username: postAuthor?.userName || 'Unknown',
        userAvatar: postAuthor?.userAvatar || '',
        timeAgo,
        comments: postComments || [],
      };
    });
  const hasMore = startIndex + amount < enrichedPosts.length;
  if (startIndex !== undefined && amount) {
    const paginatedPosts = enrichedPosts.slice(startIndex, startIndex + amount);
    return HttpResponse.json({ data: { posts: { items: paginatedPosts, hasMore } } });
  }

  return HttpResponse.json({ data: { posts: { items: enrichedPosts, hasMore } } });
});

export const handlers = [
  registerHandler,
  loginHandler,
  accountsHandler,
  communitiesHandler,
  usersGETHandler,
  postsPOSTHandler,
  postsPATCHHandler,
  postsGETHandler,
  commentsPOSTHandler,
  commentsDELETEHandler,
  usersPATCHHandler,
  graphqlHandler,
];
