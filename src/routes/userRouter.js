import { Router } from "express";
const router = Router();
import { loginUser, registerUser, logoutuser } from "../controller/userController.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js"

router.route("/login").post(loginUser);
router.route("/signup").post(registerUser);
router.route("/logout").get(verifyJWT, logoutuser)

export default router;
