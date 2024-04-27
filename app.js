import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const corsOption ={
    origin:"*",
    credentials:true,
    }

app.use(cors(corsOption));

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import

import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users",userRouter)

export { app }