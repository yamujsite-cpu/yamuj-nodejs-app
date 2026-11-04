import { check, query, type ValidationChain } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const mediaIdValidator = [
  check("id").isMongoId().withMessage("Invalid media id"),
  validatorMiddleware,
] as ValidationChain[];

export const listMediaValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search must not exceed 100 characters"),
  query("sort")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort must be asc or desc"),
  query("format")
    .optional()
    .isIn(["jpg", "jpeg", "png", "webp", "gif"])
    .withMessage("Unsupported image format"),
  query("mimeType")
    .optional()
    .isIn(["image/jpeg", "image/png", "image/webp", "image/gif"])
    .withMessage("Unsupported MIME type"),
  validatorMiddleware,
] as ValidationChain[];
