export type UserRoles = "ADM" | "COMMON";
export type UserStatus = "ACTIVE" | "DELETED"; //Alterar tudo para adicionar essa role

export type UserType = {
  id?: string;
  username: string;
  password: string;
  role: UserRoles;
  status: UserStatus;
};

export type UpdateUser = {
  current?: Partial<UserType>;
  update: Partial<UserType>;
};
