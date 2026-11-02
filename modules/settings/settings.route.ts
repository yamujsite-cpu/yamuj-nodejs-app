import { Router } from "express";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import { parseSettingsBody } from "./settings.parse.js";
import {
  getSettingsController,
  updateSettingsController,
} from "./settings.service.js";
import { updateSettingsValidator } from "./settingsValidator.js";

const router = Router();

router.get("/", getSettingsController);

router.use(protectRoutes, allowedTo("admin"));

router.patch(
  "/",
  parseSettingsBody,
  updateSettingsValidator,
  updateSettingsController,
);

export default router;
