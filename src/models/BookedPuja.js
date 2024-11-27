import mongoose, { Schema, SchemaType } from "mongoose";

const pujaSchema = new Schema(
  {
    puja_id: {
     type : Schema.Types.ObjectId,
     ref : "pujas"
    }, 

    fullname : {
        type : String,
        require : true
    },

    contact : {
        type : String,
        require : true
    },

    email : {
        type : String,
    },

    msg : {
        type : String
    },

    status: {
      type: String,
    }, 

  },
  {
    timestamps: true,
  }
);

export const PujaModel = mongoose.model("pujas", pujaSchema);