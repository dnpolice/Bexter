
module.exports = (req, res, next) => {
    const token = req.headers['x-auth-token']

    if (token == null) return res.sendStatus(401)

    req.robotSerialNumber = token
    next()
}
