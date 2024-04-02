const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/check-auth');
const service = require('../../services/v1/userContactini');
const multer = require('multer');
const path = require('path');

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid= MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid){
          error=null
        }
        cb(null, path.join(__dirname, '../../images'));
    },
    filename:  (req, file, cb) => {
        const name= file.originalname.toLocaleLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-'+ name);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter,  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldSize: 10 * 1024 * 1024,
  }});


router.post('/addUserContactini', checkAuth, service.add);
router.get('/:id', service.getById);
router.post('/login', service.login);
router.post('/update/:id', checkAuth, service.update);
router.post('/forgotPassword', service.forgotPassword);
router.post('/resetPassword/:resetToken', service.resetPassword);

// Update images
router.post('/imagePdp/:id', checkAuth, upload.single('imagePdp'), service.updateImagePdp);
router.post('/imageHdp/:id', checkAuth, upload.single('imageHdp'), service.updateImageHdp);

module.exports = router;