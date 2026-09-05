import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getSingleDocument,
  updateDocument,
} from "../../utils/handlersFactory.js";
import CategoryModel from "./categoryModel.js";

/**
 * @description get all categories
 * @route GET /api/categories
 * @access Public
 */
export const getAllCategories = getAllDocuments(CategoryModel, "projectsCount");

/**
 * @description get single category by id
 * @route GET /api/categories/:id
 * @access Public
 */
export const getSingleCategory = getSingleDocument(CategoryModel, "projectsCount");

/**
 * @description Create new category
 * @route POST /api/categories
 * @access Private (Admin)
 */
export const createNewCategory = createDocument(CategoryModel);

/**
 * @description update category by id
 * @route PUT /api/categories/:id
 * @access Private (Admin)
 */
export const updateCategory = updateDocument(CategoryModel);

/**
 * @description delete category by id
 * @route DELETE /api/categories/:id
 * @access Private (Admin)
 */
export const deleteCategory = deleteDocument(CategoryModel);
