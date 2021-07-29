module.exports = app => {
  const users = require('../controllers/user.controller.js');

  var router = require('express').Router();

  router.post('/register', users.register);

  router.get('/list', users.findAll);

  router.post('/login', users.login);

  router.post('/blockUsers', users.blockUsers);

  router.post('/activateUsers', users.activateUsers);

  router.post('/deleteUsers', users.deleteUsers);

  app.use('/api/users', router);
};
