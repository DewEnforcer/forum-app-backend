const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {Section, validateSection} = require("../models/sections");
const {Post} = require("../models/posts");
const {User} = require("../models/users");
const objectIdValidator = require("../middleware/verifyObjectId");

router.get("/", async (req, res) => {
    const sections = await Section.find();
    res.send(sections);
});

router.get("/:id", async (req, res) => {
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).send("No section with given ID exists");

    section.posts = await Post.find({_id: {$in: section.posts}});

    res.send(section);
})

router.get("/last/:id", objectIdValidator, async (req, res) => { //remove later on deprecated
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).send("No section with given ID exists");

    const post = await Post.findById(section.getNewestPost());
    if (!post) return res.status(500).send("Something went wrong, please try again later");

    let user = await User.findById(post.creatorID).select("username");
    if (!user) user = {username: "Removed user"};

    const previewPost = {_id: post._id, title: post.title, date: post.date, user};

    res.send(previewPost);    
});

router.post("/", [auth, admin], async (req, res) => {
    const validate = validateSection(req.body);
    if (validate) return res.status(400).send(validate);

    let section = await Section.findOne({title: req.body.title});
    if (section) return res.status(400).send("Section with given title already exists");

    section = new Section({
        title: req.body.title,
        iconName: req.body.iconName,
        posts: []
    });


    await section.save();

    res.send(section);
});


router.patch("/:id", [auth, admin, objectIdValidator], async (req, res) => {
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).send("No section with given ID has been found");

    if (req.body.title) section.title = req.body.title;
    if (req.body.iconName) section.iconName = req.body.iconName;
    
    await section.save();

    res.send(section);
});

router.delete("/:id", [auth, admin], async (req, res) => {
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).send("No section with given ID has been found");

    //TODO add transaction
    await Post.deleteMany({_id: {$in: section.posts}});
    await section.remove();

    res.send(section);
});

module.exports = router;