import { Router } from "express";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import { createBlog, deleteBlog, getAllBlogsForAdmin, getAllBlogs, getSingleBlogForAdmin, getSingleBlog, updateBlog, } from "./blog.service.js";
import { createBlogValidator, deleteBlogValidator, getSingleBlogValidator, updateBlogValidator, } from "./blogValidator.js";
const router = Router();
router
    .route("/")
    .get(getAllBlogs)
    .post(protectRoutes, allowedTo("admin"), createBlogValidator, createBlog);
router
    .route("/admin")
    .get(protectRoutes, allowedTo("admin"), getAllBlogsForAdmin);
router
    .route("/admin/:id")
    .get(protectRoutes, allowedTo("admin"), getSingleBlogValidator, getSingleBlogForAdmin);
router
    .route("/:id")
    .get(getSingleBlogValidator, getSingleBlog)
    .put(protectRoutes, allowedTo("admin"), updateBlogValidator, updateBlog)
    .delete(protectRoutes, allowedTo("admin"), deleteBlogValidator, deleteBlog);
export default router;
