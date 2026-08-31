import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dbConnect from "./config/dbConnect.js";
import aboutRoute from "./modules/about/about.route.js";
import blogRoute from "./modules/blog/blog.route.js";
import brandsRoute from "./modules/brands/brand.route.js";
import contactMessagesRoute from "./modules/contact-messages/contactMessages.route.js";
import homeRoute from "./modules/home/home.route.js";
import projectRoute from "./modules/projects/project.route.js";
import serviceRoute from "./modules/services/service.route.js";
import settingsRoute from "./modules/settings/settings.route.js";
import statisticsRoute from "./modules/statistics/statistics.route.js";
import testimonialRoute from "./modules/testimonials/testimonial.route.js";
import userRoute from "./modules/users/user.route.js";
import { ERROR } from "./utils/statusTexts.js";

dotenv.config();

const app = express();

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/users", userRoute);
app.use("/api/about", aboutRoute);
app.use("/api/brands", brandsRoute);
app.use("/api/contact-messages", contactMessagesRoute);
app.use("/api/contact", contactMessagesRoute);
app.use("/api/testimonials", testimonialRoute);
app.use("/api/statistics", statisticsRoute);
app.use("/api/services", serviceRoute);
app.use("/api/settings", settingsRoute);
app.use("/api/projects", projectRoute);
app.use("/api/blog", blogRoute);
app.use("/api/home", homeRoute);

app.use((req, res) => {
  return res.status(404).json({
    status: ERROR,
    message: `This resource is not available: ${req.originalUrl}`,
  });
});

app.use((error: any, req: any, res: any, next: any) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || ERROR,
    message: error.message,
    code: error.statusCode,
    data: null,
  });
});

if (!process.env.VERCEL) {
  const port = process.env.PORT || 3301;
  app.listen(port, () => {
    console.log(`Listening in port ${port}`);
  });
}

export default app;
