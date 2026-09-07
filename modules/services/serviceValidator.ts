import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const updateServiceValidator = [
  check("title.en")
    .optional()
    .isString()
    .withMessage("service.titleEnInvalid")
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
    .withMessage("service.titleArInvalid")
    .trim(),
  check("description.en")
    .optional()
    .isString()
    .withMessage("service.descEnInvalid")
    .trim(),
  check("description.ar")
    .optional()
    .isString()
    .withMessage("service.descArInvalid")
    .trim(),
  check("sortOrder")
    .optional()
    .isNumeric()
    .withMessage("service.sortOrderInvalid"),
  check("items").optional().isArray().withMessage("service.itemsInvalid"),
  check("items.*.title.en")
    .optional()
    .isString()
    .withMessage("service.itemTitleEnInvalid")
    .trim(),
  check("items.*.title.ar")
    .optional()
    .isString()
    .withMessage("service.itemTitleArInvalid")
    .trim(),
  check("items.*.description.en")
    .optional()
    .isString()
    .withMessage("service.itemDescEnInvalid")
    .trim(),
  check("items.*.description.ar")
    .optional()
    .isString()
    .withMessage("service.itemDescArInvalid")
    .trim(),
  check("items.*.image")
    .optional()
    .isString()
    .withMessage("service.itemImageInvalid")
    .trim(),
  validatorMiddleware,
];
