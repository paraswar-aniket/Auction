import { register } from "../controllers/userController.js";
import { logout } from "../controllers/userController.js";
import { fetchLeaderboard } from "../controllers/userController.js";
import { getProfile } from "../controllers/userController.js";
import { login } from "../controllers/userController.js";
import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register",register);

router.post("/login",login);

router.get("/me",isAuthenticated,getProfile);

router.get("/logout",isAuthenticated,logout);

router.get("/leaderboard",fetchLeaderboard);
 
export default router;