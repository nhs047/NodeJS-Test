const express = require('express');
const auth = express.Router();
const { connect } = require('../database/dbconnection');
const { userdata } = require('../models/userdata');
const users = userdata;
const { successResponse, errorResponse, bcryptMatch } = require("../common/helpers");
const { noRecordFound, credentialMismatch, emptyMessage } = require("../common/messages");
auth.post('/signin', async (req, res) => {
  try {
    await connect();
    
    const data = await users.aggregate(authAggregation(req.body.username));
    if(data.length === 0){
      return successResponse(res, true, { isAuthorised: false, userInformation: {}}, noRecordFound);
    }
    if(await bcryptMatch(req.body.password, data[0].password)){
      data[0].password = undefined;
      data[0].accessToken = createToken(data[0].id, data[0].username, data[0].fullname, data[0].contact);
      return successResponse(res, true, { isAuthorised: true, userInformation: data[0]}, emptyMessage);
    }
    return successResponse(res, true, { isAuthorised: false, userInformation: {}}, credentialMismatch);
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
});
module.exports = auth;