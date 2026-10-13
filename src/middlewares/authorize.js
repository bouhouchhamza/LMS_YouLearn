export const authorize = (...allowedRole) => {
  return (req, res, next) => {
    if (!allowedRole.includes(req.user.role)) {
      return res.status(403).json({
        message: "your Role doesn't support the action",
      });
    }
    return next();
  };
};
