import express from 'express';
import commonValidations from '../shared/validations/signup';
import bcrypt from 'bcrypt';
import isEmpty from 'lodash/isEmpty';
import User from '../models/da-users';

let router = express.Router();

function validateInput(data, otherValidations){
  return new Promise(function(resolve, reject){
    let { errors } = otherValidations(data);

    const identifier = {
      username: data.username,
      email: data.email
    }

    User.getUserByUsernameOrEmail(identifier, (err, user) => {
      if(user){
        if (identifier.username === user.username)
          errors.username = 'There is user with such username';
        if (identifier.email === user.email)
          errors.email = 'There is user with such email';
      }
      resolve({
        errors,
        isValid: isEmpty(errors)
      });
    });
  });
}

router.get('/:identifier', (req, res) => {
  const identifier = {
    username: req.params.identifier,
    email: req.params.identifier
  }
  User.getUserByUsernameOrEmail(identifier, (err, user) => {
    if(user)
      res.json({ user });
    else
      res.json({});
  });
});


router.post('/', (req, res) => {
  validateInput(req.body, commonValidations).then(({ errors, isValid }) => {
    if (isValid) {

      let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        timezone: req.body.timezone
      });

      User.createUser(newUser, (err, data) => {
        if(err != null)
          res.status(500).json({ error: err });
        if(data != undefined)
          res.json({ success: true });
      });

    } else {
      res.status(400).json(errors);
    }
  });

});

export default router;
