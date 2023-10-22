import axios from "axios"
import { OAuth2Client } from "google-auth-library";
import {verifyUser} from "./jwtUtils"

// const googleUrlGenerator = 

const userInfo = async (access_token) => {
    const userDataResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const userData = await userDataResponse.data;

    return userData;
}

const verifyUser = (userJWTToken, secret) => {
    try {
        const verifyUserRespose = verifyUser(userJWTToken, secret);
        return verifyUserRespose;
    } catch (error) {
        return error;
    }

}