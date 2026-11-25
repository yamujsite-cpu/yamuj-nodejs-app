import { createDocument, deleteDocument, getAllDocuments, getSingleDocument, getSingleDocumentWithPublicationQuery, updateDocument, } from "../../utils/handlersFactory.js";
import BlogModel from "./blogModel.js";
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
export const getSingleBlog = getSingleDocumentWithPublicationQuery(BlogModel);
/** @desc Get all Blogs, including drafts @route GET /api/blog/admin */
export const getAllBlogsForAdmin = getAllDocuments(BlogModel);
/** @desc Get any Blog, including drafts @route GET /api/blog/admin/:id */
export const getSingleBlogForAdmin = getSingleDocument(BlogModel);
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
