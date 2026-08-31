import expressAsyncHandler from "express-async-handler";
import { Model } from "mongoose";
import apiError from "./appError.js";
import { ERROR, SUCCESS } from "./statusTexts.js";

export const getAllDocuments = (Model: Model<any>, populate?: string | null) =>
  expressAsyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string) || 1;

    const limitNumber = parseInt(limit as string) || 10;

    const skip = (pageNumber - 1) * limitNumber;

    // Filters

    const filters = { ...req.query };

    const excludedFields = ["page", "sort", "limit", "fields", "keyword"];

    excludedFields.forEach((field) => delete filters[field]);

    let queryString = JSON.stringify(filters);

    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    let mongooseFilters = JSON.parse(queryString);

    let query = Model.find(mongooseFilters, { __v: false })
      .skip(skip)
      .limit(limitNumber);

    if (populate) {
      query = query.populate(populate);
    }

    const documents = await query;

    const countDocuments = await Model.countDocuments();

    res.status(200).json({
      status: SUCCESS,
      message: "Documents retrieved successfully",
      data: {
        documents,
        pagination: {
          currentPage: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(countDocuments / limitNumber),
          results: documents.length,
          total: countDocuments,
        },
      },
    });
  });

export const getSingleDocument = (
  Model: Model<any>,
  populate?: string | null,
) =>
  expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;

    let query = Model.findById(id);

    if (populate) {
      query = query.populate(populate);
    }

    const document = await query;

    if (!document) {
      const error = apiError.create(
        `Document not found with id: ${id}`,
        404,
        ERROR,
      );
      return next(error);
    }

    res.status(200).json({
      status: SUCCESS,
      message: "Document retrieved successfully",
      data: {
        document,
      },
    });
  });

export const createDocument = (Model: Model<any>) =>
  expressAsyncHandler(async (req, res) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: SUCCESS,
      message: "Document created successfully",
      data: {
        document,
      },
    });
  });

export const updateDocument = (Model: Model<any>) =>
  expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndUpdate(id, req.body, { new: true });

    if (!document) {
      const error = apiError.create(
        `Document not found with id: ${id}`,
        404,
        ERROR,
      );
      return next(error);
    }

    res.status(200).json({
      status: SUCCESS,
      message: "Document updated successfully",
      data: {
        document,
      },
    });
  });

export const deleteDocument = (Model: Model<any>) =>
  expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      const error = apiError.create(
        `Document not found with id: ${id}`,
        404,
        ERROR,
      );
      return next(error);
    }

    res.status(204).json({
      status: SUCCESS,
      message: "Document deleted successfully",
    });
  });
