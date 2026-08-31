import type { NextFunction, Request, Response } from "express";

export const parseSettingsBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.body.socialLinks && typeof req.body.socialLinks === "string") {
      req.body.socialLinks = JSON.parse(req.body.socialLinks);
    }

    next();
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON in socialLinks",
    });
  }
};
