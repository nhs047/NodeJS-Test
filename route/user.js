const express = require('express');
const user = express.Router();
const { connect } = require('../database/dbconnection');
const { userdata } = require('../models/userdata');
const { signupValidate } = require('../validate/signup');
const { putUserValidate } = require('../validate/put-user');
const { successResponse, errorResponse, bcryptPassword } = require('../common/helpers');
const {
  signupSuccefully,
  emptyMessage,
  noUpdateFound,
  noRecordFound,
  deletedSuccessfully
} = require('../common/messages');

user.post('/user', async (req, res) => {
    try {
      const { error } = signupValidate.validate(req.body);
      if (error) {
        return errorResponse(res, 400, {}, error.details[0].message);
      }
      await connect();
      const user = new userdata({
        username: req.body.username,
        password: [{ password: await bcryptPassword(req.body.password), isDeleted: false }],
        fullname: req.body.fullname,
        contact: req.body.contact,
        email: req.body.email,
        location: req.body.location,
        isDeleted: false
      });
      await user.save();
      return successResponse(
        res,
        true,
        {
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
          contact: user.contact,
          email: user.email,
          location: user.location
        },
        signupSuccefully
      );
    } catch (err) {
      return errorResponse(res, 400, {}, err.message);
    }
});

user.get('/user', async (req, res) => {
  await require('../common/middleware')(req, res, async()=>{
  try {
    await connect();
    const users = await userdata.aggregate([
      {
        $match: {
          isDeleted: false
        }
      },
      {
        $project: {
          _id: 0,
          username: 1,
          id: '$_id',
          fullname: 1,
          contact: 1,
          location: 1,
          email: 1,
          isDeleted: 1
        }
      }
    ]);
    return successResponse(res, true, users, emptyMessage);
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
})
});

user.put('/user/:id', async (req, res) => {
  await require('../common/middleware')(req, res, async()=>{
  try {
    const { error } = putUserValidate.validate(req.body);
    if (error) {
      return errorResponse(res, 400, {}, error.details[0].message);
    }
    await connect();

    const user = await userdata.updateOne(
      {
        _id: req.params.id
      },
      req.body
    );
    return user.nModified > 0
      ? successResponse(res, true, req.body, emptyMessage)
      : successResponse(res, false, req.body, noUpdateFound);
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
})
});

user.get('/user/:id', async (req, res) => {
  await require('../common/middleware')(req, res, async()=>{
  try {
    await connect();
    const user = await userdata.findOne({
      _id: req.params.id,
      isDeleted: false
    });
    return user
      ? successResponse(
          res,
          true,
          {
            username: user.username,
            fullname: user.fullname,
            contact: user.contact,
            email: user.email,
            location: user.location,
            isDeleted: false
          },
          emptyMessage
        )
      : successResponse(res, false, {}, noRecordFound);
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
})
});

user.delete('/user/:id', async (req, res) => {
  await require('../common/middleware')(req, res, async()=>{
  try {
    await connect();
    const user = await userdata.updateOne(
      {
        _id: req.params.id
      },
      {
        isDeleted: true
      }
    );
    return user.nModified > 0
      ? successResponse(res, true, {}, deletedSuccessfully)
      : successResponse(res, false, {}, noRecordFound);
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
})
});
module.exports = user;