import jwt from "jsonwebtoken";
import {userModel} from "../models/UserModel"

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(404).send("Invalid Token : Unauthorized entry")
    }

    const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await userModel
      .findById(decodedData._id)
      .select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "Invalid token Access");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
};
