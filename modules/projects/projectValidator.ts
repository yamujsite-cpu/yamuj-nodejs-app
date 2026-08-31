import { check, type ValidationChain } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const getSingleProjectValidator = [
  check("id").isMongoId().withMessage("Invalid project ID"),
];

export const createProjectValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  check("description").notEmpty().withMessage("Description is required"),
  check("video").optional().isString().withMessage("Video must be a string URL"),
  check("showInHome").optional().isBoolean().withMessage("showInHome must be a boolean"),
  validatorMiddleware,
] as ValidationChain[];

export const updateProjectValidator = [
  check("id").isMongoId().withMessage("Invalid project ID"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  check("video").optional().isString().withMessage("Video must be a string URL"),
  check("showInHome").optional().isBoolean().withMessage("showInHome must be a boolean"),
  validatorMiddleware,
] as ValidationChain[];

export const deleteProjectValidator = [
  check("id").isMongoId().withMessage("Invalid project ID"),
];
