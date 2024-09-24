import mongoose from "mongoose"
import chalk from 'chalk'

const mongoDb = async() => {
    try {
        // await mongoose.connect(`mongodb+srv://${process.env.MANGO_DB_USER}:${process.env.MANGO_DB_PASSWORD}@cluster0.uku31b0.mongodb.net/${process.env.MANGO_DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
        await mongoose.connect(process.env.MANGO_DB_URI)
        console.log(chalk.yellow("Connected to MongoDB"))
        
    } catch (error) {
        console.error("error connecting mongodb", error)
        console.table(error)
    }
}

export default mongoDb