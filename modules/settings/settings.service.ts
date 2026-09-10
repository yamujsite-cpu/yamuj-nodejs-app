import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { uploadMultipleImage } from "../../middlewares/uploadImageMiddleware.js";
import { localizeDocument } from "../../utils/handlersFactory.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import Settings from "./settingsModel.js";

export const UpdateSettingsImages = uploadMultipleImage([
  {
    name: "logo.en",
    maxCount: 1,
  },
  {
    name: "logo.ar",
    maxCount: 1,
  },
  {
    name: "footerLogo.en",
    maxCount: 1,
  },
  {
    name: "footerLogo.ar",
    maxCount: 1,
  },
]);

export const resizeSettingsImages = expressAsyncHandler(
  async (req, res, next) => {
    const files = req.files as any;

    if (files?.logo?.en?.[0]?.buffer) {
      const result: any = await uploadToCloudinary(
        files.logo.en[0].buffer,
        "settings/logo",
      );
      req.body.logo.en = result.secure_url;
    }

    if (files?.logo?.ar?.[0]?.buffer) {
      const result: any = await uploadToCloudinary(
        files.logo.ar[0].buffer,
        "settings/logo",
      );
      req.body.logo.ar = result.secure_url;
    }

    if (files?.footerLogo?.en?.[0]?.buffer) {
      const result: any = await uploadToCloudinary(
        files.footerLogo.en[0].buffer,
        "settings/footerLogo",
      );
      req.body.footerLogo.en = result.secure_url;
    }

    if (files?.footerLogo?.ar?.[0]?.buffer) {
      const result: any = await uploadToCloudinary(
        files.footerLogo.ar[0].buffer,
        "settings/footerLogo",
      );
      req.body.footerLogo.ar = result.secure_url;
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

  const locale = (req.headers["locale"] as string) || "en";
  res.json({
    status: "Success",
    results: 1,
    data: {
      settings: localizeDocument(data, locale, ["footerTitle", "footerDescription", "footerMessage"]),
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
