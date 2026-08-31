import expressAsyncHandler from "express-async-handler";
import { uploadSingleImage } from "../../middlewares/uploadImageMiddleware.js";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getSingleDocument,
  updateDocument,
} from "../../utils/handlersFactory.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import BlogModel from "./blogModel.js";

export const uploadBlogImage = uploadSingleImage("image");

export const resizeBlogImage = expressAsyncHandler(
  async (req, res, next) => {
    if (req.file?.buffer) {
      const result: any = await uploadToCloudinary(
        req.file.buffer,
        "blogs",
      );
      req.body.image = result.secure_url;
    }
    next();
  },
);

/**
 * @desc Get All Blogs
 * @route GET /api/blog
 * @access Public
 */
export const getAllBlogs = getAllDocuments(BlogModel);

/**
 * @desc Get Single Blog
 * @route GET /api/blog/:id
 * @access Public
 */
export const getSingleBlog = getSingleDocument(BlogModel);

/**
 * @desc Create A Blog
 * @route POST /api/blog
 * @access Private
 */
export const createBlog = createDocument(BlogModel);

/**
 * @desc Update A Blog
 * @route PUT /api/blog/:id
 * @access Private
 */
export const updateBlog = updateDocument(BlogModel);

/**
 * @desc Delete A Blog
 * @route DELETE /api/blog/:id
 * @access Private
 */
export const deleteBlog = deleteDocument(BlogModel);
