import express, { Router } from 'express'
import {destroyAll, destroyByUserNameOrId, getUsers, saveUsers, signInUser, signOutUser, signUpUser} from '../controllers/users.js'
import authenticate from '../middleware/authenticate.js'

const router = express.Router()

// User save
// router.get('/save', saveUsers)

router.post('/sign_up', signUpUser)

router.post('/sign_in', signInUser)

router.post('/sign_out', signOutUser)

// get users
router.get('/', authenticate, getUsers)

router.get('/destroy_all', destroyAll)

router.get('/destroy/:id', destroyByUserNameOrId)

export default router