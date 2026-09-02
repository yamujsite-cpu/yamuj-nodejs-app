import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const getBrandValidator = [
  check("id").optional().isInt().withMessage("Invalid ID"),
  validatorMiddleware,
];

export const updateBrandValidator = [
  check("title.en")
    .optional()
    .isString()
    .withMessage("English title must be a string")
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
    .withMessage("Arabic title must be a string")
    .trim(),
  check("sortOrder")
    .optional()
    .isNumeric()
    .withMessage("Sort order must be a number"),
  check("logos").optional().isArray().withMessage("Logos must be an array"),
  check("logos.*").optional().isString().withMessage("Logo must be a string"),
  validatorMiddleware,
];
