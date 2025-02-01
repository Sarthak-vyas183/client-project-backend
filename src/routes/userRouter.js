import { Router } from "express";
const router = Router();
import { loginUser, registerUser, logoutuser, verificationDone, updateProfileImage } from "../controller/userController.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"; 

router.route("/login").post(loginUser);
router.route("/signup").post(registerUser);
router.route("/logout").get(verifyJWT, logoutuser);
router.route("/verify").post(verifyJWT, verificationDone);
router.route("/avatar").post(verifyJWT, upload.single("avatar"), updateProfileImage);

export default router;
