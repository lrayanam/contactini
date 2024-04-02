const express = require('express');
const router = express.Router();

const service = require('../../services/v1/userContactini');

router.post('/addUserContactini', service.add);


module.exports = router;