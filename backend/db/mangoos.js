import mongoose from "mongoose"
import dotenv from 'dotenv'
import chalk from 'chalk'

dotenv.config();

const mongoDb = async() => {
    try {
        // await mongoose.connect(`mongodb+srv://${process.env.MANGO_DB_USER}:${process.env.MANGO_DB_PASSWORD}@cluster0.uku31b0.mongodb.net/${process.env.MANGO_DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
        await mongoose.connect('mongodb+srv://xoftsis:xwRk3dhJPF3Mq244@cluster0.rz7ta.mongodb.net/LMS?retryWrites=true&w=majority&appName=Cluster0')
        console.log(chalk.yellow("Connected to MongoDB"))
        
    } catch (error) {
        console.error("error connecting mongodb", error)
        console.table(error)
    }
}

export default mongoDb