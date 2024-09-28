import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const db = await mongoose.connect("mongodb+srv://adminBlog:WIozR7ADvqwBhZul@blogcluster.gkf4pbl.mongodb.net/bloggerDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
        // const db = mongoose.connection;
        
        return db;
    } catch (error) {
        return error;
        // throw error;
    }
}

export default {connectDB,}


