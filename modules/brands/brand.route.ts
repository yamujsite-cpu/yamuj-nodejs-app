import { Router } from "express";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import {
  getBrand,
  getBrandImages,
  resizeBrandImages,
  updateBrand,
} from "./brand.service.js";
import { updateBrandValidator } from "./brand.Validator.js";

const router = Router();

router
  .route("/")
  .get(getBrand)
  .put( 
    protectRoutes,
    allowedTo("admin"),
    getBrandImages,
    resizeBrandImages,
    updateBrandValidator,
    updateBrand,
  );

export default router;

