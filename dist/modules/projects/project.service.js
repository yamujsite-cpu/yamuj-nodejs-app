import { createDocument, deleteDocument, getAllDocuments, getSingleDocument, getSingleDocumentWithPublicationQuery, updateDocument, } from "../../utils/handlersFactory.js";
import ProjectModel from "./projectModel.js";
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
export const getSingleProject = getSingleDocumentWithPublicationQuery(ProjectModel);
/** @desc Get all Projects, including drafts @route GET /api/projects/admin */
export const getAllProjectsForAdmin = getAllDocuments(ProjectModel);
/** @desc Get any Project, including drafts @route GET /api/projects/admin/:id */
export const getSingleProjectForAdmin = getSingleDocument(ProjectModel);
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
