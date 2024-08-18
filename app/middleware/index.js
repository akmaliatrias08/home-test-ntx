const jwt = require("jsonwebtoken");
const config = require("../config/auth");

const tokenValidation = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).send({
        statusCode: 401,
        success: false,
        message: "access denied",
      });

    const decoded = jwt.verify(token, config.secret);
    req.id = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send({
      statusCode: 400,
      success: false,
      message: "invalid token",
    });
  }
};

module.exports = {
  tokenValidation
};
