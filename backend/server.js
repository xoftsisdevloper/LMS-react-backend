import express from 'express'
import 'dotenv/config'
import mangoDb from './db/mangoos.js'
import chalk from 'chalk'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRoutes from './routes/userRoutes.js'
import MaterialRoutes from './routes/materialsRoutes.js'
import GroupRoutes from './routes/groupsRoutes.js'
import CoursesRoutes from './routes/coursesRoutes.js'
import SubjectRoutes from './routes/subjectsRoutes.js'
import CreateFullCourse from './routes/createFullCourse.js'
import UpdateFullCourse from './routes/updateFullCourse.js'
import TestRoutes from './routes/testRoutes.js'
import ResultRoutes from './routes/testSubmissionRoutes.js'
import LeaderboardRoutes from './routes/leaderBoardRoutes.js'
import TestSubmission from './routes/testSubmissionRoutes.js'
import authenticate from './middleware/authenticate.js'
import InstitutionRoutes from './routes/institutionRoutes.js'

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors())

// Port
const PORT = process.env.PORT || 2000

// Routes
app.use('/api/users', authRoutes)
app.use('/api/groups', GroupRoutes)
app.use('/api/courses', CoursesRoutes, UpdateFullCourse, CreateFullCourse)
app.use('/api/subjects', SubjectRoutes)
app.use('/api/materials', MaterialRoutes)
app.use('/api/tests', TestRoutes)
app.use('/api/result', ResultRoutes)
app.use('/api/testSubmission', TestSubmission)
app.use('/api/leaderboard', LeaderboardRoutes)
app.use('/api/institution', InstitutionRoutes)

// 404 Handler
app.get('*', (req, res) => {
  res.status(404).json({ error: 'The URL is incorrect' })
})

// Start the server *after* DB is connected
mangoDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(chalk.magenta(`Server is running at http://localhost:${PORT}`))
  })
}).catch(err => {
  console.error(chalk.red('❌ Failed to connect to MongoDB:', err.message))
})
