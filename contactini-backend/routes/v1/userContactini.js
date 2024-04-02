const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/check-auth');
const service = require('../../services/v1/userContactini');

router.post('/addUserContactini', checkAuth, service.add);
router.get('/:id', service.getById);
router.post('/login', service.login);
router.post('/update/:id', checkAuth, service.update);
router.post('/forgotPassword', service.forgotPassword);
router.post('/resetPassword/:resetToken', service.resetPassword);

module.exports = router;