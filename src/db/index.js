// import mongoose from "mongoose";
// //import { db_name } from "../consants.js"; // assuming you have constants
// import dotenv from "dotenv";

// dotenv.config();


// const connectDB = async () => {
//     try {
//         const connectionInstance = await mongoose.connect( "mongodb+srv://pritisahu07610761:priti123@cluster0.gsa7i.mongodb.net", {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         console.log(`\nMongoose Connected!! DB Host: ${connectionInstance.connection.host}`);

      
//     console.log(`Server running on port ${process.env.PORT}`);

//     } catch (error) {
//         console.log("Mongoose connection error:", error);
//         process.exit(1);
//     }
// };

// export default connectDB;


import mongoose from "mongoose";
import { DB_NAME } from "../consonant.js";

const connectDB = async () => {
    try {
       const connectionInstance = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`);
       console.log(`\nmongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB ERROR..", error);
        process.exit(1);
    }
}

export default connectDB;