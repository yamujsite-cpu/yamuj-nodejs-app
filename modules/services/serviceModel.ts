import mongoose, { Schema } from "mongoose";

const serviceItemSchema = new Schema({
  subtitle: { type: String, default: "" },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
});

const serviceSchema = new Schema(
  {
    sortOrder: { type: Number, default: 0 },
    subtitle: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    items: [serviceItemSchema],
  },
  {
    timestamps: true,
  },
);

const ServiceModel = mongoose.model("Service", serviceSchema);

export default ServiceModel;
