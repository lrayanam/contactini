const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const bcrypt   = require('bcryptjs');

const contactiniUser = new Schema({
    name: {
        type    : String,
        trim    : true,
    },
    prenom: {
        type    : String,
        trim    : true,
    },
    jobTitle: {
        type    : String,
        trim    : true,
    },
    companyName: {
        type    : String,
        trim    : true,
    },
    mobile: {
        type    : String,
        trim    : true,
    },
    emailConnexion: {
        type    : String,
        required : [true, 'L’email est obligatoire'],
        unique   : true, // index unique
        trim    : true,
        lowercase: true
    },
    email: {
        type    : String,
        trim    : true,
    },
    backgroundColor: {
        type    : String,
        trim    : true,
    },
    buttonColor: {
        type: String,
        trim: true,
        lowercase: true
    },
    iconColor: {
        type     : String,
        trim     : true,
        lowercase: true
    },
    textColor: {
        type     : String,
        trim     : true,
        lowercase: true
    },
    blocks: {
        type     : Array,
        trim     : true,
        lowercase: true
    },
    cssImages: {
        type     : Array,
        trim     : true,
        lowercase: true
    },
    avisUrl: {
        type     : String,
        trim     : true,
    },
    avisText: {
        type     : String,
        trim     : true,
    },
    avisChecked: {
        type     : String,
        trim     : true,
    },
    password: {
        type: String,
        trim: true,
    },
    imagePdp: {
        type: String,
        trim: true,
    },
    imageHdp: {
        type: String,
        trim: true,
    },
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    }
}, {
    timestamps: true // ajoute 2 champs au document createdAt et updatedAt
});

// hook executé avant la sauvegarde d'un document. Hash le mot de passe quand il est modifié
contactiniUser.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = bcrypt.hashSync(this.password, 10);

    next();
});

module.exports = mongoose.model('contactiniUser', contactiniUser);