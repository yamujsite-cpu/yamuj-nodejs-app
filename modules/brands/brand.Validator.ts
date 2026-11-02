import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const getBrandValidator = [
  check("id").optional().isMongoId().withMessage("brand.invalidId"),
  validatorMiddleware,
];

export const updateBrandValidator = [
  check("logos").optional().isArray().withMessage("brand.logosInvalid"),
  check("logos.*")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("brand.logoItemInvalid"),
  validatorMiddleware,
];
