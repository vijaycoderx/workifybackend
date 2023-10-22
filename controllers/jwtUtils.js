import jwt from "jsonwebtoken";

const createJWT = (data) => {
    try {
        const generateJWT = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1h" });
        return generateJWT;
    } catch (error) {
        return error;
    }
}

const verifyJWT = (data, secret) => {
    try {
        const verifiedJWT = jwt.verify(data, secret);
        return verifiedJWT;
    } catch (error) {
        return error;
    }
}



