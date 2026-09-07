import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const getContactMessageValidator = [
  check("id").isMongoId().withMessage("contactMessage.invalidId"),
  validatorMiddleware,
];

export const createContactMessageValidator = [
  check("name").notEmpty().withMessage("contactMessage.nameRequired"),
  check("email")
    .notEmpty()
    .withMessage("contactMessage.emailRequired")
    .isEmail()
    .withMessage("contactMessage.emailInvalid"),
  check("subject").notEmpty().withMessage("contactMessage.subjectRequired"),
  check("message").notEmpty().withMessage("contactMessage.messageRequired"),
  validatorMiddleware,
];

export const replyToContactMessageValidator = [
  check("id").isMongoId().withMessage("contactMessage.invalidId"),
  check("message").notEmpty().withMessage("contactMessage.messageRequired"),
  validatorMiddleware,
];

export const deleteContactMessageValidator = [
  check("id").isMongoId().withMessage("contactMessage.invalidId"),
  validatorMiddleware,
];
