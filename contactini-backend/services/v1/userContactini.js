const userContactini = require('../../models/userContactini');

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