import expressAsyncHandler from "express-async-handler";
import { SUCCESS } from "../../utils/statusTexts.js";
import BlogModel from "../blog/blogModel.js";
import BrandModel from "../brands/brandModel.js";
import ContactMessageModel from "../contact-messages/contactMessageModel.js";
import ProjectModel from "../projects/projectModel.js";
import ServiceModel from "../services/serviceModel.js";
import TestimonialModel from "../testimonials/testimonialModel.js";

/**
 * @desc Get Statistics
 * @route GET /api/statistics
 * @access Private/Admin
 */
export const getStatistics = expressAsyncHandler(async (req, res, next) => {
  const [projectsCount, blogCount, servicesCount, brandsCount, contactMessagesCount] =
    await Promise.all([
      ProjectModel.countDocuments(),
      BlogModel.countDocuments(),
      ServiceModel.countDocuments(),
      BrandModel.countDocuments(),
      ContactMessageModel.countDocuments(),
    ]);

  const testimonialsDoc = await TestimonialModel.findOne();
  const testimonialsCount = testimonialsDoc?.items?.length || 0;

  const stats = [
    {
      title: "Projects",
      count: projectsCount,
      url: "/projects",
    },
    {
      title: "Blog",
      count: blogCount,
      url: "/blog",
    },
    {
      title: "Services",
      count: servicesCount,
      url: "/services",
    },
    {
      title: "Brands",
      count: brandsCount,
      url: "/brands",
    },
    {
      title: "Contact Messages",
      count: contactMessagesCount,
      url: "/contact-messages",
    },
    {
      title: "Testimonials",
      count: testimonialsCount,
      url: "/testimonials",
    },
  ];

  res.status(200).json({
    status: SUCCESS,
    data: stats,
  });
});
