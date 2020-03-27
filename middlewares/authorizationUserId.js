const User = require('../models/user');

function authorizationUserId(req, res, next) {
    let UserId = req.userLoggedIn._id;
    User.findById( req.params.id )
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
    authorizationUserId
}
  