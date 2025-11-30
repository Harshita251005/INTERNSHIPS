/**
 * Middleware to check if user has required role(s)
 * @param {Array<string>} allowedRoles - Array of allowed roles
 */
export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    // Check if user role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
    }

    // Special check for shopkeepers - must be approved
    if (req.user.role === 'shopkeeper' && !req.user.shopkeeperApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your shopkeeper account is pending approval. Please wait for admin approval.',
      });
    }

    next();
  };
};

export default roleMiddleware;
