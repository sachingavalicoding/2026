
import express from "express";
import { getUser, getProfile } from  "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", getUser, authMiddleware);
router.get("/profile",getProfile , authMiddleware);


export default router;