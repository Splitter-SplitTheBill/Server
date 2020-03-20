module.exports = function (error, req, res, next) {
    const status = error.status || 500
    const message = error.message || 'Internal server error'
    res.status(status).json({ message })
}

// Format catch(error) = next({ status: 4xx, message: 'ini message errornya' })