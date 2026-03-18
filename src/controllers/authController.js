import connectToDatabase from "../config/db.js";
import argon2 from "argon2";
import { v7 as uuidv7 } from "uuid";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  console.log("register user trigerd>>>>>>");
  console.log("register user req.body", req.body);

  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }
    const db = await connectToDatabase();

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const hashedPassword = await argon2.hash(password);
    console.log("hashed password>>>>>", hashedPassword);

    const inputData = {
      username,
      email,
      password: hashedPassword,
      userId: uuidv7(),
      createdAt: new Date(),
      isBlocked: false,
      isDeleted: false,
    };
    console.log("stuctured data", inputData);

    const result = await db.collection("users").insertOne(inputData);
    console.log("database query result", result);

    res.status(200).json({ message: "User registered successfully", result });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  console.log("login user function triggered");
  console.log("login user data", req.body);

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }
    const db = await connectToDatabase();

    const existingUser = await db.collection("users").findOne({ email });

    console.log("data of existing user>>>>>>", existingUser);
    //
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email not exists" });
    }

    const passwordVerification = await argon2.verify(
      existingUser.password,
      password,
    );
    if (!passwordVerification) {
      return res.status(400).json({ message: "email or password incorrect" });
    }

    const token = jwt.sign(
      {
        username: existingUser.username,
        userId: existingUser.userId,
        email: existingUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d", // expires in 1 day
      },
    );
    console.log("jwt token>>>>>>>>>>>", token);

    res
      .status(200)
      .json({ message: "User Login successfully", jwtToken: token });
  } catch (error) {}
};
