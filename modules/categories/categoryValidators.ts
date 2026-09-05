import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const getSingleCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID"),
  validatorMiddleware,
];

export const createCategoryValidator = [
  check("name.en")
    .notEmpty()
    .withMessage("اسم الفئة باللغة الإنجليزية مطلوب")
    .isLength({ min: 2 })
    .withMessage("اسم الفئة باللغة الإنجليزية يجب أن يكون حرفين على الأقل")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  check("name.ar")
    .notEmpty()
    .withMessage("Arabic category name is required")
    .isLength({ min: 2 })
    .withMessage("Arabic category name must be at least 2 characters long"),
  validatorMiddleware,
];

export const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID"),
  check("name.en")
    .optional()
    .isString()
    .withMessage("اسم الفئة باللغة الإنجليزية مطلوب")
    .isLength({ min: 2 })
    .withMessage("اسم الفئة باللغة الإنجليزية يجب أن يكون حرفين على الأقل")
    .custom((val, { req }) => {
      if (val) {
        req.body.slug = slugify(val, { lower: true });
      }
      return true;
    }),
  check("name.ar")
    .optional()
    .isString()
    .withMessage("Arabic category name must be a string")
    .isLength({ min: 2 })
    .withMessage("Arabic category name must be at least 2 characters long"),
  validatorMiddleware,
];

export const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID"),
  validatorMiddleware,
];
