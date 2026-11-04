import type { Request } from "express";
import expressAsyncHandler from "express-async-handler";
import path from "node:path";
import apiError from "../../utils/appError.js";
import { ERROR, FAIL, SUCCESS } from "../../utils/statusTexts.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/uploadToCloudinary.js";
import AboutModel from "../about/aboutModel.js";
import BlogModel from "../blog/blogModel.js";
import BrandModel from "../brands/brandModel.js";
import ProjectModel from "../projects/projectModel.js";
import ServiceModel from "../services/serviceModel.js";
import SettingsModel from "../settings/settingsModel.js";
import TestimonialModel from "../testimonials/testimonialModel.js";
import MediaModel from "./mediaModel.js";

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findMediaUsage = async (url: string) => {
  const urlPattern = new RegExp(escapeRegExp(url), "i");

  const checks = [
    BlogModel.exists({
      $or: [
        { image: url },
        { "description.en": urlPattern },
        { "description.ar": urlPattern },
      ],
    }).then((used) => used && "blog"),
    AboutModel.exists({
      $or: [
        { image: url },
        { "description.en": urlPattern },
        { "description.ar": urlPattern },
      ],
    }).then((used) => used && "about"),
    BrandModel.exists({ logos: url }).then((used) => used && "brands"),
    ServiceModel.exists({
      $or: [
        { "items.image": url },
        { "description.en": urlPattern },
        { "description.ar": urlPattern },
        { "items.description.en": urlPattern },
        { "items.description.ar": urlPattern },
      ],
    }).then((used) => used && "services"),
    TestimonialModel.exists({
      $or: [
        { "items.image": url },
        { "description.en": urlPattern },
        { "description.ar": urlPattern },
        { "items.message.en": urlPattern },
        { "items.message.ar": urlPattern },
      ],
    }).then((used) => used && "testimonials"),
    SettingsModel.exists({
      $or: [
        { "logo.en": url },
        { "logo.ar": url },
        { "footerLogo.en": url },
        { "footerLogo.ar": url },
        { "footerMessage.en": urlPattern },
        { "footerMessage.ar": urlPattern },
      ],
    }).then((used) => used && "settings"),
    ProjectModel.exists({
      $or: [{ "description.en": urlPattern }, { "description.ar": urlPattern }],
    }).then((used) => used && "projects"),
  ];

  return (await Promise.all(checks)).filter(Boolean) as string[];
};

export const uploadMedia = expressAsyncHandler(async (req, res, next) => {
  if (!req.file?.buffer) {
    return next(
      apiError.create("Please provide an image file to upload", 400, FAIL),
    );
  }

  let uploadResult;
  try {
    uploadResult = await uploadToCloudinary(
      req.file.buffer,
      process.env.CLOUDINARY_MEDIA_FOLDER || "media",
    );
  } catch {
    return next(
      apiError.create("Unable to upload image to Cloudinary", 502, ERROR),
    );
  }

  try {
    const media = await MediaModel.create({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      originalName: req.file.originalname,
      name: path.parse(req.file.originalname).name,
      mimeType: req.file.mimetype.toLowerCase() as
        | "image/jpeg"
        | "image/png"
        | "image/webp"
        | "image/gif",
      format: uploadResult.format,
      size: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      status: SUCCESS,
      message: "Media uploaded successfully",
      data: { media },
    });
  } catch (error) {
    try {
      await deleteFromCloudinary(uploadResult.public_id);
    } catch {
      // Preserve the database error while making a best-effort orphan cleanup.
    }
    throw error;
  }
});

export const getAllMedia = expressAsyncHandler(async (req: Request, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 24);
  const search = String(req.query.search || "").trim();
  const sortDirection = req.query.sort === "asc" ? 1 : -1;

  const filters: Record<string, unknown> = {};
  if (search) {
    const pattern = new RegExp(escapeRegExp(search), "i");
    filters.$or = [{ originalName: pattern }, { name: pattern }];
  }
  if (req.query.format) {
    filters.format = ["jpg", "jpeg"].includes(String(req.query.format))
      ? { $in: ["jpg", "jpeg"] }
      : req.query.format;
  }
  if (req.query.mimeType) filters.mimeType = req.query.mimeType;

  const [media, total] = await Promise.all([
    MediaModel.find(filters, { __v: false })
      .sort({ createdAt: sortDirection })
      .skip((page - 1) * limit)
      .limit(limit),
    MediaModel.countDocuments(filters),
  ]);

  res.status(200).json({
    status: SUCCESS,
    message: "Media retrieved successfully",
    data: {
      media,
      pagination: {
        currentPage: page,
        limit,
        totalPages: Math.ceil(total / limit),
        results: media.length,
        total,
      },
    },
  });
});

export const getMediaById = expressAsyncHandler(async (req, res, next) => {
  const media = await MediaModel.findById(req.params.id, { __v: false });
  if (!media) return next(apiError.create("Media not found", 404, FAIL));

  res.status(200).json({
    status: SUCCESS,
    message: "Media retrieved successfully",
    data: { media },
  });
});

export const deleteMedia = expressAsyncHandler(async (req, res, next) => {
  const media = await MediaModel.findById(req.params.id);
  if (!media) return next(apiError.create("Media not found", 404, FAIL));

  const usedBy = await findMediaUsage(media.url);

  if (usedBy.length > 0) {
    return next(
      apiError.create(
        `Media is currently in use by: ${usedBy.join(", ")}`,
        409,
        FAIL,
      ),
    );
  }

  let cloudinaryResult;
  try {
    cloudinaryResult = await deleteFromCloudinary(media.publicId);
  } catch {
    return next(
      apiError.create("Unable to delete image from Cloudinary", 502, ERROR),
    );
  }

  if (!["ok", "not found"].includes(cloudinaryResult.result)) {
    return next(
      apiError.create("Cloudinary did not delete the image", 502, ERROR),
    );
  }

  await media.deleteOne();
  res.status(200).json({
    status: SUCCESS,
    message: "Media deleted successfully",
    data: null,
  });
});
