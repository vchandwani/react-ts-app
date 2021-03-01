export interface PostDataObj {
  id: number;
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
