export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: Date;
};

export type Mutation = {
  __typename?: "Mutation";
  removeSavedResource?: Maybe<UserSavedResource>;
  saveResource: UserSavedResource;
};

export type MutationRemoveSavedResourceArgs = {
  resourceId: Scalars["String"];
};

export type MutationSaveResourceArgs = {
  resourceId: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  currentUser?: Maybe<User>;
};

export type User = {
  __typename?: "User";
  email: Scalars["String"];
  emailVerified?: Maybe<Scalars["DateTime"]>;
  id: Scalars["ID"];
  image?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  savedResources: Array<UserSavedResource>;
};

export type UserSavedResource = {
  __typename?: "UserSavedResource";
  id: Scalars["ID"];
  resourceId: Scalars["String"];
  savedAt?: Maybe<Scalars["DateTime"]>;
  user: User;
  userId: Scalars["String"];
};
