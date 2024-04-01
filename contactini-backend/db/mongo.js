const mongoose = require('mongoose');
require('dotenv').config();


exports.initClientDbConnection = async () => {
    try {
        // let url = 'mongodb://'+process.env.USERDB+':'+process.env.PWDDB+'@localhost:27017/'+process.env.DBNAME
        // await mongoose.connect(url);        
       await mongoose.connect('mongodb://localhost:27017/'+process.env.DBNAME)
        console.log('Connected');

    } catch (error) {
        console.log(error);
        throw error;
    }
}

