'use client';

import { factory, primaryKey } from '@mswjs/data';

const STORAGE_KEY = 'mock-db';

export const db = factory({
  user: {
    id: primaryKey(String),
    email: String,
    password: String,
    theme: String,
    userAvatar: String,
    userName: String,
    userTag: String,
    description: String,
  },
  post: {
    id: primaryKey(String),
    userId: String,
    description: String,
    postImage: String,
    likes: Number,
    createdAt: String,
  },
  comment: {
    id: primaryKey(String),
    postId: String,
    authorId: String,
    authorTag: String,
    text: String,
  },
});

export function initDbPersistence() {
  if (typeof window === 'undefined') return;

  const serializeData = () => ({
    user: db.user.getAll(),
    post: db.post.getAll(),
    comment: db.comment.getAll(),
  });

  const persistData = () => {
    try {
      const data = serializeData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist data:', error);
    }
  };

  const wrapOperation = (model, operation) => {
    const original = model[operation];
    model[operation] = (args) => {
      const result = original(args);
      persistData();
      return result;
    };
  };

  // Оборачиваем операции
  wrapOperation(db.user, 'create');
  wrapOperation(db.user, 'delete');
  wrapOperation(db.user, 'update');
  wrapOperation(db.post, 'create');
  wrapOperation(db.post, 'delete');
  wrapOperation(db.post, 'update');
  wrapOperation(db.comment, 'create');
  wrapOperation(db.comment, 'delete');
  wrapOperation(db.comment, 'update');

  // Загружаем сохранённые данные
  try {
    const persistedData = localStorage.getItem(STORAGE_KEY);
    if (persistedData) {
      const { user = [], post = [], comment = [] } = JSON.parse(persistedData);

      user.forEach((userData) => {
        if (!db.user.findFirst({ where: { id: { equals: userData.id } } })) {
          db.user.create(userData);
        }
      });

      post.forEach((postData) => {
        if (!db.post.findFirst({ where: { id: { equals: postData.id } } })) {
          db.post.create(postData);
        }
      });

      comment.forEach((commentData) => {
        if (!db.comment.findFirst({ where: { id: { equals: commentData.id } } })) {
          db.comment.create(commentData);
        }
      });
    }
  } catch (error) {
    console.error('Failed to load persisted data:', error);
  }
}

console.log(db.user.getAll(),'all');