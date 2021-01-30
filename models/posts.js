const mongoose = require("mongoose");
const {responseSchema} = require("./responses");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
    creatorID: {type: mongoose.Types.ObjectId, required: true},
    title: {type: String, required: true, minlength: 5, maxlength: 15},
    viewed: {type: Number, required: true, default: 0},
    closed: {type: Boolean, required: true, default: false},
    date: {type: Date, default: Date.now, required: true},
    responses: [responseSchema]
});

postSchema.methods.getStartResponse = function () {
    return this.responses[0];
}
const Post = mongoose.model("posts", postSchema);

const validate = (data) => {
    const joiSchema = Joi.object({
        title: Joi.string().min(5).max(15).required(),
        startResponse: Joi.string().min(30).required(),
    })
    
    try {
        joiSchema.validate(data);
        return null;
    } catch (error) {
        return error._message
    }
}
exports.postSchema = postSchema;
exports.Post = Post;
exports.validatePost = validate;