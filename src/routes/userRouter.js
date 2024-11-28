import { Router } from "express";
const router = Router();
import { loginUser, registerUser } from "../controller/userController.js";

router.route("/login").post(loginUser)
router.route("/signup").get(registerUser)

export default router;