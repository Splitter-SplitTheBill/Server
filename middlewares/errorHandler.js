module.exports = function (error, req, res, next) {
    let status = null;
    let message = null;

    if(error.name === 'JsonWebTokenError') {
        status = 400;
        message = 'Please login first!';
    } else {
        status = error.status || 500;
        message = error.message || 'Internal server error';
    }
    // const status = error.status || 500
    // const message = error.message || 'Internal server error'
    res.status(status).json({ message })
}

// Format catch(error) = next({ status: 4xx, message: 'ini message errornya' })