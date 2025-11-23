// User summary type for list views
export type IUserListItem = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  lang?: string | null;
  active: boolean;
  locked: boolean;
  roles?: string[];
};

// Full user details for edit forms
export type IUserDetails = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  lang?: string | null;
  active: boolean;
  locked: boolean;
  roles: string[];
};
