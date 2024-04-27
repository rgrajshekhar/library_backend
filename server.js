import dotenv from 'dotenv'
import connectDB from './Database/dbconnect.js'
import express from 'express'
import { app } from './app.js'
dotenv.config()

const port = process.env.SERVER_PORT


connectDB()
.then( ()=> {
    app.listen(port, () => {
        console.log(`Server is running at port ${port}`)
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed")
})




