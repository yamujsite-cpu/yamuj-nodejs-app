import type { NextFunction, Request, Response } from "express";
import multer, { type Field } from "multer";
import apiError from "../utils/appError.js";
import { FAIL } from "../utils/statusTexts.js";

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
  uploadMix,
  uploadMultipleImage,
  uploadSingleImage,
  uploadSingleImageFile,
};
