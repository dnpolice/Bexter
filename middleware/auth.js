const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-auth-token']
    // to use ^, where is the token stored..? 

    //OR
    // TODO: look for cookie in res.cookies and decode the cookie to get the token

    if (token == null) return res.sendStatus(401)

    req.user = token
    next()

    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //     if (err) return res.sendStatus(403)
        
    //     req.user = user
    //     next()
    // })


}
