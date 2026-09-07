import { check, type ValidationChain } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const getSingleBlogValidator = [
  check("id").isMongoId().withMessage("blog.invalidId"),
  validatorMiddleware,
] as ValidationChain[];

export const createBlogValidator = [
  check("title.en")
    .notEmpty()
    .withMessage("blog.titleEnRequired")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  check("title.ar").notEmpty().withMessage("blog.titleArRequired"),
  check("description.en")
    .notEmpty()
    .withMessage("blog.descEnRequired"),
  check("description.ar")
    .notEmpty()
    .withMessage("blog.descArRequired"),
  check("video").optional().isString().withMessage("blog.videoInvalid"),
  check("showInHome").optional().isBoolean().withMessage("blog.showInHomeInvalid"),
  validatorMiddleware,
] as ValidationChain[];

export const updateBlogValidator = [
  check("id").isMongoId().withMessage("blog.invalidId"),
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
  check("video").optional().isString().withMessage("blog.videoInvalid"),
  check("showInHome").optional().isBoolean().withMessage("blog.showInHomeInvalid"),
  validatorMiddleware,
] as ValidationChain[];

export const deleteBlogValidator = [
  check("id").isMongoId().withMessage("blog.invalidId"),
  validatorMiddleware,
] as ValidationChain[];
