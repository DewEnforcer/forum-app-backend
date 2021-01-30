const mongoose = require("mongoose");
const Joi = require("joi");

const responseSchema = new mongoose.Schema({
    creatorID: {type: mongoose.Types.ObjectId, required: true},
    body: {type: String, required: true, minlength: 30},
    date: {type: Date, default: Date.now, required: true},
    likes: [mongoose.Types.ObjectId]
})

const Response = mongoose.model("responses", responseSchema);

const validate = (data) => {
    const joiSchema = Joi.object({
        body: Joi.string().min(30).required(),
    })
    
    try {
        joiSchema.validate(data);
        return null;
    } catch (error) {
        return error._message
    }
}

exports.responseSchema = responseSchema;
exports.Response = Response;
exports.validateResponse = validate;