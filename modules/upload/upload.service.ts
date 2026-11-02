import type { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import apiError from "../../utils/appError.js";
import { FAIL } from "../../utils/statusTexts.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

export const uploadImageController = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file?.buffer) {
      return next(
        apiError.create("Please provide an image file to upload", 400, FAIL),
      );
    }

    const folder =
      (req.body?.folder as string) ||
      (req.query?.folder as string) ||
      "uploads";

    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  },
);

