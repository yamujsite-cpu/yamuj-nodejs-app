import { Router } from "express";
import { allowedTo, protectRoutes } from "../users/user.service.js";
import {
  createContactMessage,
  deleteContactMessage,
  getAllContactMessages,
  getSingleContactMessage,
  replyToContactMessage,
} from "./contactMessages.service.js";
import {
  createContactMessageValidator,
  deleteContactMessageValidator,
  getContactMessageValidator,
  replyToContactMessageValidator,
} from "./contactMessageValidator.js";

const router = Router();

// Public route for clients to send messages
router.post("/", createContactMessageValidator, createContactMessage);

// Protected routes for admin
router.use(protectRoutes, allowedTo("admin"));

router.route("/").get(getAllContactMessages);

router
  .route("/:id")
  .get(getContactMessageValidator, getSingleContactMessage)
  .delete(deleteContactMessageValidator, deleteContactMessage);

router
  .route("/:id/reply")
  .post(replyToContactMessageValidator, replyToContactMessage);

export default router;
