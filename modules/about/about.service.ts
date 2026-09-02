import expressAsyncHandler from "express-async-handler";
import { uploadMultipleImage } from "../../middlewares/uploadImageMiddleware.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import AboutModel from "./aboutModel.js";

export const getAboutImages = uploadMultipleImage([
  {
    name: "image",
    maxCount: 1,
  },
]);

export const resizeAboutImages = expressAsyncHandler(async (req, res, next) => {
  const files = req.files as {
    image?: Express.Multer.File[];
  };

  if (files?.image?.[0]?.buffer) {
    const result: any = await uploadToCloudinary(
      files.image[0].buffer,
      "about/image",
    );
    req.body.image = result.secure_url;
  }

  next();
});

export const updateAbout = expressAsyncHandler(async (req, res, next) => {
  const data = await AboutModel.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
  });

  res.json({
    message: "About updated successfully",
    data,
    status: "Success",
  });
});

export const getAbout = expressAsyncHandler(async (req, res) => {
  const locale = req.headers["locale"] as string;

  const data = await AboutModel.findOne();

  if (!data) {
    res.status(404);
    throw new Error("About not found");
  }

  const about = {
    subtitle: data.subtitle?.[locale as "en" | "ar"] ?? "",
    title: data.title?.[locale as "en" | "ar"] ?? "",
    description: data.description?.[locale as "en" | "ar"] ?? "",
    image: data.image,
  };

  res.json({
    status: "Success",
    data: {
      item: about,
    },
  });
});