import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const getBrandValidator = [
  check("id").optional().isInt().withMessage("Invalid ID"),
  validatorMiddleware,
];

export const updateBrandValidator = [
  check("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .trim(),
  check("sortOrder")
    .optional()
    .isNumeric()
    .withMessage("Sort order must be a number"),
  check("logos").optional().isArray().withMessage("Logos must be an array"),
  check("logos.*").optional().isString().withMessage("Logo must be a string"),
  validatorMiddleware,
];
