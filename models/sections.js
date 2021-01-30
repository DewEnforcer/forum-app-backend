const mongoose = require("mongoose");
const Joi = require("joi");

const sectionSchema = new mongoose.Schema({
    title: {type: String, required: true},
    iconName: {type: String, required: true, default: "defaultSectionIcon.png"},
    posts: [mongoose.Types.ObjectId]
});

sectionSchema.methods.getNewestPost = function () {
    return this.posts[0];
} 

const Section = mongoose.model("sections", sectionSchema);

const validateSection = data => {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        iconName: Joi.string(),
    })

    try {
        schema.validate(data);
        return null;
    } catch (error) {
        return error._message
    }
}

exports.Section = Section;
exports.sectionSchema = sectionSchema;
exports.validateSection = validateSection;