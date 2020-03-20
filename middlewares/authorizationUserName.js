const User = require('../models/user');

function authorizationUserName(req, res, next) {
    let UserId = req.userLoggedIn._id;
    User.findOne( { username: req.params.username} )
    .then(user => {
        if(user) {
            if(String(user._id) === UserId) {
                next();
            } else {
                next({ status: 400, message: 'Unauthorize' })
            }
        } else {
            next({ status: 400, message: 'Data not found' })
        }
    })
    .catch(next)
}

module.exports = {
    authorizationUserName
}
  