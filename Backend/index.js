import express from "express";
import userRoutes from "./routes/user.routes.js";
import userController from "./controllers/user.controller.js";

const app = express();

app.use(express.json());

app.use("/api/users",userRoutes);

const PORT 