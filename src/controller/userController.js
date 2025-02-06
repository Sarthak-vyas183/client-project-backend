import { userModel } from "../models/UserModel.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return res.status(500).send("something went wrong ! please try again");
  }
};

const loginUser = async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { email, password, username } = req.body;

  if (!email && !username) {
    return res.status(400).json({ msg: "invalid credentials" });
  }

  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res.status(404).send("Invalid credentials");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.status(400).send("Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return (
    res
      .status(200)
      //.cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        msg: "login success",
        data: {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
      })
  );
};

const registerUser = async (req, res) => {
  const { email, fullName, password, username, contact } = req.body;
  if (
    [email, fullName, password, username, contact].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    return res.status(405).send("All fields are required");
  }

  const existUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (existUser) {
    return res.status(409).send("User already exists");
  }

  const user = await userModel.create({
    fullName,
    email,
    password,
    username,
    contact,
  });

  const createdUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  if (!createdUser) {
    throw res.json({
      statusCode: 500,
      msg: "something went wrong while registring user",
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    createdUser._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(201)
    .cookie("refreshToken", refreshToken, options)
    .json({
      statusCode: 200,
      data: {
        user: createdUser,
        accessToken,
        refreshToken,
      },
      msg: "Registration success",
    });
};

const logoutuser = async (req, res) => {
  await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ data: {}, msg: "loggedout" });
};

const updateProfileImage = async (req, res) => {
  try {
     const avatarLocalPath = req.file?.path;
     if(!avatarLocalPath) return res.status(400).json({msg : "Please provide an image"});
     const avatarUrl = await uploadOnCloudinary(avatarLocalPath); 
     if(!avatarUrl) return res.status(500).json({msg : "Something went wrong while uploading image"});
     const user = await userModel
     .findByIdAndUpdate(
       req.user?._id,
       {
         $set: {
           avatar: avatarUrl.url,
         },
       },
       { new: true }
     )
     .select("-password -refreshToken"); 
     if(!user) return res.status(500).json({msg : "Something went wrong while updating image"});
     res.status(200).json({msg : "Image uploaded successfully", data : user});

  } catch (error) {
    res.send(error) 
  }
  
}

const updateProfile = async (req, res) => { 
  try {
    const { fullName, username, bio, contact, email } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          fullName,
          username,
          bio,
          contact,
          email,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    if (!user) {
      return res.status(500).json({ msg: "Something went wrong while updating profile" });
    }

    res.status(200).json({ msg: "Profile updated successfully", data: user });
  } catch (error) {
    res.status(500).send(error);
  }
};

const verificationDone = (req, res) => {
  const user = req.user;
  res.status(201).json({ msg: "token verification Success", userdata: user });
};

export { loginUser, registerUser, logoutuser, verificationDone, updateProfileImage, updateProfile };
