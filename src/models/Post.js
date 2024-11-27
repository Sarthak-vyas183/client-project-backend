import mongoose, {mongo, Schema} from "mongoose" 

const postSchema = new Schema(
    {
        userId : {
            type : Schema.Types.ObjectId,
            require : true
        },

        title : {
            type : String,
            require : true
        },

        description : {
            type : String,
        },

        img : {
            type : String,      //cloudinary url
        } 

    },
    {
        timestamps : true
    }
)

export const postModel = mongoose.model("Posts", postSchema);