import type { NextFunction, Request, Response } from "express";
import multer, { type Field } from "multer";
import sharp from "sharp";
import apiError from "../utils/appError.js";
import { FAIL } from "../utils/statusTexts.js";

const MEDIA_MAX_FILE_SIZE = 5 * 1024 * 1024;
const MEDIA_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MEDIA_FORMATS = new Set(["jpeg", "png", "webp", "gif"]);
const MEDIA_FORMAT_MIME_TYPES: Record<string, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

const multerOptions = () => {
  const fileFilter = (_: any, file: { mimetype: string }, cb: any) => {
    const imageType = file.mimetype.split("/")[0];

    if (imageType !== "image") {
      return cb(apiError.create("The file must be an image", 400, FAIL));
    }

    return cb(null, true);
  };

  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
  });

  return upload;
};

const uploadSingleImage = (field: string) => multerOptions().single(field);

const uploadMultipleImage = (fields: Field[]) => multerOptions().fields(fields);

const uploadMix = () => multerOptions().any();

// Express' built-in body parsers do not handle multipart/form-data. This
// parser accepts text-only multipart requests and preserves bracket notation
// (for example, title[en]) as nested objects.
const parseMultipartForm = multer().none();

const mediaUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MEDIA_MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!MEDIA_MIME_TYPES.has(file.mimetype.toLowerCase())) {
      return cb(
        apiError.create(
          "Only JPEG, PNG, WebP, and GIF images are allowed",
          400,
          FAIL,
        ),
      );
    }
    cb(null, true);
  },
}).single("image");

const uploadMediaImage = (req: Request, res: Response, next: NextFunction) => {
  mediaUpload(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Image size must not exceed 5 MB"
          : error.code === "LIMIT_FILE_COUNT" ||
              error.code === "LIMIT_UNEXPECTED_FILE"
            ? "Exactly one image must be uploaded using the image field"
            : error.message;
      return next(apiError.create(message, 400, FAIL));
    }

    if (error) return next(error);
    next();
  });
};

const validateMediaImageContent = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.file?.buffer) {
    return next(
      apiError.create("Please provide an image file to upload", 400, FAIL),
    );
  }

  try {
    const metadata = await sharp(req.file.buffer, { animated: true }).metadata();
    if (!metadata.format || !MEDIA_FORMATS.has(metadata.format)) {
      return next(
        apiError.create("The uploaded file is not a supported image", 400, FAIL),
      );
    }
    // Persist the MIME type established from the file bytes, not the client header.
    req.file.mimetype = MEDIA_FORMAT_MIME_TYPES[metadata.format];
    next();
  } catch {
    next(
      apiError.create(
        "The uploaded file contains invalid image data",
        400,
        FAIL,
      ),
    );
  }
};

const uploadSingleImageFile = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const upload = multerOptions().fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]);

  upload(req, res, (err: any) => {
    if (err) {
      return next(err);
    }
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const selected =
        files?.image?.[0] ||
        files?.file?.[0] ||
        Object.values(files)[0]?.[0];
      if (selected) {
        req.file = selected;
      }
    }
    next();
  });
};

export {
  parseMultipartForm,
  uploadMix,
  uploadMultipleImage,
  uploadMediaImage,
  uploadSingleImage,
  uploadSingleImageFile,
  validateMediaImageContent,
};
