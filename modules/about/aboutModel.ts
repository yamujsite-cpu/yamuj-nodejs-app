import mongoose, { Schema } from "mongoose";

const aboutSchema = new Schema(
  {
    // sortOrder: { type: Number, default: 0 },
    subtitle: {
      en: { type: String, default: "" },
      ar: { type: String, default: "" },
    },
    title: {
      en: { type: String, default: "" },
      ar: { type: String, default: "" },
    },
    description: {
      en: { type: String, default: "" },
      ar: { type: String, default: "" },
    },
    image: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

const AboutModel = mongoose.model("About", aboutSchema);

export default AboutModel;
