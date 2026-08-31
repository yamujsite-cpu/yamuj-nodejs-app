import { Router } from "express";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import {
  getTestimonial,
  getTestimonialImages,
  resizeTestimonialImages,
  updateTestimonial,
} from "./testimonial.service.js";
import { updateTestimonialValidator } from "./testimonial.Validator.js";

const router = Router();

router.use(protectRoutes, allowedTo("admin"));

router
  .route("/")
  .get(getTestimonial)
  .put( 
    getTestimonialImages,
    resizeTestimonialImages,
    updateTestimonialValidator,
    updateTestimonial,
  );

export default router;
