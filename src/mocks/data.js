import { faker } from '@faker-js/faker';

export const accounts = [
  {
    username: 'Helena Hillls',
    userAvatar: faker.image.avatar(),
    userTag: '@helenahills',
  },
  {
    username: 'Charles',
    userAvatar: faker.image.avatar(),
    userTag: '@charles',
  },
  {
    username: 'Oskar Davis',
    userAvatar: faker.image.avatar(),
    userTag: '@oscardavis',
  },
  {
    username: 'Daniel Jay Park',
    userAvatar: faker.image.avatar(),
    userTag: '@danielj',
  },
  {
    username: 'Carlo Rojas',
    userAvatar: faker.image.avatar(),
    userTag: '@carlorojas',
  },
];

export const communities = [
  {
    username: 'Design Enthusiasts',
    userAvatar: faker.image.avatar(),
    userTag: '13.2k members',
  },
  {
    username: 'Photographers of SF',
    userAvatar: faker.image.avatar(),
    userTag: '2k members',
  },
  {
    username: 'Marina crew',
    userAvatar: faker.image.avatar(),
    userTag: '125 members',
  },
];
