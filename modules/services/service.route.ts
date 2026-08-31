import { Router } from "express";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import {
    getService,
    getServiceImages,
    resizeServiceImages,
    updateService,
} from "./service.service.js";
import { updateServiceValidator } from "./service.Validator.js";

const router = Router();

router.use(protectRoutes, allowedTo("admin"));

router
  .route("/")
  .get(getService)
  .put( 
    getServiceImages,
    resizeServiceImages,
    updateServiceValidator,
    updateService,
  );

export default router;
