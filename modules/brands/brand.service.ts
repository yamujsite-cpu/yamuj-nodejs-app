import expressAsyncHandler from "express-async-handler";
import { uploadMultipleImage } from "../../middlewares/uploadImageMiddleware.js";
import apiError from "../../utils/appError.js";
import { localizeDocument } from "../../utils/handlersFactory.js";
import { ERROR, SUCCESS } from "../../utils/statusTexts.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import BrandModel from "./brandModel.js";

export const getBrandImages = uploadMultipleImage([
  {
    name: "logos",
    maxCount: 50,
  },
]);

export const resizeBrandImages = expressAsyncHandler(async (req, res, next) => {
  const files = req.files as {
    logos?: Express.Multer.File[];
  };

  if (files?.logos && files.logos.length > 0) {
    const uploadPromises = files.logos.map((file) =>
      uploadToCloudinary(file.buffer, "brands/logos"),
    );
    const results = await Promise.all(uploadPromises);

    const secureUrls = results.map((result: any) => result.secure_url);

    if (req.body.logos) {
      if (Array.isArray(req.body.logos)) {
        req.body.logos.push(...secureUrls);
      } else {
        req.body.logos = [req.body.logos, ...secureUrls];
      }
    } else {
      req.body.logos = secureUrls;
    }
  }

  next();
});

export const updateBrand = expressAsyncHandler(async (req, res, next) => {
  const data = await BrandModel.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
  });

  res.json({
    message: "Brand updated successfully",
    data,
  });
});

export const getBrand = expressAsyncHandler(async (req, res, next) => {
  const locale = (req.headers["locale"] as string) || "en";

  const data = await BrandModel.findOne({});

  if (!data) {
    return next(apiError.create("Brand not found", 404, ERROR))
  }

  const brand = localizeDocument(data, locale, ["title"]);

  res.json({
    status: SUCCESS,
    data: {
      item: brand,
    },
  });
});
