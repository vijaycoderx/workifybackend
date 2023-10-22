import express from "express";
import dotenv from "dotenv"
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const dotenvConfig = dotenv.config();

router.get("/", (req, res) => {
    res.send("Auth HomePage")
})

router.post("/google", (req, res) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONT_END_ORIGIN);
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');

    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK
    )
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/userinfo.profile openid",
        prompt: "consent",
    })

    res.redirect(authUrl)
})

router.get("/googleAuthorized", async (req, res) => {
    const authorizedCode = req.query.code;

    try {
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.GOOGLE_CALLBACK
        )
        
        const getTokens = await oAuth2Client.getToken(authorizedCode);
        const oAuth2ClientCredentials = await oAuth2Client.setCredentials(getTokens.tokens);
        const user = oAuth2ClientCredentials.credentials;

    } catch (error) {
        console.log("error is: " + error);
    }
})


export default router;