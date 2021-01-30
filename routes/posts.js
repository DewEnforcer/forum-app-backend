const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const _ = require("lodash");
const {Response, validateResponse} = require("../models/responses");
const {Post, validatePost} = require("../models/posts");
const { Section } = require("../models/sections");
const {User} = require("../models/users");
const objectIdValidator = require("../middleware/verifyObjectId");

router.get("/:id", objectIdValidator, async (req, res) => {
    const postID = req.params.id;

    const post = await Post.findById(postID);
    if (!post) return res.status(404).send("No post with given ID exists");

    const userSelectQuery = {username: 1, rank: 1};

    const responses = [];
    post.responses.forEach(async (r, i) => {
        const creator = await User.findById(r.creatorID).select(userSelectQuery);
        const resObj = {..._.pick(r, ["body", "date", "_id"]), creator};
        responses.push(resObj);
    });

    let user = await User.findById(post.creatorID).select(userSelectQuery);
    if (!user) user = {username: "Removed user", rank: 0};

    const returnPost = {
        title: post.title,
        closed: post.closed,
        date: post.date,
        responses: responses,
        creator: user,
        _id: post._id
    }

    res.send(returnPost);
});

router.get("/prev/:id", objectIdValidator, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("No post with given ID exists");

    let user = await User.findById(post.creatorID).select("username");
    if (!user) user = {username: "Removed user"};

    const previewPost = {_id: post._id, title: post.title, date: post.date, user};

    res.send(previewPost);    
});

router.post("/", auth, async (req, res) => {
    if (!req.user.permissions.posts) return res.status(403).send("You don't have permissions to create new threads!");
    
    const validate = validatePost(req.body);
    if (validate) return res.status(400).send(validate);

    const section = await Section.findById(req.body.sectionID);
    if (!section) return res.status(404).send("No section with given ID has been found");

    const post = new Post({
        creatorID: req.user.userID,
        title: req.body.title,
        responses: []
    });

    const startResponse = new Response({
        creatorID: req.user.userID,
        body: req.body.startResponse
    });

    post.responses.push(startResponse);

    section.posts.push(post._id);
    

    //TODO add transaction
    await post.save();
    await section.save();
    
    res.send(post);
});

module.exports = router;