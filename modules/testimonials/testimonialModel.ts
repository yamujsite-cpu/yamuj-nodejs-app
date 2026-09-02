import mongoose, { Schema } from "mongoose";

const testimonialItemSchema = new Schema({
  name: { type: String, default: "" },
  role: { type: String, default: "" },
  message: { type: String, default: "" },
  image: { type: String, default: "" },
});

const testimonialSchema = new Schema(
  {
    sortOrder: { type: Number, default: 0 },
    subtitle: { en: { type: String, default: "" }, ar: { type: String, default: "" } },
    title: { en: { type: String, default: "" }, ar: { type: String, default: "" } },
    items: [testimonialItemSchema],
  },
  {
    timestamps: true,
  },
);

const TestimonialModel = mongoose.model("Testimonial", testimonialSchema);

export default TestimonialModel;
