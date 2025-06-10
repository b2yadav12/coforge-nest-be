import { User } from '../../auth/types';

export interface Post {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
}
