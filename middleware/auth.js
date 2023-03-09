const jwt = require('jsonwebtoken');
const userQuery = require('../routes/users');

module.exports = async (req, res, next) => {
    if (req.cookies.saveUser) {
        if (req.cookies.saveUser == 'loggedout') {
            return res.status(401).json({msg: 'not logged in'});    
        }
        console.log(req.cookies.saveUser);
        const decoded = jwt.verify(
            req.cookies.saveUser, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                console.log(decoded)
                if (err) console.log(err)
                return decoded;
            }
        )
        if (decoded == null) {
            return res.status(401).json({msg: 'error decoding'});
        }
        
        const getUser = () => { return new Promise(resolve =>
            userQuery.getUserWithEmail(decoded.email, (err, results) => {
                if (err) console.log(err)
                else resolve(results)
            }
        ))}
        const theUser = await getUser();
        if (!theUser) console.log('user email not found');        
        
        req.user = theUser[0];

        next();
    } else {
        return res.status(401).json({msg: 'not logged in'});    
    }    

}
