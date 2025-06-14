
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}
