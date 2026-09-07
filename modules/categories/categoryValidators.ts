import { check } from "express-validator";
import slugify from "slugify";

import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import ProjectModel from "../projects/projectModel.js";
import CategoryModel from "./categoryModel.js";

export const getSingleCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("category.invalidId"),

  validatorMiddleware,
];

export const createCategoryValidator = [
  check("name.en")
    .notEmpty()
    .withMessage("category.nameEnRequired")
    .isLength({ min: 2 })
    .withMessage("category.nameEnMin")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });

      return true;
    }),

  check("name.ar")
    .notEmpty()
    .withMessage("category.nameArRequired")
    .isLength({ min: 2 })
    .withMessage("category.nameArMin"),

  validatorMiddleware,
];

export const updateCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("category.invalidId"),

  check("name.en")
    .notEmpty()
    .withMessage("category.nameEnRequired")
    .isLength({ min: 2 })
    .withMessage("category.nameEnMin"),

  check("name.ar")
    .notEmpty()
    .withMessage("category.nameArRequired")
    .isLength({ min: 2 })
    .withMessage("category.nameArMin"),

  validatorMiddleware,
];

export const deleteCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("category.invalidId")
    .custom(async (val) => {
      const category = await CategoryModel.findById(val);
      if (!category) {
        throw new Error("category.notFound");
      }

      const projectsCount = await ProjectModel.countDocuments({ category: val });
      if (projectsCount > 0) {
        throw new Error("category.cannotDeleteWithProjects");
      }

      return true;
    }),

  validatorMiddleware,
];