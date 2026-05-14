const jwt = require("jsonwebtoken");
const { createHttpError } = require("../utils/httpError");

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required");
  return secret;
}

function readToken(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

function optionalAuth(req, res, next) {
  const token = readToken(req);
  if (!token) {
    next();
    return;
  }

  try {
    req.user = jwt.verify(token, getSecret());
    next();
  } catch {
    next(createHttpError(401, "Token tidak valid atau sudah kedaluwarsa"));
  }
}

function requireAuth(req, res, next) {
  optionalAuth(req, res, (error) => {
    if (error) {
      next(error);
      return;
    }
    if (!req.user) {
      next(createHttpError(401, "Login diperlukan"));
      return;
    }
    next();
  });
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      next(createHttpError(401, "Login diperlukan"));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(createHttpError(403, "Role tidak memiliki akses"));
      return;
    }
    next();
  };
}

module.exports = {
  optionalAuth,
  requireAuth,
  requireRole,
};
