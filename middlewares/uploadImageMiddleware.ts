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

export { uploadMix, uploadMultipleImage, uploadSingleImage };

