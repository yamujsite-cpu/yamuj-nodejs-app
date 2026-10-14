import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema(
  {
    logos: [{ type: String }],
  },
  {
    timestamps: true,
  },
);

const BrandModel = mongoose.model("Brand", brandSchema);

export default BrandModel;
