const { verifyToken } = require('./jwt');
const User = require('../models/user');

function authentication(req, res, next) {
  if (req.headers.hasOwnProperty('token')) {
      try {
        req.userLoggedIn = verifyToken(req.headers.token);
        User.findById(req.userLoggedIn._id)
          .then(user => {
            if (user) {
              next();
            } else {
              next({ status: 400, message: 'Invalid access' });
            }
          })
          .catch(next);
      } catch(err) {
        next(err);
      }
  } else {
      next({ status: 401, message: 'You must log in first'});
  }
}

module.exports = {
    authentication
}