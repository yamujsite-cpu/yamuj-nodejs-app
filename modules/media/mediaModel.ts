import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    originalName: {
      type: String,
      trim: true,
      default: "",
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    mimeType: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    },
    format: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    width: {
      type: Number,
      min: 0,
    },
    height: {
      type: Number,
      min: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ originalName: 1 });
mediaSchema.index({ name: 1 });
mediaSchema.index({ format: 1, mimeType: 1, createdAt: -1 });

const MediaModel = mongoose.model("Media", mediaSchema);

export default MediaModel;
