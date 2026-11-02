import { Router } from "express";
import { uploadSingleImageFile } from "../../middlewares/uploadImageMiddleware.js";
import { uploadImageController } from "./upload.service.js";

const router = Router();

// Handles POST /api/upload/image and POST /api/upload
router.post("/image", uploadSingleImageFile, uploadImageController);
router.post("/", uploadSingleImageFile, uploadImageController);

export default router;

