const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = db.users;
const helpers = require('../controllers/helper');

exports.register = async (req, res) => {
  if (!(req.body.name && req.body.password && req.body.email)) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  const user = {
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    status: 'active',
    lastLoginDate: new Date(),
  };

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  Users.create(user)
    .then(data => {
      const token = jwt.sign({ _id: data.id }, 'PrivateKey');
      res.send(JSON.stringify(token));
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Tutorial.',
      });
    });
};

exports.findAll = async (req, res) => {
  if (await helpers.checkIfNotLoggedIn(req, res)) {
    return;
  }

  try {
    Users.findAll({
      attributes: ['name', 'email', 'status', 'lastLoginDate', 'id', 'createdAt'],
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving tutorials.',
        });
      });
  } catch {
    res.status(401).send({
      message: 'You are not authorized',
    });
  }
};

exports.login = async (req, res) => {
  const user = await Users.findOne({
    email: req.body.email,
  });

  if (user.status === 'blocked') {
    res.status(400).send('This user blocked');
    return;
  }

  if (!(req.body.password && req.body.email)) {
    return res.status(401).send('Incorrect email or password.');
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(401).send('Incorrect email or password.');
  }
  const token = jwt.sign({ _id: user.id }, 'PrivateKey');
  res.send(JSON.stringify(token));
};

exports.blockUsers = async (req, res) => {
  if (await helpers.checkIfNotLoggedIn(req, res)) {
    return;
  }

  if (!req.body.keys) {
    res.status(400).send({ message: "You didn't provide keys" });
    return;
  }

  await Promise.all(
    req.body.keys.map(async key => {
      const user = await Users.findOne({
        where: {
          id: key,
        },
      });

      user.status = 'blocked';

      await user.save();
    }),
  );

  const users = await Users.findAll({
    attributes: ['name', 'email', 'status', 'lastLoginDate', 'id', 'createdAt'],
  });

  if (await helpers.checkIfNotLoggedIn(req, res)) {
    return;
  }

  res.send(users);
};

exports.activateUsers = async (req, res) => {
  if (await helpers.checkIfNotLoggedIn(req, res)) {
    return;
  }

  if (!req.body.keys) {
    res.status(400).send({ message: "You didn't provide keys" });
    return;
  }

  await Promise.all(
    req.body.keys.map(async key => {
      const user = await Users.findOne({
        where: {
          id: key,
        },
      });

      user.status = 'active';

      await user.save();
    }),
  );

  const users = await Users.findAll({
    attributes: ['name', 'email', 'status', 'lastLoginDate', 'id', 'createdAt'],
  });

  if (await helpers.checkIfNotLoggedIn(req, res)) {
    return;
  }

  res.send(users);
};

exports.deleteUsers = async (req, res) => {
  if (await helpers.checkIfNotLoggedIn(req, res)) {
    return;
  }

  if (!req.body.keys) {
    res.status(400).send({ message: "You didn't provide keys" });
    return;
  }

  await Promise.all(
    req.body.keys.map(async key => {
      const user = await Users.findOne({
        where: {
          id: key,
        },
      });

      await user.destroy();
    }),
  );

  const users = await Users.findAll({
    attributes: ['name', 'email', 'status', 'lastLoginDate', 'id', 'createdAt'],
  });

  if (await helpers.checkIfNotLoggedIn(req, res)) {
    return;
  }

  res.send(users);
};
