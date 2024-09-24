import express from "express";
import cookieParser from 'cookie-parser'
import cors from "cors"

const app= express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit :"16kb"}))  /// data by from
app.use(express.urlencoded({extended :true ,limit : "16kb"})) // data by url
app.use(express.static("public"))// data by file and pdf

// app.use(cookiesParser()) // cp se user ki brower ki cookise ko accse krn and set krn 
app.use(cookieParser())




//router  import 
import userRoutes from './routes/user.routes.js'
    
// routes declaration
app.use("/api/v1/users",userRoutes)

export default app;