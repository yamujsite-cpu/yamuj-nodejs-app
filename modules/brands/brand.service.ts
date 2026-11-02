import expressAsyncHandler from "express-async-handler";
import apiError from "../../utils/appError.js";
import { ERROR, SUCCESS } from "../../utils/statusTexts.js";
import BrandModel from "./brandModel.js";

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
  const data = await BrandModel.findOne({});

  if (!data) {
    return next(apiError.create("Brand not found", 404, ERROR));
  }

  res.json({
    status: SUCCESS,
    data: {
      item: data,
    },
  });
});
