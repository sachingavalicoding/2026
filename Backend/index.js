import express from "express";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.use("/api/users",userRoutes);

app.use(errorHandler)
const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

