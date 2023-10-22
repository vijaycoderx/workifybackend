import express, { json } from "express";
import dotenv from "dotenv";
import fetch from 'node-fetch';
import jwt from "jsonwebtoken";

import mongoose from "mongoose";
import cors from "cors";
import { JWT, OAuth2Client } from "google-auth-library";
import axios from "axios";

const app = express();
const PORT = 8000;
const dotenvConfig = dotenv.config();

app.use(
    cors({
        origin: "*"
    })
)
app.use(express.json())

app.listen(PORT, () => console.log("Listening to Server at PORT " + PORT));

// app.get("/", (req, res) => {
//     try {
//         res.send(process.env.DB_HOST + "hi");
//         console.log(process.env.DB_HOST);
//     } catch (error) {
//         res.send(error);
//     }
// })
const jwtTokenGenerate = (data) => {
    let generatedJWT = jwt.sign(data, process.env.JWT_SECRET, {expiresIn: "30s"});
    return generatedJWT;
}

const getTokens = async (access_token, res) => {
    // const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${acess_token}`);
    // const data = await response.json();
    const data = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`)
    const jwtToken = jwtTokenGenerate(data.data);
    console.log(JSON.stringify(data.data) + " jwt token " + jwtToken);
    // console.log("acess token xxxxxxxxxxxxxxxxxxxxx ", data.data + "token yyyyyyyyyyyyyyyyyyyyyy " + access_token);
    res.redirect(`http://localhost:3000/admin?access_token=${jwtToken}`);
    // res.send(access_token);
}

app.post("/auth", async (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');

    const redirect = "http://localhost:8000";

    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirect
    )

    const authorizedUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/userinfo.profile openid",
        prompt: "consent",
    })

    res.json({ authorizedUrl })
    
})

app.get('/', async (req, res) => {
    const code = req.query.code;
    console.log("google sends a code hence user authenticated successfully" + code);
    try {
        const redirect = "http://localhost:8000";

        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirect
        ) 

        const tokenResponse = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(tokenResponse.tokens);
        // console.log("token aquired" + JSON.stringify(res.tokens));
        const user = oAuth2Client.credentials;
        // console.log("user" + JSON.stringify(user));
        // console.log(user.access_token);
        await getTokens(user.access_token, res);
        
        
    } catch (error) {
        console.log("error x " + error);    
    }
})

app.post('/verify', (req, res) => {
    try {
        const verifyJWT = jwt.verify(req.body.jwtTokenStored, process.env.JWT_SECRET)
        console.log(typeof(req) + JSON.stringify(req.body.jwtTokenStored + JSON.stringify(verifyJWT)))
        res.send(JSON.stringify(verifyJWT))
    } catch (error) {
        console.log(error + "token expired")
        res.send("expired");
    }
    
})