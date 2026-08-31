import expressAsyncHandler from "express-async-handler";
import apiError from "../../utils/appError.js";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getSingleDocument,
} from "../../utils/handlersFactory.js";
import sendEmail from "../../utils/sendEmail.js";
import { FAIL, SUCCESS } from "../../utils/statusTexts.js";
import ContactMessageModel from "./contactMessageModel.js";

/**
 * @description Create new contact message
 * @route POST /api/contact-messages
 * @access Public
 */
export const createContactMessage = createDocument(ContactMessageModel);

/**
 * @description get all contact messages
 * @route GET /api/contact-messages
 * @access Private/Admin
 */
export const getAllContactMessages = getAllDocuments(ContactMessageModel);

/**
 * @description get single contact message by id
 * @route GET /api/contact-messages/:id
 * @access Private/Admin
 */
export const getSingleContactMessage = getSingleDocument(ContactMessageModel);

/**
 * @description delete contact message by id
 * @route DELETE /api/contact-messages/:id
 * @access Private/Admin
 */
export const deleteContactMessage = deleteDocument(ContactMessageModel);

/**
 * @description Reply to contact message
 * @route POST /api/contact-messages/:id/reply
 * @access Private/Admin
 */
export const replyToContactMessage = expressAsyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    const { message } = req.body;

    const contactMessage = await ContactMessageModel.findById(id);

    if (!contactMessage) {
      return next(apiError.create("Contact message not found", 404, FAIL));
    }

    if (contactMessage.isReplied) {
      return next(
        apiError.create("Contact message already replied", 400, FAIL),
      );
    }

    try {
      await sendEmail({
        email: contactMessage.email,
        subject: `Reply to: ${contactMessage.email}`,
        text: message,
      });

      contactMessage.isReplied = true;

      await contactMessage.save();

      res.status(200).json({
        status: SUCCESS,
        message: "Reply sent successfully",
        data: contactMessage,
      });
    } catch (error) {
      return next(
        apiError.create("There is an error sending email", 500, FAIL),
      );
    }
  },
);
