// /src/lib/users.js
import { Users } from "./mongodb";

export const getAllUsers = async () => {
  const users = await (await Users()).find({}).toArray();
  return users;
};

export const createUser = async (newUser) => {
  const user = await (await Users()).insertOne(newUser);
  return user;
};

export const loginUser = async (email, password) => {
  // Find the user by email
  const user = await (await Users()).findOne({ email: email });
  if (user) {
    // Here, you would typically compare the hashed password stored in the database
    // with the hashed version of the password provided by the user
    // For security reasons, passwords should be hashed and securely compared
    // For demonstration purposes, assuming the password is stored in plain text
    if (user.password === password) {
      return user; // User authenticated successfully
    } else {
      return null; // Incorrect password
    }
  } else {
    return null; // User not found
  }
};