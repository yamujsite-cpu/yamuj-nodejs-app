import type { Request, Response } from "express";
import { localizeDocument } from "../../utils/handlersFactory.js";
import Settings from "./settingsModel.js";

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
      settings: localizeDocument(data, locale, [
        "footerTitle",
        "footerDescription",
        "footerMessage",
      ]),
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
