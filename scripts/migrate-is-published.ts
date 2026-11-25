import dotenv from "dotenv";
import mongoose from "mongoose";
import dbConnect from "../config/dbConnect.js";
import BlogModel from "../modules/blog/blogModel.js";
import ProjectModel from "../modules/projects/projectModel.js";

dotenv.config();

async function migrate() {
  await dbConnect();

  const [projects, blogs] = await Promise.all([
    ProjectModel.updateMany(
      { isPublished: { $exists: false } },
      { $set: { isPublished: true } },
    ),
    BlogModel.updateMany(
      { isPublished: { $exists: false } },
      { $set: { isPublished: true } },
    ),
  ]);

  console.log(
    `Publishing migration complete: ${projects.modifiedCount} projects and ${blogs.modifiedCount} blog posts updated.`,
  );
}

migrate()
  .catch((error) => {
    console.error("Publishing migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
