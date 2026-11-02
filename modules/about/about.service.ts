import expressAsyncHandler from "express-async-handler";
import AboutModel from "./aboutModel.js";

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
  const data = await AboutModel.findOne();

  const about = {
    subtitle: {
      en: data?.subtitle?.en ?? "",
      ar: data?.subtitle?.ar ?? "",
    },
    title: {
      en: data?.title?.en ?? "",
      ar: data?.title?.ar ?? "",
    },
    description: {
      en: data?.description?.en ?? "",
      ar: data?.description?.ar ?? "",
    },
    image: data?.image,
  };

  res.json({
    status: "Success",
    data: {
      item: about,
    },
  });
});
