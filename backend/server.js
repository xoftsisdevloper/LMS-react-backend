import express from 'express'
import 'dotenv/config'
import mangoDb from './db/mangoos.js'
import chalk from 'chalk'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/userRoutes.js'
import MaterialRoutes from './routes/materialsRoutes.js'
import GroupRoutes from './routes/groupsRoutes.js'
import CoursesRoutes from  './routes/coursesRoutes.js'
import SubjectRoutes from './routes/subjectsRoutes.js'
import CreateFullCourse from './routes/createFullCourse.js'
import UpdateFullCourse from './routes/updateFullCourse.js'
import TestRoutes from'./routes/testRoutes.js'
import ResultRoutes from './routes/testSubmissionRoutes.js'
import LeaderboardRoutes from './routes/leaderBoardRoutes.js'
import TestSubmission from './routes/testSubmissionRoutes.js'
import authenticate from './middleware/authenticate.js'
import InstitutionRoutes from './routes/institutionRoutes.js'

import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cookieParser())
const cors = require('cors');
app.use(cors({
  origin: '*', // Or use specific domain like 'https://yourapp.com'
  credentials: true
}));

const PORT = process.env.PORT || 5000

// app.use('/users', UserRoutes)
// app.use('/materials', authenticate, MaterialRoutes)
// app.use('/groups', authenticate, GroupRoutes)
app.use('/api/users', authRoutes)
app.use('/api/groups', GroupRoutes)
app.use('/api/courses', CoursesRoutes, UpdateFullCourse, CreateFullCourse)
app.use('/api/subjects', SubjectRoutes)
app.use('/api/materials', MaterialRoutes)
app.use('/api/tests', TestRoutes)
app.use('/api/result', ResultRoutes)
app.use('/api/testSubmission', TestSubmission)
app.use('/api/leaderboard/', LeaderboardRoutes)
app.use('/api/institution/', InstitutionRoutes)

app.get('*', (req, res) => {
  res.status(404).json({error: 'The url is incorrect'})
})

// Log all routes
// app._router.stack.forEach((middleware) => {
//   if (middleware.route) {
//       // If the middleware is a route
//       console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
//   } else if (middleware.name === 'router') {
//       // If the middleware is a router
//       middleware.handle.stack.forEach((handler) => {
//           const route = handler.route;
//           if (route) {
//               console.log(`${Object.keys(route.methods).join(', ').toUpperCase()} ${route.path}`);
//           }
//       });
//   }
// });


app.listen(PORT,() => {
  console.log(chalk.magenta(`http://localhost:${PORT}`))
  mangoDb()
})