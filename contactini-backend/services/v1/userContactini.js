const userContactini = require('../../models/userContactini');
const bcrypt   = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        let user = await userContactini.findById(id);
        if (user) {
            user['password'] = "";
            return res.status(200).json([user]);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.login = async (req, res, next) => {
    let fetchedUser;
    userContactini.findOne({ emailConnexion:req.body.emailConnexion })
        .then(user=>{
            if(!user){
                return res.status(401).json({
                    message:"User Auth failed"
                });
            }
            fetchedUser=user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result=>{
            if(!result){
                return res.status(401).json({
                    message:"Result Auth failed"
                });
            }

            const token = jwt.sign(
                {emailConnexion: fetchedUser.emailConnexion, userId: fetchedUser._id}, 
                'secret_this_should_be_longer', 
                {expiresIn: "1h" }
                );
           return res.status(200).json({
                token:token,
                expiresIn:3600,
                userId: fetchedUser._id,
                userEmail:fetchedUser.emailConnexion
            });

        }).catch (err => {
            console.log(err);
            return res.status(401).json({
                message:"catch Auth failed"
            });
         })
}