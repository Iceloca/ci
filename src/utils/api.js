import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { gql } from '@apollo/client';

export const updateUserProfile = async (userId, updates) => {
  const formData = new FormData();

  for (const key in updates) {
    formData.append(key, updates[key]);
  }

  const response = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('errors.failedToUpdateProfile');
  }

  return await response.json();
};

export const deleteComment = async (commentId) => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('errors.failedToDeleteComment');
  }
};

export const addComment = async (newComment) => {
  const response = await fetch(`/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newComment),
  });

  if (!response.ok) {
    throw new Error('errors.failedToCreateComment');
  }
  return await response.json();
};

export const updateLikes = async (newLikesAmount, postId) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ likes: newLikesAmount }),
  });

  if (!response.ok) {
    throw new Error('errors.failedToUpdatePost');
  }

  return await response.json();
};

export const fetchUserByToken = async (token) => {
  const decoded = jwtDecode(token);
  const userId = decoded.userId || decoded.sub;

  if (!userId) {
    throw new Error('errors.invalidToken');
  }

  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('errors.failedToFetchUserData');
  }

  return await response.json();
};

export const loginRequest = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  c
  const data = await response.json();
  if (!response.ok) {
    throw new Error('errors.failedToLogin');
  }

  const { token, user } = data;

  return { token, user }; // <-- то, что ждёт thunk
};


export const registerRequest = async (credentials) => {
  const response = await fetch('/api/auth/reg', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('errors.failedToRegister');
  }

  const { token, user } = data;

  return { token, user };
};

export const createPostRequest = async ({ title, description, userId, file }) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('userId', userId);
  if (file) {
    formData.append('file', file);
  }

  const response = await fetch('/api/posts', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || 'errors.failedToCreatePost');
  }

  return response.json();
};

export const POSTS_PER_PORTION = 4;

export const fetchPosts = async ({ pageParam = 0 }) => {
  try {
    const { data } = await axios.get('/api/posts', {
      params: {
        amount: POSTS_PER_PORTION,
        startIndex: pageParam,
      },
    });
    return data;
  } catch (error) {
    throw new Error('errors.failedToFetchPosts');
  }
};

export const GET_POSTS_WITH_COMMENTS = gql`
  query GetPosts($amount: Int!, $startIndex: Int!) {
    posts(amount: $amount, startIndex: $startIndex) {
      items {
        id
        description
        username
        userAvatar
        postImage
        likes
        timeAgo
        comments {
          id
          authorId
          authorTag
          text
        }
      }
      hasMore
    }
  }
`;

export const createFetchMoreConfig = (itemsLength) => ({
  variables: {
    startIndex: itemsLength,
  },
  updateQuery: (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev;

    return {
      posts: {
        __typename: prev.posts.__typename,
        items: [...prev.posts.items, ...fetchMoreResult.posts.items],
        hasMore: fetchMoreResult.posts.hasMore,
      },
    };
  },
});

export const fetchAccounts = async (amount = 5) => {
  try {
    const response = await axios.get(`/api/accounts`, {
      params: { amount },
    });
    return response.data;
  } catch (error) {
    throw new Error('errors.failedToFetchAccounts');
  }
};

export const fetchCommunities = async (amount = 3) => {
  try {
    const response = await axios.get(`/api/communities`, {
      params: { amount },
    });
    return response.data;
  } catch (error) {
    throw new Error('errors.failedToFetchCommunities');
  }
};
