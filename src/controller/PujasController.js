import { PujaModel } from "../models/PujaModel.js";
import { upload } from "../middlewares/multer.middleware.js";
import {uploadOnCloudinary} from "../utils/uploadOnCloudinary.js"

const createNewPuja = async (req, res) => {
  try {
    const { pujaName, title, description } = req.body;
    console.log(req.body)
    
  

    const pujaImgLocalPath = req.file?.path;

    if(!pujaImgLocalPath) {
     return res.status(404).send("Puja image not found : Invalid formate");
    } 
    console.log(pujaImgLocalPath)
    const pujaImg = await uploadOnCloudinary(pujaImgLocalPath);
    if(!pujaImg) {
     return res.status(404).send("uplodation on cloudinary failed");
    } 

     const createdPuja = await PujaModel.create({
          owner : req.user?._id,
          pujaName,
          title,
          description,
          pujaImg : pujaImg.url,
          price : req.body.price? req.body.price : 0
     }) 

     if(!createdPuja) {
          return res.status(400).send("Creation of New Puja failed");
     } 

     res.status(200).json({data : createdPuja, msg : "Puja created"});
  } catch (error) {
    return res.status(500).send(`${error} : internal server error`);
  }
};

export { createNewPuja };
