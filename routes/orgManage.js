import express from "express";
import orgService from "../services/orgService.js";
import multer from "multer";

import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb){
//         cb(null, "./uploads");
//     },

//     filename: function (req, file, cb) {
//         console.log("xxxxxxxxxxxx", req.body)
//         console.log("")
//         console.log("yyyyyyyyyyyyyy",file.originalname, "rex")
//         cb(null, Date.now() + file.originalname);
//     }
// })

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


AWS.config.update({
    accessKeyId: process.env.AWSACCESSKEY,
    secretAccessKey: process.env.AWSSECRETACCESSKEY,
    region: "us-east-1",
})

console.log("keys xxx", process.env.AWSACCESSKEY, process.env.AWSSECRETACCESSKEY);
const s3 = new AWS.S3();

router.post("/create", upload.single("orgImage"), async (req, res) => {
    const data = req.body;
    const fileContent = req.file.buffer;
    const filename = req.file.originalname;
    
    console.log("vijay keys", process.env.AWSACCESSKEY, process.env.AWSSECRETACCESSKEY);
    console.log(data, "desc", data.caption, "original", req.file.originalname)
    console.log("fillllllllllllll", req.file.buffer)
    

    const params = {
        Bucket: 'taskitup', // Replace with your bucket name
        Key: Date.now().toString() + '-' + filename, // File name in S3
        Body: fileContent,
        ContentType: req.file.mimetype, // MIME type of the file
        ACL: 'public-read', // Set the access control list for the uploaded file
    }

    // var imagex = "";
    // s3.upload(params, (err, data) => {
    //     if (err) {
    //         console.log("errrrrror", err);
    //     } else {
    //         console.log("response", data);
    //         console.log("img", data.Location);
    //         imagex = data.Location;
    //     }
    // })

    // s3.upload(params).promise()
    //     .then(data => {
    //         imagex = data.Location;
    //     })
    //     .catch(err => {
    //         console.log("upload error", err);
    //     })
    //     .finally(() => {
    //         console.log("final", imagex)
    //     })
    // console.log("xxxxxxxxxxx", imagex, "yyyyyyyyy")
    try {
        let imagel = ""
        const s3Data = await s3.upload(params).promise();

        imagel = s3Data.Location;
        console.log("xxxxxxxxxxx", imagel, "yyyyyyyyy")
        // .then(data => {
        //     imagex = data.Location;
        // })
        // .catch(err => {
        //     console.log("upload error", err);
        // })
        // .finally(() => {
        //     console.log("final", imagex)
        // })

        const orgDataForDB = {
            // email: userData.email,
            // name: userData.name ? userData.name : "",
            // username: userData.username ? userData.username : undefined,
            // photo: userData.picture ? userData.picture : "",
            // accountType: "google",
            name: data.orgName,
            desc: data.caption,
            image: imagel,
            admin: data.admin,
            id: Math.floor((Math.random() * 1000000000)),
            invitecode: Math.floor((Math.random() * 1000000000)),
            
            
        }

        const addOrg = await orgService.addNewOrg(orgDataForDB);
        // console.log("gorre", data.orgImage.name);
    } catch (error) {
        console.log("error", error)
        return error;
    }
    res.send({ message: "welcome " + req.body.orgName });
})

router.post("/join", async (req, res) => {
    const data = req.body;
    try {
        const joinOrg = await orgService.joinOrg(data);

    } catch (error) {
        return error;
    }
    // console.log(typeof(data.invitecode))
})

router.post("/addtask", async (req, res) => {
    const data = req.body;
    try {
        const addTask = await orgService.addOrgTask(data);
    } catch (error) {
        return error;
    }
})

router.post("/updatetask", async (req, res) => {
    const data = req.body;
    try {
        const updateTask = await orgService.updateOrgTask(data);
    } catch (error) {
        return error
    }
})

router.post("/deletetask", async (req, res) => {
    const data = req.body;
    try {
        const updateTask = await orgService.deleteOrgTask(data);
    } catch (error) {
        return error
    }
})

export default router;