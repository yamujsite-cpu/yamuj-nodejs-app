import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const getContactMessageValidator = [
  check("id").isMongoId().withMessage("Invalid contact message id format"),
  validatorMiddleware,
];

export const createContactMessageValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("subject").notEmpty().withMessage("Subject is required"),
  check("message").notEmpty().withMessage("Message is required"),
  validatorMiddleware,
];

export const replyToContactMessageValidator = [
  check("id").isMongoId().withMessage("Invalid contact message id format"),
  check("message").notEmpty().withMessage("Message is required"),
  validatorMiddleware,
];

export const deleteContactMessageValidator = [
  check("id").isMongoId().withMessage("Invalid contact message id format"),
  validatorMiddleware,
];
