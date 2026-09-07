import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const updateSettingsValidator = [
  check("socialLinks").optional().isObject(),

  check("socialLinks.facebook")
    .optional()
    .isURL()
    .withMessage("settings.facebookInvalidUrl"),

  check("socialLinks.instagram")
    .optional()
    .isURL()
    .withMessage("settings.instagramInvalidUrl"),

  check("socialLinks.linkedIn")
    .optional()
    .isURL()
    .withMessage("settings.linkedInInvalidUrl"),

  check("socialLinks.twitter")
    .optional()
    .isURL()
    .withMessage("settings.twitterInvalidUrl"),

  check("whatsapp")
    .optional()
    .isString()
    .withMessage("settings.whatsappInvalid"),

  check("footerTitle.en")
    .optional()
    .isString()
    .withMessage("settings.footerTitleEnInvalid"),
  check("footerTitle.ar")
    .optional()
    .isString()
    .withMessage("settings.footerTitleArInvalid"),

  check("footerMessage.en")
    .optional()
    .isString()
    .withMessage("settings.footerMessageEnInvalid"),
  check("footerMessage.ar")
    .optional()
    .isString()
    .withMessage("settings.footerMessageArInvalid"),

  validatorMiddleware,
];
