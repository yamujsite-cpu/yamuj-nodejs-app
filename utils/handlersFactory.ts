import expressAsyncHandler from "express-async-handler";
import { Model } from "mongoose";
import apiError from "./appError.js";
import { ERROR, SUCCESS } from "./statusTexts.js";

const localizedFields = [
  "title",
  "subtitle",
  "description",
];

export const localizeDocument = (
  document: any,
  locale: string,
  fields: string[] = ["title", "subtitle", "description"],
) => {
  const obj = document.toObject ? document.toObject() : document;

  fields.forEach((field) => {
    if (obj[field] && typeof obj[field] === "object") {
      obj[field] = obj[field][locale] ?? obj[field];
    }
  });

  return obj;
};

export const getAllDocuments = (
  Model: Model<any>,
  populate?: string | null,
) =>
  expressAsyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;

    const skip = (pageNumber - 1) * limitNumber;

    // Locale
    const locale = (req.headers["locale"] as string) || "en";

    // Filters
    const filters = { ...req.query };

    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "keyword",
    ];

    excludedFields.forEach((field) => delete filters[field]);

    let queryString = JSON.stringify(filters);

    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    const mongooseFilters = JSON.parse(queryString);

    let query = Model.find(mongooseFilters, { __v: false })
      .skip(skip)
      .limit(limitNumber);

    if (populate) {
      query = query.populate(populate);
    }

    const documents = await query;

    const localizedDocuments = documents.map((document) =>
      localizeDocument(document, locale),
    );

    const countDocuments = await Model.countDocuments(mongooseFilters);

    res.status(200).json({
      status: SUCCESS,
      message: "Documents retrieved successfully",
      data: {
        documents: localizedDocuments,
        pagination: {
          currentPage: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(countDocuments / limitNumber),
          results: localizedDocuments.length,
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

    const locale = (req.headers["locale"] as string) || "en";

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

    const localizedDocument = localizeDocument(
      document,
      locale,
    );

    res.status(200).json({
      status: SUCCESS,
      message: "Document retrieved successfully",
      data: {
        document: localizedDocument,
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
