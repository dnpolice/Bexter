
module.exports = (req, res, next) => {
    const token = req.headers['x-auth-token']

    if (token == null) return res.status(401).send({msg: "This request must come from a robot"});

    req.robotSerialNumber = token
    next()
}
