import { Router } from "express";
const router = Router();
import { createNewPuja } from "../controller/PujasController.js";
import { verifyJWT, adminVerify } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

router
  .route("/createPuja")
  .post(verifyJWT, adminVerify, upload.single("pujaImg"), createNewPuja);

export default router;
