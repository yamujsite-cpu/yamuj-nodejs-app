import { check, type ValidationChain } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const getSingleBlogValidator = [
  check("id").isMongoId().withMessage("Invalid blog ID"),
  validatorMiddleware,
] as ValidationChain[];

export const createBlogValidator = [
  check("title.en")
    .notEmpty()
    .withMessage("English title is required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  check("title.ar").notEmpty().withMessage("Arabic title is required"),
  check("description.en")
    .notEmpty()
    .withMessage("English description is required"),
  check("description.ar")
    .notEmpty()
    .withMessage("Arabic description is required"),
  check("video").optional().isString().withMessage("Video must be a string URL"),
  check("showInHome").optional().isBoolean().withMessage("showInHome must be a boolean"),
  validatorMiddleware,
] as ValidationChain[];

export const updateBlogValidator = [
  check("id").isMongoId().withMessage("Invalid blog ID"),
  check("title.en")
    .optional()
    .custom((val, { req }) => {
      if (val) {
        req.body.slug = slugify(val, { lower: true });
      }
      return true;
    }),
  check("title.ar").optional(),
  check("description.en").optional(),
  check("description.ar").optional(),
  check("video").optional().isString().withMessage("Video must be a string URL"),
  check("showInHome").optional().isBoolean().withMessage("showInHome must be a boolean"),
  validatorMiddleware,
] as ValidationChain[];

export const deleteBlogValidator = [
  check("id").isMongoId().withMessage("Invalid blog ID"),
  validatorMiddleware,
] as ValidationChain[];
