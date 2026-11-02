import { Router } from "express";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import { getBrand, updateBrand } from "./brand.service.js";
import { updateBrandValidator } from "./brand.Validator.js";

const router = Router();

router
  .route("/")
  .get(getBrand)
  .put(
    protectRoutes,
    allowedTo("admin"),
    updateBrandValidator,
    updateBrand,
  );

export default router;
