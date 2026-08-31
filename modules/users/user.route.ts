import { Router } from "express";
import {
  activeUser,
  createNewUser,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getLoggedUserData,
  getSingleUser,
  login,
  protectRoutes,
  updateProfile,
  updateUser,
} from "./user.service.js";
import {
  createNewUserValidator,
  deleteSingleUserValidator,
  getSingleUserValidator,
  loginValidator,
  updateMyProfileValidator,
  updateSingleUserValidator
} from "./userValidator.js";

const router = Router();

router.post("/login", loginValidator, login);

router.post("/forget-password", forgetPassword);

router.get("/my-data", protectRoutes, getLoggedUserData, getSingleUser);

router.put(
  "/update-my-profile",
  protectRoutes,
  updateMyProfileValidator,
  updateProfile,
);

router.route("/").get(getAllUsers).post(createNewUserValidator, createNewUser);

router
  .route("/:id")
  .get(getSingleUserValidator, getSingleUser)
  .put(updateSingleUserValidator, updateUser)
  .delete(deleteSingleUserValidator, deleteUser)
  .patch(activeUser);

export default router;
