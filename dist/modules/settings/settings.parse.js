export const parseSettingsBody = (req, res, next) => {
    try {
        if (req.body.socialLinks && typeof req.body.socialLinks === "string") {
            req.body.socialLinks = JSON.parse(req.body.socialLinks);
        }
        next();
    }
    catch (err) {
        return res.status(400).json({
            message: "Invalid JSON in socialLinks",
        });
    }
};
