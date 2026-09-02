import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const updateServiceValidator = [
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
  check("subtitle.en")
    .optional()
    .isString()
    .withMessage("English subtitle must be a string")
    .trim(),
  check("subtitle.ar")
    .optional()
    .isString()
    .withMessage("Arabic subtitle must be a string")
    .trim(),
  check("description.en")
    .optional()
    .isString()
    .withMessage("English description must be a string")
    .trim(),
  check("description.ar")
    .optional()
    .isString()
    .withMessage("Arabic description must be a string")
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
