import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { uploadMultipleImage } from "../../middlewares/uploadImageMiddleware.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import Settings from "./settingsModel.js";

export const UpdateSettingsImages = uploadMultipleImage([
  {
    name: "logo",
    maxCount: 1,
  },
  {
    name: "footerLogo",
    maxCount: 1,
  },
]);

export const resizeSettingsImages = expressAsyncHandler(
  async (req, res, next) => {
    const files = req.files as any;

    if (files?.logo?.[0]?.buffer) {
      const result: any = await uploadToCloudinary(
        files.logo[0].buffer,
        "settings/logo",
      );
      req.body.logo = result.secure_url;
    }

    if (files?.footerLogo?.[0]?.buffer) {
      const result: any = await uploadToCloudinary(
        files.footerLogo[0].buffer,
        "settings/footerLogo",
      );
      req.body.footerLogo = result.secure_url;
    }

    next();
  },
);

export const getSettings = async () => {
  return await Settings.findOne();
};

export const updateSettings = async (data: any) => {
  return await Settings.findOneAndUpdate({}, data, {
    new: true,
    upsert: true,
  });
};

/**
 * @description Get website settings
 * @route GET /api/settings
 * @access Public
 */
export const getSettingsController = async (req: Request, res: Response) => {
  const data = await getSettings();
  res.json({
    status: "Success",
    results: 1,
    data: {
      settings: data,
    },
  });
};

export const updateSettingsController = async (req: Request, res: Response) => {
  const data = await updateSettings(req.body);

  res.json({
    message: "Settings updated successfully",
    data,
  });
};
