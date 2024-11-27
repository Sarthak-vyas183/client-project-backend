import mongoose, {Schema, Types} from "mongoose" 

const LikeSchema = new Schema(
    {
        userid : {
            type : Schema.Types.ObjectId,
            ref : "Users",
            require : true
        },

        postid : {
            type : Schema.Types.ObjectId,
            ref : "Posts",
            require : true
        },

        likeStatus : {
           type : Boolean,
           require : true
        }
    }
)

export const LikeModel = mongoose.model("Likes", LikeSchema);