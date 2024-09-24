import express from 'express'
import 'dotenv/config'
import mangoDb from './db/mangoos.js'
import chalk from 'chalk'
import cookieParser from 'cookie-parser'

import UserRoutes from './routes/userRoutes.js'
import materialRoutes from './routes/materialRoutes.js'

const app = express()
app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 5000

app.use('/users', UserRoutes)
app.use('/materials', materialRoutes)

app.get('*', (req, res) => {
  res.status(404).json({error: 'The url is incorrect'})
})


app.listen(PORT,() => {
  console.log(chalk.magenta(`http://localhost:${PORT}`))
  mangoDb()
})