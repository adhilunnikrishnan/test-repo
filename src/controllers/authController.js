import connectToDatabase from "../config/db.js";
import argon2 from "argon2";
import { v7 as uuidv7 } from 'uuid';

export const registerUser = async (req, res) => {
  console.log("register user trigerd>>>>>>");
  console.log("register user req.body", req.body);

  try {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
      return res.status(400).json({ message: "Username, email and password are required" });
    }
    const db = await connectToDatabase();

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    const hashedPassword = await argon2.hash(password);
    console.log("hashed password>>>>>",hashedPassword)

    const inputData = {
      username,
      email,
      password:hashedPassword,
      userId:uuidv7(),
      createdAt: new Date(),
      isBlocked: false,
      isDeleted: false,
    }
    console.log("stuctured data",inputData)

    const result = await db.collection("users").insertOne(inputData);
    console.log("database query result",result)

    res.status(200).json({ message: "User registered successfully",result });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }

};

export const loginUser = async (req, res) => {
  // Implementation for user login
};