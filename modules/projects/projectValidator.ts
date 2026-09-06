import { check, type ValidationChain } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const getSingleProjectValidator = [
  check("id").isMongoId().withMessage("project.invalidId"),
  validatorMiddleware,
] as ValidationChain[];

export const createProjectValidator = [
  check("title.en")
    .notEmpty()
    .withMessage("project.titleEnRequired")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  check("title.ar").notEmpty().withMessage("project.titleArRequired"),
  check("description.en")
    .notEmpty()
    .withMessage("project.descEnRequired"),
  check("description.ar")
    .notEmpty()
    .withMessage("project.descArRequired"),
  check("video").optional().isString().withMessage("project.videoInvalid"),
  check("category").optional().isMongoId().withMessage("category.invalidId"),
  check("showInHome").optional().isBoolean().withMessage("project.showInHomeInvalid"),
  validatorMiddleware,
] as ValidationChain[];

export const updateProjectValidator = [
  check("id").isMongoId().withMessage("project.invalidId"),
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
  check("video").optional().isString().withMessage("project.videoInvalid"),
  check("category").optional().isMongoId().withMessage("category.invalidId"),
  check("showInHome").optional().isBoolean().withMessage("project.showInHomeInvalid"),
  validatorMiddleware,
] as ValidationChain[];

export const deleteProjectValidator = [
  check("id").isMongoId().withMessage("project.invalidId"),
  validatorMiddleware,
] as ValidationChain[];
