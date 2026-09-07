import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const updateAboutValidator = [
  check("title.en")
    .optional()
    .isString()
    .withMessage("about.titleEnInvalid")
    .trim(),
  check("title.ar")
    .optional()
    .isString()
    .withMessage("about.titleArInvalid")
    .trim(),
  check("subtitle.en")
    .optional()
    .isString()
    .withMessage("about.subtitleEnInvalid")
    .trim(),
  check("subtitle.ar")
    .optional()
    .isString()
    .withMessage("about.subtitleArInvalid")
    .trim(),
  check("description.en")
    .optional()
    .isString()
    .withMessage("about.descEnInvalid")
    .trim(),
  check("description.ar")
    .optional()
    .isString()
    .withMessage("about.descArInvalid")
    .trim(),
  check("sortOrder")
    .optional()
    .isNumeric()
    .withMessage("about.sortOrderInvalid"),
  check("image")
    .optional()
    .isString()
    .withMessage("about.imageInvalid"),
  validatorMiddleware,
];
