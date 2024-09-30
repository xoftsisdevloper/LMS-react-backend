import express, { Router } from 'express'
import {assignGroupsToUser, destroyAll, destroyByUserNameOrId, getUserGroups, getUsers, removeGroupsFromUser, saveUsers, signInUser, signOutUser, signUpUser, updateUser, userCourses} from '../controllers/usersController.js'
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

router.get('/:id/courses', userCourses)

router.post('/remove-groups', removeGroupsFromUser);

router.post('/assign-groups', assignGroupsToUser);

router.put('/:id', updateUser);

router.get('/:id/groups', getUserGroups);

export default router