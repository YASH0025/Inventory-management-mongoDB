import Tokens from "jsonwebtoken";
const { verify, sign } = Tokens

const getTokenDataFromHeader = (authorizationHeader) =>
    verify(authorizationHeader.split(" ")[1], "your-secret-key");

const handleStatusCode = (res, statusCode, message) =>
    res.status(statusCode).json({ message });
    
const generateToken = (data) =>
    sign(data, "your-secret-key", { expiresIn: "1h" });

export default {
    getTokenDataFromHeader,
    handleStatusCode,
    generateToken,
};
