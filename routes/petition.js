const express = require('express');
const petitionController = require('../controllers/petition.controller');
const router = express.Router();

router.post('/registroInvitados', petitionController.createGuest);
router.post('/register', petitionController.createUser);
router.post('/signIn', petitionController.signIn);
router.post('/resetToken', petitionController.resetToken);
router.post('/resetPassword', petitionController.resetPassword);
router.post('/getdate', petitionController.getDate);
router.post('/setAssistance', petitionController.setAssitance);
router.post('/findGuestAssistance', petitionController.findGuestAssistance);
router.post('/send-reminder', petitionController.sendReminder);

module.exports = router;