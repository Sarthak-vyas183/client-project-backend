import mongoose, {Schema, Types} from "mongoose" 

const commentsSchema = new Schema(
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

        msg : {
            type : String,
            require : true
        }
    },
    {
        timestamps : true,
    }
)

export const commentsModel = mongoose.model("comments", commentsSchema);