const helper = require("./helpers");
const messages = require("../common/messages");
const jwt = require("jsonwebtoken");
const { secret } = require("../common/key");
const { connect } = require('../database/dbconnection');
const { userdata } = require('../models/userdata');

module.exports = async (req, res, next) => {
  try {
    if (req.headers && req.headers.authorization) {
        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
          const receivedToken = req.headers.authorization.split(" ")[1];
          if (receivedToken === undefined)
            return helper.errorResponse(
              res,
              400,
              {},
              messages.tokenMissing
            );
          const decoded = await jwt.verify(receivedToken, secret);
          await connect();
          const jwtTokenData = await userdata.findOne({
            _id: decoded.subject
          },{_id:1});
          if (jwtTokenData === null)
            helper.errorResponse(
              res,
              500,
              {},
              "Failed to authenticate token."
            );
          var decodedJWT = await jwt.decode(receivedToken, {
            complete: true
          });
          req.receivedToken = receivedToken;
          req.reqestedUserId = decodedJWT.payload.subject;
          req.requestedUserMail = decodedJWT.payload.phoneno;
          req.requestedFullName = decodedJWT.payload.fullName;
          req.requestedUserName = decodedJWT.payload.username;
          await next();
        }
    } else helper.errorResponse(res, 400, {}, messages.tokenMissing);
  } catch (err) {
    err.message === "jwt expired"
      ? helper.errorResponse(res, 463, {}, "Token Expired")
      : helper.errorResponse(res, 500, {}, "Failed to authenticate token.");
  }
};
