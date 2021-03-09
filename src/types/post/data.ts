export interface PostDataObj {
  id?: number;
  userId: number;
  title: string;
  body: string;
  author?: string;
}

export enum NotificationType {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

export type Obj = Record<string, string | null | boolean>;
export type Values = Record<
  string,
  string | number | boolean | Date | string[] | Obj | undefined
>;

export const URL = 'https://jsonplaceholder.typicode.com/posts';

export const AUTHOR = 'Varun';
export const USERID = 1;
