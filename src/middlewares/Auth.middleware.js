import jwt from "jsonwebtoken";
import { userModel } from "../models/UserModel.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
      console.log(token)
    if (!token) {
      res.status(404).send("Invalid Token : Unauthorized entry")
    }

    const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await userModel
      .findById(decodedData._id)
      .select("-password -refreshToken");
    if (!user) {
      return res.status(409).send("Invalid Token access");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).send(`error found : ${error || "invalid Access Token"}`)
  }
};
