export type AccessLevel = "ADM" | "COMMON";

export type UserType = {
  id?: string;
  username: string;
  password: string;
  accessLevel: AccessLevel;
};
