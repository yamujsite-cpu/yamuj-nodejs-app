import expressAsyncHandler from "express-async-handler";
import { getAllDocuments } from "../../utils/handlersFactory.js";
import ServiceModel from "./serviceModel.js";

export const updateService = expressAsyncHandler(async (req, res, next) => {
  if (typeof req.body.items === "string") {
    try {
      req.body.items = JSON.parse(req.body.items);
    } catch {
      // validator or schema will handle
    }
  }

  const data = await ServiceModel.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
  });

  res.json({
    message: "Services updated successfully",
    data,
    status: "Success",
  });
});

export const getServices = getAllDocuments(ServiceModel);
