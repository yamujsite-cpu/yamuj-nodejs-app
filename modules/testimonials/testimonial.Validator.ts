import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const updateTestimonialValidator = [
  check("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .trim(),
  check("subtitle")
    .optional()
    .isString()
    .withMessage("Subtitle must be a string")
    .trim(),
  check("sortOrder")
    .optional()
    .isNumeric()
    .withMessage("Sort order must be a number"),
  check("items")
    .notEmpty()
    .withMessage("Items are required")
    .isArray({ min: 1 })
    .withMessage("Items must be an array with at least one testimonial"),
  check("items.*.name")
    .optional()
    .isString()
    .withMessage("Item name must be a string")
    .trim(),
  check("items.*.role")
    .optional()
    .isString()
    .withMessage("Item role must be a string")
    .trim(),
  check("items.*.message")
    .optional()
    .isString()
    .withMessage("Item message must be a string")
    .trim(),
  check("items.*.image")
    .optional()
    .isString()
    .withMessage("Item image must be a string")
    .trim(),
  validatorMiddleware,
];
