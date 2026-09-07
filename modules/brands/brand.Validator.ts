import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const getBrandValidator = [
  check("id").optional().isMongoId().withMessage("brand.invalidId"),
  validatorMiddleware,
];

export const updateBrandValidator = [
  check("title.en")
    .optional()
    .isString()
    .withMessage("brand.titleEnInvalid")
    .trim()
    .custom((val, { req }) => {
      if (val) {
        req.body.slug = slugify(val, { lower: true });
      }
      return true;
    }),
  check("title.ar")
    .optional()
    .isString()
    .withMessage("brand.titleArInvalid")
    .trim(),
  check("description.en")
    .optional()
    .isString()
    .withMessage("brand.descEnInvalid")
    .trim(),
  check("description.ar")
    .optional()
    .isString()
    .withMessage("brand.descArInvalid")
    .trim(),
  check("sortOrder")
    .optional()
    .isNumeric()
    .withMessage("brand.sortOrderInvalid"),
  check("logos").optional().isArray().withMessage("brand.logosInvalid"),
  check("logos.*").optional().isString().withMessage("brand.logoItemInvalid"),
  validatorMiddleware,
];
