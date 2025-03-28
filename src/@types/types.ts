export type UserRoles = "ADM" | "COMMON";

export type UserType = {
  id?: string;
  username: string;
  password: string;
  role: UserRoles;
};
