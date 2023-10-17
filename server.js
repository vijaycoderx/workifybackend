import express from "express";
import dotenv from "dotenv";

const app = express();
const PORT = 8000;
const dotenvConfig = dotenv.config();

app.listen(PORT, () => console.log("Listening to Server at PORT " + PORT));

app.get("/", (req, res) => {
    try {
        res.send(process.env.DB_HOST + "hi");
        console.log(process.env.DB_HOST);
    } catch (error) {
        res.send(error);
    }
})