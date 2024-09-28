import axios from "axios";
import jwtUtils from "./jwtUtils.js";

const githubUrlGenerator = (req, res) => {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`;
    return authUrl
}

const githubAuthorizedGenerateTokens = async (req, res) => {
    try {
        const authorizedCode = req.query.code;
        const authClient = {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: authorizedCode,
        }
        const opts = {
            headers: {
                accept: "application/json"
            }
        }
        const getTokens = await axios.post("https://github.com/login/oauth/access_token", authClient, opts);
        const user = await getTokens.data;

        return user;
    } catch (error) {
        return error;
    }
}

const userInfo = async (access_token) => {
    try {
        const userData = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${access_token}`,
            }
        }).then((response) => { return response.data });
        // console.log(userData)
        return userData;
        
    } catch (error) {
        return error;
    }
}

const verifyUser = (userJWTToken) => {
    try {
        const verifyUserRespose = jwtUtils.verifyJWT(userJWTToken, process.env.JWT_SECRET);
        return verifyUserRespose;
    } catch (error) {
        return error;
    }

}

export default {
    githubUrlGenerator,
    githubAuthorizedGenerateTokens,
    userInfo,
    verifyUser,
}