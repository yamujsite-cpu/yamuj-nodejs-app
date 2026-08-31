import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const updateServiceValidator = [
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
  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim(),
  check("sortOrder")
    .optional()
    .isNumeric()
    .withMessage("Sort order must be a number"),
  check("image")
    .optional()
    .isString()
    .withMessage("Service image must be a string")
    .trim(),
  check("items").optional().isArray().withMessage("Items must be an array"),
  check("items.*.title")
    .optional()
    .isString()
    .withMessage("Item title must be a string")
    .trim(),
  check("items.*.subtitle")
    .optional()
    .isString()
    .withMessage("Item subtitle must be a string")
    .trim(),
  check("items.*.description")
    .optional()
    .isString()
    .withMessage("Item description must be a string")
    .trim(),
  check("items.*.image")
    .optional()
    .isString()
    .withMessage("Item image must be a string")
    .trim(),
  validatorMiddleware,
];
