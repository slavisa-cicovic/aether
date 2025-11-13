export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserQuery{
  userId?: string;
}