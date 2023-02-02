const jwt = require('jsonwebtoken');
const userQuery = require('../routes/users');

module.exports = async (req, res, next) => {
    /*
    const token = req.headers['x-auth-token']
    // to use ^, where is the token stored..? - in req.body.token? or just a var?
    if (token == null) return res.sendStatus(401)
    req.user = token
    next()
    // OR below
    */

    if (req.cookies.saveUser) {
        if (req.cookies.saveUser == 'loggedout'){
            return res.status(401).json({msg: 'not logged in'});    
        }
        const decoded = jwt.verify(
            req.cookies.saveUser, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) console.log(err)
                else return decoded
            }
        )   
        const getUser = () => { return new Promise(resolve =>
            userQuery.getUserWithEmail(decoded.email, (err, results) => {
                if (err) console.log(err)
                else resolve(results)
            }
        ))}
        const theUser = await getUser();
        if (!theUser) console.log('user email not found');        
        
        req.user = theUser[0];
    } else {
        return res.status(401).json({msg: 'not logged in'});    
    }    
   next();
}
