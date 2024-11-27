import mongoose, { Schema } from "mongoose";

const pujaSchema = new Schema(
  {
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
    },

    Instructor: {
      type: String,
    },

    isServiceAvailable: {
      type: Boolean,
    },

    Instructions: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const PujaModel = mongoose.model("pujas", pujaSchema);