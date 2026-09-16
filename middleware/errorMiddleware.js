function errorMiddleware(error, req, res, next) {
    console.error(error);
    if (error.name === "CastError") {
        return res.status(400).json({ success: false, message: "Invalid resource id" });
    }
    if (error.code === 11000) {
        return res.status(409).json({ success: false, message: "A record with these values already exists" });
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode ? error.message : "Internal server error"
    });
}

module.exports = errorMiddleware;