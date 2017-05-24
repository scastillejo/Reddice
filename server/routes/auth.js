import express from 'express';
import User from '../models/da-users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

let router = express.Router();

router.post('/', (req, res) => {
  const password = req.body.password;
  const identifier = {
    username: req.body.identifier,
    email: req.body.identifier
  }

  User.getUserByUsernameOrEmail(identifier, function(err, user){
    if(err) 
      return res.status(401).json({ errors: { form: 'Invalid Credentials' } });
    
    if(user) {
      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({
          id: user._id,
          username: user.username
        }, config.jwtSecret);
        res.json({ token });
      } else {
        res.status(401).json({ errors: { form: 'Invalid Credentials' } });
      }
    } else {
      res.status(401).json({ errors: { form: 'Invalid Credentials' } });
    }
  });
});

export default router;
