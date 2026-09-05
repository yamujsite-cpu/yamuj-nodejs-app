import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    images: [
      {
        type: String,
      },
    ],
    imageCover: {
      type: String,
    },
    video: {
      type: String,
    },
    showInHome: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

projectSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
  this.populate("category", "name");
});


const ProjectModel = mongoose.model("Project", projectSchema);

export default ProjectModel;
