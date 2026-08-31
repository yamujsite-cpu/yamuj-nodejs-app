import { hash } from "bcryptjs";
import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const createNewUserValidator = [
  check("name").notEmpty().withMessage("User name is required"),
  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom(async (val, { req }) => {
      const password = await hash(val, 12);
      req.body.password = password;
      return true;
    }),
  validatorMiddleware,
];

export const getSingleUserValidator = [
  check("id").notEmpty().withMessage("User id is required"),
  validatorMiddleware,
];

export const updateSingleUserValidator = [
  check("id").notEmpty().withMessage("User id is required"),
  check("name").optional(),
  check("email").optional().isEmail().withMessage("Invalid email format"),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validatorMiddleware,
];

export const updateMyProfileValidator = [
  check("name").optional(),
  check("email").optional().isEmail().withMessage("Invalid email format"),
  check("oldPassword")
    .optional()
    .notEmpty()
    .withMessage("Old password is required"),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validatorMiddleware,
];

export const deleteSingleUserValidator = [
  check("id").notEmpty().withMessage("User id is required"),
  validatorMiddleware,
];

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export const forgetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
];