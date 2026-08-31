import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const updateSettingsValidator = [
  check("socialLinks").optional().isObject(),

  check("socialLinks.facebook")
    .optional()
    .isURL()
    .withMessage("Facebook must be a valid URL"),

  check("socialLinks.instagram")
    .optional()
    .isURL()
    .withMessage("Instagram must be a valid URL"),

  check("socialLinks.linkedIn")
    .optional()
    .isURL()
    .withMessage("LinkedIn must be a valid URL"),

  check("socialLinks.behance")
    .optional()
    .isURL()
    .withMessage("Behance must be a valid URL"),

  check("footerTitle").optional().isString(),
  check("footerDescription").optional().isString(),
  check("footerMessage").optional().isString(),

  validatorMiddleware,
];
