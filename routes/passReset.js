import express from "express";
import nodemailer from "nodemailer";
import userDataService from "../services/userDataService.js";
import dotenv from "dotenv";
import jwtUtils from "../controllers/jwtUtils.js";
import bcrypt from "bcryptjs";



import FormData from 'form-data';
import Mailgun from "mailgun.js";
const mailgun = new Mailgun(FormData);
dotenv.config()


console.log("apikey", process.env.MAILGUN_API_KEY)
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});





const router = express.Router();

const transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 587,
    auth: {
        user: process.env.AWSSMTPUSER,
        pass: process.env.AWSSMTPPASS,
    }
})



router.post("/reset", async (req, res) => {
    const useremail = req.body.email;
    // console.log("xxxxxxxxxxxxxxxx", req);
    const jsonUserData = {
        email: useremail,
    }
    const userpresent = await userDataService.userData(jsonUserData);
    console.log("user present", userpresent)
    if (userpresent) {
        const strtoken = {
            numtoken: Math.random().toString(36) + Math.random() * 1000000000 + Math.random().toString(36),
            user: useremail,
        }
        console.log("hex", strtoken, typeof(strtoken))
        const resettoken = jwtUtils.createJWT(strtoken)
        // const hashedCode = async (strtoken, salt) => {
        //     let phash = bcrypt.hash(strtoken, salt)
        //     return phash
        // }
        const salt = await bcrypt.genSalt(10);
        let hashedCode = await bcrypt.hash(resettoken, salt);
        // bcrypt.genSalt(10, (err, salt) => {
        //     if (err) {
        //         console.log("erroe", err)
        //     } else {
        //         hashedCode = bcrypt.hash(resettoken, salt)

        //     }
        // })
        console.log("reset", resettoken, process.env.FRONTEND_ORIGIN, "haaaaash", hashedCode, userpresent)
        
        const updateUserPtoken = await userDataService.updateData(userpresent.email, "ptoken", hashedCode);
        
//         const emailOptions = {
//             from: "vijaycoderx@gmail.com",
//             to: "vijaycoderx@gmail.com",
//             subject: "password reset",
//             text: `Hello ${useremail},
// We received a request to reset the password for your account associated with this email address. If you didn't make this request, please ignore this email. Otherwise, you can reset your password by clicking the link below:

// Reset Password
// This link will expire in 24 hours, so be sure to use it soon. If the link doesn't work, you can copy and paste the following URL into your browser:

// ${process.env.FRONTEND_ORIGIN}/reset?token=${resetLink}

// If you have any questions or need further assistance, feel free to contact our support team.

// Thank you`,
//         }

        // transporter.sendMail(emailOptions, (error, info) => {
        //     if (error) {
        //         console.log("error", error)
        //     } else {
        //         console.log("info", info)
        //     }
        // })


        const mgHtml = `<p>Your reset link is below, click to reset</p><a href=${process.env.FRONTEND_ORIGIN}/reset?token=${resettoken}>${process.env.FRONTEND_ORIGIN}/reset?token=${resettoken}</a>}`

        mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: "devplay <mailgun@service.devplay.me>",
            to: [useremail],
            subject: "Password Reset",
            text: "Auth",
            html: [mgHtml]
        })
        .then(msg => console.log("msg",msg)) // logs response data
        .catch(err => console.log("err",err)); // logs any error



        res.send("1")
    } else {
        res.send("0")
    }
    
    // res.send("hi")
})

router.post("/verifyresettoken", async (req, res) => {
    const data = req.body
    console.log("oi", data)
    
    try {
        const verifytoken = jwtUtils.verifyJWT(data.token)
        // console.log(verifytoken)

        if (verifytoken.message === "invalid signature") {
            res.send({status: 0})
            console.log("error")
        } else {
            // const salt = await bcrypt.genSalt(10);
            // const tokenHash = await bcrypt.hash(data.token, salt);
            const userPtoken = await userDataService.userData(data);
            console.log(verifytoken, userPtoken)
            const compareToken = await bcrypt.compare(data.token, userPtoken.ptoken)
            console.log(compareToken, "eeeee")
            if (compareToken == true) {
                res.send({status: true})
            } else {
                res.send({status: false})
            }
        }
        
        // res.send({status: verifytoken})
    } catch (error) {
        console.log("err", error)
    }
    
})

export default router;