export interface User {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  active: boolean;
  locked: boolean;
  roles: string[];
}

export interface UserQuery {
  userId?: string;
}
