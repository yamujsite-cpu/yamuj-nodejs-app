import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const updateAboutValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .trim(),
  check("subtitle")
    .optional()
    .isString()
    .withMessage("Subtitle must be a string")
    .trim(),
  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string")
    .trim(),
  check("sortOrder")
    .optional()
    .isNumeric()
    .withMessage("Sort order must be a number"),
  check("image")
    .notEmpty()
    .withMessage("Image is required")
    .isString()
    .withMessage("Image must be a string"),
  validatorMiddleware,
];
