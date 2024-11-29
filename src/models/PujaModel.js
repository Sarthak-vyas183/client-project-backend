import mongoose, { Schema, SchemaType } from "mongoose";

const pujaSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      require: true,
    },
    pujaImg: {
      type: String,
      require: true, //cloudinary url
    },
    pujaName: {
      type: String,
      require: true,
      unique: true,
    },

    title: {
      type: String,
      require: true,
    },

    description: {
      type: String,
      require: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    Instructor: {
      type: String,
      default: "Not Declare",
    },

    isServiceAvailable: {
      type: Boolean,
      default: true,
    },

    Instructions: {
      type: String,
      default: "Not Declare",
    },
  },
  {
    timestamps: true,
  }
);

export const PujaModel = mongoose.model("pujas", pujaSchema);
