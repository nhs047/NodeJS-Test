const { sign } = require("jsonwebtoken");
const { secret } = require("../common/key");
const { hash, compare } = require('bcrypt');
module.exports = {
  createToken: (id, username,fullName, phoneno) => createToken(id, username,fullName, phoneno),
  successResponse: (res, isExecuted, data, message) =>
    successResponse(res, isExecuted, data, message),
  errorResponse: (context, code, data, message) =>
    errorResponse(context, code, data, message),
  authAggregation: (username) => authAggregation(username),
  bcryptPassword: async(plainPassword) => await bcryptPassword(plainPassword),
  bcryptMatch: async(plainText, hash) => await bcryptMatch(plainText, hash),
};

const errorResponse = (res, code, data, message) => {
  return res.status(code).json(bodyContent(false, data, message));
};

const successResponse = (res, isExecuted, data, message) => {
  return res.status(200).json(bodyContent(isExecuted, data, message));
};

const bodyContent = (isExecuted, data, message) => {
  return {
    isExecuted,
    data,
    message
  };
}

createToken = (id, username, fullName, phoneno) => {
    const claims = {
      issuer: 'BSTestAPI',
      subject: id,
      username: username,
      fullName: fullName,
      phoneno: phoneno
    };
    return sign(claims, secret, {
      expiresIn: 3600
    });
  }

  authAggregation = (username) => [
      {
        $match: {
          username: username
        }
      },
      {
        $unwind: '$password'
      },  
      {
        $match: {
          'password.isDeleted': false
        } 
      },
      {
        $project: {
          id: '$_id',
          _id: 0,
          username: 1,
          password: '$password.password',
          fullname: 1,
          email:1,
          location: 1,
          contact: 1 
        }
      }
    ]

    const bcryptPassword = async (plainPassword) => await hash(plainPassword, 10)
    const bcryptMatch = async(plainText, hash) => await compare(plainText, hash)
    