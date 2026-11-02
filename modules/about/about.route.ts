import { Router } from "express";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import { getAbout, updateAbout } from "./about.service.js";
import { updateAboutValidator } from "./about.Validator.js";

const router = Router();

router
  .route("/")
  .get(getAbout)
  .put(
    protectRoutes,
    allowedTo("admin"),
    updateAboutValidator,
    updateAbout,
  );

export default router;
