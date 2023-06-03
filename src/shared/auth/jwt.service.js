const jwt = require('jsonwebtoken');

const accessKey = process.env.ACCESS_KEY;
const refreshKey = process.env.REFRESH_KEY;

async function generateToken(payload) {
    const accessToken = await jwt.sign(payload,accessKey,{expiresIn: process.env.ACCESS_TIME});
    const refreshToken = await jwt.sign(payload,refreshKey,{expiresIn: process.env.REFRESH_TIME})
    return {
        access_token: accessToken,
        refresh_token: refreshToken
    }
}

function verifyAccessToken(accesstoken) {
      try{
          const token = jwt.verify(accesstoken,accessKey);
      }  catch(e) {
          return e.message;
      }
}

function verifyRefreshToken(refreshtoken) {
    try{
        const token = jwt.verify(refreshtoken,refreshKey);
    }  catch(e) {
        return e.message;
    }
}

module.exports = {
    generateToken,
    verifyAccessToken,
    verifyRefreshToken
}