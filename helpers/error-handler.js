function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    console.log("messgae " + err.inner.name);

    // jwt authentication error
    return res.status(401).json({ message: "The user is not authorized" });
  }

  if (err.name === "ValidationError") {
    // validation error
    return res.status(401).json({ message: err });
  }

  // default to 500 server error
  return res.status(500).json({ message: "Internal server error" });
}

module.exports = { errorHandler };
