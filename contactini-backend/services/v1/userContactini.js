const userContactini = require('../../models/userContactini');
const bcrypt   = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto= require('crypto'); 

exports.add = async (req, res, next) => {
    const temp = {};
    const url = req.protocol + '://' + req.get("host");
    ({ 
        emailConnexion: temp.emailConnexion,
        password : temp.password,
    } = req.body);

    Object.keys(temp).forEach((key) => (temp[key] == null) && delete temp[key]);

    try {
        temp.name='Welcome';
        temp.email='contact@contactini.fr';
        temp.jobTitle='To';
        temp.companyName='Contactini';
        temp.iconColor='#ffffff';
        temp.buttonColor='#3b5998';
        temp.cssImages=[{
            "backgroundHdp":"white",
            "marginHdp":"30"
        }];
        temp.imageHdp=url + "/images/defaut-logo.png";
        temp.imagePdp=url + "/images/defaut-profil.png";
        let user = await userContactini.create(temp);

        return res.status(201).json(user);
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.getById = async (req, res, next) => {
    const { id } = req.params;
    try {
        let user = await userContactini.findById(id).select('-password');
        if (user) {
            return res.status(200).json([user]);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.login = async (req, res, next) => {
    let fetchedUser;
    try {
        fetchedUser = await userContactini.findOne({ emailConnexion: req.body.emailConnexion });
        
        if (!fetchedUser) {
            return res.status(401).json({
                message: "User Auth failed"
            });
        }

        const result = await bcrypt.compare(req.body.password, fetchedUser.password);

        if (!result) {
            return res.status(401).json({
                message: "Result Auth failed"
            });
        }

        const token = jwt.sign(
            { emailConnexion: fetchedUser.emailConnexion, userId: fetchedUser._id },
            'secret_this_should_be_longer',
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id,
            userEmail: fetchedUser.emailConnexion
        });
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "catch Auth failed"
        });
    }
}


exports.update = async (req, res, next) => {
    const { id } = req.params;

    try {
        let user = await userContactini.findById(id);
        if (!user) {
            return res.status(404).json('user_not_found');
        }
        const temp = {
            name: req.body.name,
            prenom: req.body.prenom,
            jobTitle: req.body.jobTitle,
            companyName: req.body.companyName,
            mobile: req.body.mobile,
            email: req.body.email,
            backgroundColor: req.body.backgroundColor,
            buttonColor: req.body.buttonColor,
            iconColor: req.body.iconColor,
            textColor: req.body.textColor,
            blocks: req.body.blocks,
            cssImages: req.body.cssImages,
            avisUrl: req.body.avisUrl,
            avisText: req.body.avisText,
            avisChecked: req.body.avisChecked
        };

        // Copiez les propriétés non-nulles de temp dans user
        Object.assign(user, temp);

        await user.save();
        return res.status(201).json(user);
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.forgotPassword = async (req, res, next) => {

    const user = await userContactini.findOne({ emailConnexion: req.body.emailConnexion });
    if(!user){
        return next(new Error('There is no user with that email',403))
    }
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false})

    const restUrl= `https://${req.get('host')}/#/auth/password/reset/${resetToken}`;
    
    const message = `Bonjour,\n\n Vous avez demandé à réinitialiser votre mot de passe. Retrouvez les accès à votre compte Contactini en cliquant sur le lien ci-dessous.  \n\n ${restUrl} \n\n A bientôt, \n\n L'équipe Contactini \n\n\n P.S. : Si vous n'êtes pas à l'initiative de cette demande, nous vous prions de ne pas tenir compte de cet email.`
    
    try {
        // await sendEmail({
        // email: user.emailConnexion,
        // subject: 'Contactini - Renouvellement de votre mot de passe',
        // message
        // })
        res.status(200).json({ status:200, data:'Email sent : '+ restUrl });
        } catch (error) {
        console.log(error);
        user.getResetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false })
        res.status(500).json({
            status:500,
            message:'Email could not be sent.',
        });
        }
}

exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
    const user = await userContactini.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
        });
        if (!user){
            res.status(201).json({
                status:500,
                message:'Token is expired.',
            });
        }
        else {
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(201).json({
                status:201,
                message:'Password changed',
                id: user._id
            });
        }
  
}

exports.updateImagePdp = async (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
        const { id } = req.params;
        try {
            let user = await userContactini.findById(id);
            if (user) {         
                if(user['imagePdp']!=''){
                    if(user['imagePdp'].indexOf('defaut-profil.png')==-1){                
                    let imgurl = user['imagePdp'];             
                    fs.unlink(imgurl.replace(url, "./"), (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Delete File successfully.");
                    });
                    }
                }
    
                user['imagePdp']= url + "/images/" + req.file.filename;
                await user.save();
                return res.status(201).json(user);
            }
            return res.status(404).json('user_not_found');
        } catch (error) {
            return res.status(501).json(error);
        }
}

exports.updateImageHdp = async (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
        const { id } = req.params;
        try {
            let user = await userContactini.findById(id);
            if (user) {  
                if(user['imageHdp']!=''){
                    if(user['imageHdp'].indexOf('defaut-logo.png')==-1) {                
                        let imgurl = user['imageHdp'];             
                        fs.unlink(imgurl.replace(url, "./"), (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log("Delete File successfully.");
                        });
                    }
                }
                user['imageHdp']= url + "/images/" + req.file.filename;
                await user.save();
                return res.status(201).json(user);
            }
            return res.status(404).json('user_not_found');
        } catch (error) {
            return res.status(501).json(error);
        }
}

