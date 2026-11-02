import { Router } from "express";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import { getServices, updateService } from "./service.service.js";
import { updateServiceValidator } from "./serviceValidator.js";

const router = Router();

router.use(protectRoutes, allowedTo("admin"));

router
  .route("/")
  .get(getServices)
  .put(
    updateServiceValidator,
    updateService,
  );

export default router;
