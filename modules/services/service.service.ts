import expressAsyncHandler from "express-async-handler";
import { uploadMix } from "../../middlewares/uploadImageMiddleware.js";
import { getAllDocuments } from "../../utils/handlersFactory.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import ServiceModel from "./serviceModel.js";

export const getServiceImages = uploadMix();

export const resizeServiceImages = expressAsyncHandler(
  async (req, res, next) => {
    const files = req.files as Express.Multer.File[];

    // Parse items
    const items = JSON.parse(req.body.items || "[]");

    for (let index = 0; index < items.length; index++) {
      const imageFile = files.find(
        (file) => file.fieldname === `items[${index}][image]`,
      );

      if (imageFile) {
        const uploaded = (await uploadToCloudinary(
          imageFile.buffer,
          "services/items",
        )) as any;

        items[index].image = uploaded.secure_url;
      } else if (typeof items[index].image === "string") {
        items[index].image = items[index].image;
      } else if (typeof items[index].image === "string") {
        items[index].image = items[index].image;
      } else {
        items[index].image = "";
      }
    }

    req.body.items = items;

    next();
  },
);

export const updateService = expressAsyncHandler(async (req, res, next) => {
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
