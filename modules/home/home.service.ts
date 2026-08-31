import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { SUCCESS } from "../../utils/statusTexts.js";
import BlogModel from "../blog/blogModel.js";
import BrandModel from "../brands/brandModel.js";
import ProjectModel from "../projects/projectModel.js";
import ServiceModel from "../services/serviceModel.js";

export const getHome = async () => {
  const [services, brands, blog, projects] = await Promise.all([
    ServiceModel.find().lean(),
    BrandModel.find().lean(),
    BlogModel.find({ showInHome: true }).lean(),
    ProjectModel.find({ showInHome: true }).lean(),
  ]);

  return {
    services,
    brands,
    blog,
    projects,
  };
};

export const getHomeController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const data = await getHome();

    res.status(200).json({
      status: SUCCESS,
      data,
      message: "Home page data retrieved successfully",
    });
  },
);
