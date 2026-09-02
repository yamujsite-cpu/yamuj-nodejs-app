import { Router } from "express";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import {
  getServices,
  getServiceImages,
  resizeServiceImages,
  updateService,
} from "./service.service.js";
import { updateServiceValidator } from "./serviceValidator.js";

const router = Router();

router.use(protectRoutes, allowedTo("admin"));

router
  .route("/")
  .get(getServices)
  .put( 
    getServiceImages,
    resizeServiceImages,
    updateServiceValidator,
    updateService,
  );

export default router;
