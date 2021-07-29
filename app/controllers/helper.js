const db = require('../models');
const Users = db.users;
const jwt = require('jsonwebtoken');

exports.checkIfNotLoggedIn = async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send({
      message: 'You are not authorized',
    });

    return true;
  }

  let key = null;

  try {
    key = jwt.verify(req.headers.authorization, process.env.PRIVATE_JWT_KEY || 'PrivateKey');
  } catch {
    res.status(401).send({
      message: 'You are not authorized',
    });

    return true;
  }

  if (key) {
    const user = await Users.findOne({
      where: {
        id: key._id,
      },
    });

    if (!user) {
      res.status(403).send({
        message: 'You are blocked',
      });

      return true;
    }

    if (user.status === 'blocked') {
      res.status(403).send({
        message: 'You are blocked',
      });

      return true;
    }
  }

  return false;
};
