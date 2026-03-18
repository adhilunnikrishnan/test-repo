import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});