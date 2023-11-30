var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var userSchema = new Schema({
    fullname: {
        type: String,
        required: [true,'Fullname not provided']
    },
    email: {
        type: String,
        required: [true,'Email not provided'],
        lowercase: true,
        trim: true,
        unique: [true, 'Email already exists in the database'],
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Email is not valid!'
        }
    },
    password:{
        type:String,
        required:[true,"Password can't be blank"],
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User',userSchema);