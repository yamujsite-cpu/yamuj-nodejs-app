import { Router } from "express";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import {
  createNewCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "./category.service.js";
import {
  createCategoryValidator,
  deleteCategoryValidator,
  getSingleCategoryValidator,
  updateCategoryValidator,
} from "./categoryValidators.js";

const router = Router();

router.route("/").get(getAllCategories);

router.use(protectRoutes, allowedTo("admin"));

router.route("/").post(createCategoryValidator, createNewCategory);

router
  .route("/:id")
  .get(getSingleCategoryValidator, getSingleCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

export default router;
