import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";

import googleAuth from "./routes/googleAuth.js";
import githubAuth from "./routes/githubAuth.js";
import emailAuth from "./routes/emailAuth.js";
import authCheck from "./routes/authCheck.js";
import orgManage from "./routes/orgManage.js";
import user from "./routes/user.js";
import passReset from "./routes/passReset.js";

import database from "./services/database.js"
// import userModel from "./models/userModel.js";

const db = await database.connectDB();
// const newuser = new user({ username: "vijaycoderx", email: "vijaycoderx@gmail.com", password: "heybro", accountType: "email" })

// newuser.save().then((res) => console.log("user saved" + res))

const app = express();
const PORT = 8000;
const dotenvConfig = dotenv.config();

app.use(cors({
    origin: "*"
}))

app.use(json());
app.use(authCheck);
app.use("/auth", googleAuth);
app.use("/auth", githubAuth);
app.use("/auth", emailAuth)
app.use("/org", orgManage);
app.use("/user", user);
app.use(passReset);

app.listen(PORT, () => console.log("server started at port" + PORT))
