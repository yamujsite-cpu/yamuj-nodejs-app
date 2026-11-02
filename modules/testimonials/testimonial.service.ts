import expressAsyncHandler from "express-async-handler";
import TestimonialModel from "./testimonialModel.js";

export const updateTestimonial = expressAsyncHandler(async (req, res, next) => {
  if (typeof req.body.items === "string") {
    try {
      req.body.items = JSON.parse(req.body.items);
    } catch {
      // validator or schema will handle
    }
  }

  const data = await TestimonialModel.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
  });

  res.json({
    message: "Testimonials updated successfully",
    data,
    status: "Success",
  });
});

export const getTestimonial = expressAsyncHandler(async (req, res, next) => {
  const data = await TestimonialModel.findOne();

  res.json({
    status: "Success",
    data: {
      item: data,
    },
  });
});
