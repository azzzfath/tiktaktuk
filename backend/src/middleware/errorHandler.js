const { HttpError } = require("../utils/httpError");

function normalizeDatabaseMessage(error) {
  if (!error?.message) return null;
  return error.message.replace(/^ERROR:\s*/i, "");
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }

  if (error?.code === "23505" || error?.code === "23514" || error?.code === "P0001") {
    res.status(400).json({ error: normalizeDatabaseMessage(error) ?? "Data tidak valid" });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
}

module.exports = {
  errorHandler,
};
