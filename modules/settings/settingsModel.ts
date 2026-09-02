import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    socialLinks: {
      facebook: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      linkedIn: {
        type: String,
        default: "",
      },
      behance: {
        type: String,
        default: "",
      },
    },
    logo: {
      type: String,
      default: "",
    },
    footerLogo: {
      type: String,
      default: "",
    },
    footerTitle: {
      en: { type: String, default: "" },
      ar: { type: String, default: "" },
    },
    footerDescription: {
      en: { type: String, default: "" },
      ar: { type: String, default: "" },
    },
    footerMessage: {
      en: { type: String, default: "" },
      ar: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

const SettingsModel = mongoose.model("Settings", settingsSchema);

export default SettingsModel;
