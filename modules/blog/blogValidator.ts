import { check, type ValidationChain } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const getSingleBlogValidator = [
  check("id").isMongoId().withMessage("Invalid blog ID"),
  validatorMiddleware,
] as ValidationChain[];

export const createBlogValidator = [
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

export const updateBlogValidator = [
  check("id").isMongoId().withMessage("Invalid blog ID"),
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

export const deleteBlogValidator = [
  check("id").isMongoId().withMessage("Invalid blog ID"),
  validatorMiddleware,
] as ValidationChain[];
