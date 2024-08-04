"use server";

import { ID, Query } from "node-appwrite";
import { users } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newuser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name);
    return parseStringify(newuser);
  
  } catch (error: any) {
    if (error && error?.code === 409) {
      // 409 is the error code for duplicate email
      const documents = await users.list([Query.equal("email", [user.email])]);
      return documents?.users[0];
    }
  }
};
