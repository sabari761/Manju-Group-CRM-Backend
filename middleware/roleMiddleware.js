function roleMiddleware(...allowedRoles) {
    return (req, res, next) => {
        const isSuperAdmin = req.user && req.user.role === "SUPER_ADMIN";
        if (!req.user || (!allowedRoles.includes(req.user.role) && !isSuperAdmin)) {
            return res.status(403).json({ success: false, message: "You do not have permission for this action" });
        }
        next();
    };
}

module.exports = roleMiddleware;