module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    try {
        const user_id = token;

        req.userId = user_id;
        next();
    } catch (error) {
        res.status(401).json({msg: "Invalid token"})
    }
}