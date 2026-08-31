import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema(
  {
    sortOrder: { type: Number, default: 0 },
    title: { type: String, default: "" },
    logos: [{ type: String }],
  },
  {
    timestamps: true,
  },
);

const BrandModel = mongoose.model("Brand", brandSchema);

export default BrandModel;
