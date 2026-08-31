import { Router } from "express";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getSingleBlog,
  resizeBlogImage,
  updateBlog,
  uploadBlogImage,
} from "./blog.service.js";
import {
  createBlogValidator,
  deleteBlogValidator,
  getSingleBlogValidator,
  updateBlogValidator,
} from "./blogValidator.js";

const router = Router();

router
  .route("/")
  .get(getAllBlogs)
  .post(
    protectRoutes,
    allowedTo("admin"),
    uploadBlogImage,
    resizeBlogImage,
    createBlogValidator,
    createBlog,
  );

router
  .route("/:id")
  .get(getSingleBlogValidator, getSingleBlog)
  .put(
    protectRoutes,
    allowedTo("admin"),
    uploadBlogImage,
    resizeBlogImage,
    updateBlogValidator,
    updateBlog,
  )
  .delete(
    protectRoutes,
    allowedTo("admin"),
    deleteBlogValidator,
    deleteBlog,
  );

export default router;
