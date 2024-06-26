var express = require('express');
var router = express.Router();
const contactiniRoute = require('./userContactini');

router.get('/', async (req, res) => {
    res.status(200).json({
        name   : 'API', 
        version: '1.0', 
        status : 200, 
        message: 'Bienvenue sur l\'API Contactini !'
    });
});

router.use('/contactinis', contactiniRoute);
module.exports = router;