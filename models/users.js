const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, minlength: 3},
    password: {type: String, required: true, minlength: 4, maxlength: 1024},
    email: {type: String, required: true},
    regDate: {type: Date, required: true, default: Date.now},
    rank: {type: Number, required: true, default: 0},
    //posts: [mongoose.Types.ObjectId],
    permissions: {type: Object, required: true},
    isAdmin: {type: Boolean, required: true, default: false}
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({
        userID: this._id,
        username: this.username,
        rank: this.rank,
        permissions: this.permissions,
        isAdmin: this.isAdmin
    }, config.get("jwtPrivateKey"));
};
userSchema.statics.generatePermissionTree = function () {
    return {
        responses: true,
        posts: true,
        editPost: true,
        editResponse: true
    }
}

const validate = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(5).required(),
        email: Joi.string().email().min(6).required()
    })

    try {
        schema.validate(data);
        return null;
    } catch (error) {
        return error._message;
    }
}

const User = mongoose.model("users", userSchema);

exports.userSchema = userSchema;
exports.User = User;
exports.validateUser = validate;