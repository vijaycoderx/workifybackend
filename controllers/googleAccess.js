import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import jwtUtils from "./jwtUtils.js";

const googleUrlGenerator = (req, res) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN);
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');

    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK
    )
    try {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
            prompt: "consent",
        })
        console.log(process.env.FRONTEND_ORIGIN);
        return authUrl;
    } catch (error) {
        return error;
    }
}

const googleAuthorizedGenerateTokens = async (req, res) => {
    try {
        const authorizedCode = req.query.code;
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CALLBACK
        )
        
        const getTokens = await oAuth2Client.getToken(authorizedCode);
        await oAuth2Client.setCredentials(getTokens.tokens);
        const user = oAuth2Client.credentials;

        return user;
    } catch (error) {
        return error;
    }
}

const userInfo = async (access_token) => {
    try {
        const userDataResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
        const userData = await userDataResponse.data;

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
    googleUrlGenerator,
    googleAuthorizedGenerateTokens,
    userInfo,
    verifyUser,
}