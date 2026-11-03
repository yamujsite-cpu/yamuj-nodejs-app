import dotenv from "dotenv";
dotenv.config();

process.env.VERCEL = "1"; // Prevent server.ts from listening on port 3301 automatically

// Suppress unhandled rejection from dbConnect if Atlas IP is not whitelisted
process.on("unhandledRejection", (err) => {
  if (String(err).includes("MongooseServerSelectionError")) {
    // Atlas connection not whitelisted on this network
  } else {
    console.error("Unhandled:", err);
  }
});

import express from "express";
import uploadRoute from "./modules/upload/upload.route.js";
import { updateAboutValidator } from "./modules/about/about.Validator.js";
import { createBlogValidator, updateBlogValidator } from "./modules/blog/blogValidator.js";
import { updateBrandValidator } from "./modules/brands/brand.Validator.js";
import { createProjectValidator, updateProjectValidator } from "./modules/projects/projectValidator.js";
import { updateServiceValidator } from "./modules/services/serviceValidator.js";
import { updateSettingsValidator } from "./modules/settings/settingsValidator.js";
import { updateTestimonialValidator } from "./modules/testimonials/testimonial.Validator.js";

async function testUploadAndValidation() {
  console.log("=== Testing Upload to Cloudinary ===");
  const testApp = express();
  testApp.use(express.json());
  testApp.use("/api/upload", uploadRoute);
  testApp.use((error: any, req: any, res: any, next: any) => {
    res.status(error.statusCode || 500).json({
      status: error.statusText || "error",
      message: error.message,
      code: error.statusCode,
      data: null,
    });
  });

  const server = testApp.listen(0);
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    // 1. Test missing file
    console.log("Testing POST /api/upload/image with empty form-data...");
    const emptyForm = new FormData();
    const resEmpty = await fetch(`${baseUrl}/api/upload/image`, {
      method: "POST",
      body: emptyForm,
    });
    const emptyJson = (await resEmpty.json()) as any;
    console.log("Missing file status:", resEmpty.status, emptyJson.message);
    if (resEmpty.status !== 400) throw new Error("Expected 400 for empty form");

    // 2. Test non-image file
    console.log("Testing POST /api/upload/image with text file...");
    const textForm = new FormData();
    textForm.append("image", new Blob(["not an image"], { type: "text/plain" }), "test.txt");
    const resText = await fetch(`${baseUrl}/api/upload/image`, {
      method: "POST",
      body: textForm,
    });
    const textJson = (await resText.json()) as any;
    console.log("Non-image file status:", resText.status, textJson.message);
    if (resText.status !== 400) throw new Error("Expected 400 for text file");

    // 3. Test image file upload to Cloudinary
    console.log("Testing POST /api/upload/image with 1x1 PNG...");
    const pngBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const pngBuffer = Buffer.from(pngBase64, "base64");
    const imageForm = new FormData();
    imageForm.append("image", new Blob([pngBuffer], { type: "image/png" }), "pixel.png");

    const resUpload = await fetch(`${baseUrl}/api/upload/image`, {
      method: "POST",
      body: imageForm,
    });
    const uploadJson = (await resUpload.json()) as any;
    console.log("Upload result:", resUpload.status, uploadJson);
    if (resUpload.status !== 200 || !uploadJson.success || !uploadJson.data?.url) {
      throw new Error(`Cloudinary upload failed: ${JSON.stringify(uploadJson)}`);
    }

    const cloudinaryUrl = uploadJson.data.url;
    console.log("✓ Upload succeeded! URL:", cloudinaryUrl, "publicId:", uploadJson.data.publicId);

    // 4. Test Validator endpoints
    console.log("\n=== Testing Validation Schemas for URLs ===");

    const valApp = express();
    valApp.use(express.json());
    valApp.post("/val/about", updateAboutValidator, (_req: any, res: any) => res.json({ ok: true }));
    valApp.post("/val/blog/create", createBlogValidator, (_req: any, res: any) => res.json({ ok: true }));
    valApp.post("/val/blog/update", updateBlogValidator, (_req: any, res: any) => res.json({ ok: true }));
    valApp.post("/val/brand", updateBrandValidator, (_req: any, res: any) => res.json({ ok: true }));
    valApp.post("/val/project/create", createProjectValidator, (_req: any, res: any) => res.json({ ok: true }));
    valApp.post("/val/project/update", updateProjectValidator, (_req: any, res: any) => res.json({ ok: true }));
    valApp.post("/val/service", updateServiceValidator, (_req: any, res: any) => res.json({ ok: true }));
    valApp.post("/val/settings", updateSettingsValidator, (_req: any, res: any) => res.json({ ok: true }));
    valApp.post("/val/testimonial", updateTestimonialValidator, (_req: any, res: any) => res.json({ ok: true }));

    const valServer = valApp.listen(0);
    const valAddress = valServer.address() as any;
    const valUrl = `http://127.0.0.1:${valAddress.port}`;

    try {
      // Test Blog Create: Valid URL vs Invalid URL
      const blogValid = await fetch(`${valUrl}/val/blog/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: { en: "Test", ar: "تجربة" },
          description: { en: "Desc", ar: "وصف" },
          image: cloudinaryUrl,
        }),
      });
      console.log("Blog valid status:", blogValid.status);
      if (blogValid.status !== 200) throw new Error("Blog valid URL should return 200");

      const blogInvalid = await fetch(`${valUrl}/val/blog/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: { en: "Test", ar: "تجربة" },
          description: { en: "Desc", ar: "وصف" },
          image: "not-a-valid-url",
        }),
      });
      const blogInvalidJson = await blogInvalid.json();
      console.log("Blog invalid status:", blogInvalid.status, blogInvalidJson);
      if (blogInvalid.status !== 400) throw new Error("Blog invalid URL should return 400");

      // Test Blog Create without image (optional)
      const blogNoImage = await fetch(`${valUrl}/val/blog/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: { en: "Test", ar: "تجربة" },
          description: { en: "Desc", ar: "وصف" },
        }),
      });
      console.log("Blog without image status:", blogNoImage.status);
      if (blogNoImage.status !== 200) throw new Error("Blog without image should return 200");

      // Test About Valid vs Invalid URL
      const aboutValid = await fetch(`${valUrl}/val/about`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: cloudinaryUrl }),
      });
      if (aboutValid.status !== 200) throw new Error("About valid URL should return 200");

      const aboutInvalid = await fetch(`${valUrl}/val/about`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: "bad-url" }),
      });
      if (aboutInvalid.status !== 400) throw new Error("About invalid URL should return 400");
      console.log("✓ About validation works");

      // Test Brand Valid vs Invalid Logos
      const brandValid = await fetch(`${valUrl}/val/brand`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logos: [cloudinaryUrl, "https://example.com/logo.png"] }),
      });
      if (brandValid.status !== 200) throw new Error("Brand valid logos should return 200");

      const brandInvalid = await fetch(`${valUrl}/val/brand`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logos: ["bad-logo-url"] }),
      });
      if (brandInvalid.status !== 400) throw new Error("Brand invalid logos should return 400");
      console.log("✓ Brand validation works");

      // Test Project: Creates cleanly without images or imageCover
      const projectValid = await fetch(`${valUrl}/val/project/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: { en: "Proj", ar: "مشروع" },
          description: { en: "Desc", ar: "وصف" },
        }),
      });
      if (projectValid.status !== 200) throw new Error("Project valid should return 200");
      console.log("✓ Project validation works (no imageCover/images needed)");

      // Test Service Valid vs Invalid items image
      const serviceValid = await fetch(`${valUrl}/val/service`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ title: { en: "S1" }, image: cloudinaryUrl }],
        }),
      });
      if (serviceValid.status !== 200) throw new Error("Service valid should return 200");

      const serviceInvalid = await fetch(`${valUrl}/val/service`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ title: { en: "S1" }, image: "bad-service-image" }],
        }),
      });
      if (serviceInvalid.status !== 400) throw new Error("Service invalid should return 400");
      console.log("✓ Service validation works");

      // Test Settings Valid vs Invalid Logo URL
      const settingsValid = await fetch(`${valUrl}/val/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logo: { en: cloudinaryUrl, ar: cloudinaryUrl },
        }),
      });
      if (settingsValid.status !== 200) throw new Error("Settings valid should return 200");

      const settingsInvalid = await fetch(`${valUrl}/val/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logo: { en: "bad-logo-url" },
        }),
      });
      if (settingsInvalid.status !== 400) throw new Error("Settings invalid should return 400");
      console.log("✓ Settings validation works");

      // Test Testimonial Valid vs Invalid image
      const testValid = await fetch(`${valUrl}/val/testimonial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ name: { en: "Person" }, image: cloudinaryUrl }],
        }),
      });
      if (testValid.status !== 200) throw new Error("Testimonial valid should return 200");

      const testInvalid = await fetch(`${valUrl}/val/testimonial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ name: { en: "Person" }, image: "bad-item-img" }],
        }),
      });
      if (testInvalid.status !== 400) throw new Error("Testimonial invalid should return 400");
      console.log("✓ Testimonial validation works");

      console.log("\n=============================================");
      console.log("🎉 ALL UPLOAD AND VALIDATION TESTS PASSED!");
      console.log("=============================================");
    } finally {
      valServer.close();
    }
  } finally {
    server.close();
  }
}

testUploadAndValidation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Test error:", err);
    process.exit(1);
  });
