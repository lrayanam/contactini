const express = require('express');
const router = express.Router();

const service = require('../../services/v1/userContactini');

router.post('/addUserContactini', service.add);
router.get('/:id', service.getById);
router.post('/login', service.login);
router.post('/update/:id', service.update);


module.exports = router;