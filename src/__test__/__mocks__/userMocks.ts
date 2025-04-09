import { UserType } from "@/@types/types";

export const userADM: UserType = {
  username: "john-doe",
  password: "abc@ABC@123",
  role: "ADM",
  status: "ACTIVE",
};
export const userCOMMON: UserType = {
  username: "john-doe",
  password: "abc@ABC@123",
  role: "COMMON",
  status: "ACTIVE",
};

export const userADM_Id: UserType = {
  username: "john-doe",
  password: "HASH@@@abc@ABC@123",
  role: "ADM",
  status: "ACTIVE",
  id: "id-00001",
};
export const userCOMMON_Id: UserType = {
  username: "john-doe",
  password: "HASH@@@abc@ABC@123",
  role: "COMMON",
  status: "ACTIVE",
  id: "id-00002",
};

export const userADM_Output: Partial<UserType> = {
  username: "john-doe",
  role: "ADM",
  id: "id-00001",
};
export const userCOMMON_Output: Partial<UserType> = {
  username: "john-doe",
  role: "COMMON",
  id: "id-00002",
};
