import { Router } from "express";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getSingleProject,
  resizeProjectImage,
  updateProject,
  uploadProjectImages,
} from "./project.service.js";
import {
  createProjectValidator,
  deleteProjectValidator,
  getSingleProjectValidator,
  updateProjectValidator,
} from "./projectValidator.js";

const router = Router();

router
  .route("/")
  .get(getAllProjects)
  .post(
    protectRoutes,
    allowedTo("admin"),
    uploadProjectImages,
    resizeProjectImage,
    createProjectValidator,
    createProject,
  );

router
  .route("/:id")
  .get(getSingleProjectValidator, getSingleProject)
  .put(
    protectRoutes,
    allowedTo("admin"),
    uploadProjectImages,
    resizeProjectImage,
    updateProjectValidator,
    updateProject,
  )
  .delete(
    protectRoutes,
    allowedTo("admin"),
    deleteProjectValidator,
    deleteProject,
  );

export default router;

