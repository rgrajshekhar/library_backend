import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const connectionInstances = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        
        console.log(`\n Database connected !! DB HOST : ${connectionInstances.connection.host}`);
        
    } catch (error) {
        console.log("Database Server connection error", error);
        process.exit(1)
    }
}

export default connectDB
