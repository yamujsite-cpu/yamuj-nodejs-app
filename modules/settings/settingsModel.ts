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
      type: String,
      default: "",
    },
    footerDescription: {
      type: String,
      default: "",
    },
    footerMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const SettingsModel = mongoose.model("Settings", settingsSchema);

export default SettingsModel;
