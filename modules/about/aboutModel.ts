import mongoose, { Schema } from "mongoose";

const aboutSchema = new Schema(
  {
    // sortOrder: { type: Number, default: 0 },
    subtitle: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

const AboutModel = mongoose.model("About", aboutSchema);

export default AboutModel;
