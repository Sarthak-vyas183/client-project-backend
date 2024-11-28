import {userModel} from "../models/UserModel.js"; 


const generateAccessAndRefereshTokens = async (userId) => {
   try {
     const user = await userModel.findById(userId);
     const accessToken = user.generateAccessToken();
     const refreshToken = user.generateRefreshToken();
 
     user.refreshToken = refreshToken;
     await user.save({ validateBeforeSave: false });
 
     return { accessToken, refreshToken };
   } catch (error) {
     throw new ApiError(
       500,
       "Something went wrong while generating referesh and access token"
     );
   }
 };
 

const loginUser = (async (req, res) => {
   // req body -> data
   // username or email
   //find the user
   //password check
   //access and referesh token
   //send cookie
 
   const { email, password, username } = req.body;
 
   if (!email && !username) {
    return res.status(400).json({msg : "invalid credentials"})
   }
 
   const user = await userModel.findOne({
     $or: [{ username }, { email }],
   });
 
   if (!user) {
     return res.status(404).send("Invalid credentials");
   }
 
   const isPasswordValid = await user.isPasswordCorrect(password);
 
   if(!isPasswordValid) {
     return res.status(400).send("Invalid credentials")
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
 
   return res
     .status(200)
     //.cookie("accessToken", accessToken, options)
     .cookie("refreshToken", refreshToken, options)
     .json(
          {
            msg : "login success",
            data : {
               user: loggedInUser,
               accessToken,
               refreshToken,
            },
          }
     );
});


const registerUser = async (req, res) => {
   const { email, fullName, password, username, contact } = req.body;

   if(
     [email, fullName, password, username, contact].some(
       (fields) => fields?.trim() === ""
     )
   ) {
     return res.status(400).send("All fields are require")
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
     throw res.json({statusCode : 500, msg : "something went wrong while registring user"});
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
     .json(
         {
         statusCode : 200,
        data :  {
           user: createdUser,
           accessToken,
           refreshToken,
         },
        msg :   "Registration success"
      }
 );};

export { loginUser, registerUser };