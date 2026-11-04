import { Router } from "express";
import {
  uploadMediaImage,
  validateMediaImageContent,
} from "../../middlewares/uploadImageMiddleware.js";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import {
  deleteMedia,
  getAllMedia,
  getMediaById,
  uploadMedia,
} from "./media.service.js";
import { listMediaValidator, mediaIdValidator } from "./mediaValidator.js";

const router = Router();

router.use(protectRoutes, allowedTo("admin"));

router.post(
  "/upload",
  uploadMediaImage,
  validateMediaImageContent,
  uploadMedia,
);
router.get("/", listMediaValidator, getAllMedia);
router
  .route("/:id")
  .get(mediaIdValidator, getMediaById)
  .delete(mediaIdValidator, deleteMedia);

export default router;
