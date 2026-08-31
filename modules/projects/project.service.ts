import expressAsyncHandler from "express-async-handler";
import { uploadMultipleImage } from "../../middlewares/uploadImageMiddleware.js";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getSingleDocument,
  updateDocument,
} from "../../utils/handlersFactory.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import ProjectModel from "./projectModel.js";

export const uploadProjectImages = uploadMultipleImage([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

export const resizeProjectImage = expressAsyncHandler(
  async (req, res, next) => {
    // Image background processing
    const files = req.files as {
      imageCover?: Express.Multer.File[];
      images?: Express.Multer.File[];
    };

    if (files?.imageCover?.[0]?.buffer) {
      const result: any = await uploadToCloudinary(
        files.imageCover[0].buffer,
        "projects/imageCover",
      );

      req.body.imageCover = result.secure_url;
    }

    if (files?.images) {
      req.body.images = [];

      await Promise.all(
        files.images.map(async (image: Express.Multer.File) => {
          const result: any = await uploadToCloudinary(
            image.buffer,
            "projects/images",
          );

          req.body.images.push(result.secure_url);
        }),
      );
    }

    next();
  },
);

/**
 * @desc Get All Projects
 * @route GET /api/projects
 * @access Public
 */
export const getAllProjects = getAllDocuments(ProjectModel);

/**
 * @desc Get Single Project
 * @route GET /api/projects/:id
 * @access Public
 */
export const getSingleProject = getSingleDocument(ProjectModel);

/**
 * @desc Create A Project
 * @route POST /api/projects
 * @access Private
 */
export const createProject = createDocument(ProjectModel);

/**
 * @desc Update A Project
 * @route PUT /api/projects/:id
 * @access Private
 */
export const updateProject = updateDocument(ProjectModel);

/**
 * @desc Delete A Project
 * @route DELETE /api/projects/:id
 * @access Private
 */
export const deleteProject = deleteDocument(ProjectModel);
