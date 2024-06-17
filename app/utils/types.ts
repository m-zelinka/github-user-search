type Maybe<T> = T | null;

interface Repository {
  description: Maybe<string>;
  forkCount: number;
  licenseInfo: Maybe<{ name: string }>;
  name: string;
  primaryLanguage: Maybe<{ color: Maybe<string>; name: string }>;
  repositoryTopics: {
    nodes: Maybe<Array<{ topic: { name: string } }>>;
  };
  stargazerCount: number;
  updatedAt: string;
  url: string;
}

export interface User {
  avatarUrl: string;
  bio: Maybe<string>;
  company: Maybe<string>;
  createdAt: string;
  email: Maybe<string>;
  followers: { totalCount: number };
  following: { totalCount: number };
  location: Maybe<string>;
  login: string;
  name: Maybe<string>;
  pronouns: Maybe<string>;
  repositories: { totalCount: number };
  topRepositories: {
    nodes: Maybe<Array<Repository>>;
  };
  twitterUsername: Maybe<string>;
  url: string;
  websiteUrl: Maybe<string>;
}
