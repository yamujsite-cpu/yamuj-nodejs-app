import { Router } from "express";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import {
  getAbout,
  getAboutImages,
  resizeAboutImages,
  updateAbout,
} from "./about.service.js";
import { updateAboutValidator } from "./about.Validator.js";

const router = Router();

router
  .route("/")
  .get(getAbout)
  .put(
    protectRoutes,
    allowedTo("admin"),
    getAboutImages,
    resizeAboutImages,
    updateAboutValidator,
    updateAbout,
  );

export default router;

