import { Router } from "express";
import { parseMultipartForm } from "../../middlewares/uploadImageMiddleware.js";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getSingleProject,
  updateProject,
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
    parseMultipartForm,
    createProjectValidator,
    createProject,
  );

router
  .route("/:id")
  .get(getSingleProjectValidator, getSingleProject)
  .put(
    protectRoutes,
    allowedTo("admin"),
    parseMultipartForm,
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
