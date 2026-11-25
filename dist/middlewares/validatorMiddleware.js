import { validationResult } from "express-validator";
import { validationMessages } from "../utils/validationsMessages.js";
const validatorMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const locale = req.headers.locale === "ar" ? "ar" : "en";
        const translatedErrors = errors.array().map((error) => ({
            field: error.type === "field" ? error.path : undefined,
            message: validationMessages[locale][error.msg] ?? error.msg,
        }));
        return res.status(400).json({
            errors: translatedErrors,
        });
    }
    next();
};
export default validatorMiddleware;
