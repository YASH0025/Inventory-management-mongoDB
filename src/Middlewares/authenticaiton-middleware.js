import webToken from 'jsonwebtoken';
const{ verify } =webToken
const secretKey = 'your-secret-key';


const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decodedToken = verify(token.replace('Bearer ', ''), secretKey);
        req.user = {
            userId: decodedToken.userId,

        };
        next();
    } catch (err) {
        console.error(err);
        res.status(403).json({ message: 'Forbidden' });
    }
};

export default { authenticateToken }
