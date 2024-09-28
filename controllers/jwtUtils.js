import jwt from "jsonwebtoken";

const createJWT = (data) => {
    try {
        const generateJWT = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "24h" });
        return generateJWT;
    } catch (error) {
        return error;
    }
}

const verifyJWT = (data) => {
    try {
        const verifiedJWT = jwt.verify(data, process.env.JWT_SECRET);
        // console.log("jwt data" , verifiedJWT);
        return verifiedJWT;
    } catch (error) {
        return error;
    }
}

export default { createJWT, verifyJWT };



