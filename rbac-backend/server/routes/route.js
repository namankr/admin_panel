// server/routes/route.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.post('/new/mentor', userController.allowIfLoggedin, userController.grantAccess('createAny', 'profile'), userController.createMentor);

router.put('/edit/mentor/:mentorId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateMentor);

router.delete('/mentor/:mentorId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteMentor);

router.get('/mentor', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getMentors);

module.exports = router;