const router = require("express").Router();
const auth = require("../middleware/auth");
const objectIdValidator = require("../middleware/verifyObjectId");
const {Post, validateResponse} = require("../models/posts");

router.get("/:idPost/:idRes", auth, async (req, res) => {
    const post = await Post.findById(req.params.idPost);
    if (!post) return res.status(404).send("No post with given ID has been found!");

    const response = post.find(r => r._id === req.params.idRes);
    if (!response) return res.status(404).send("No response with given ID has been found!");

    res.send(response);
});

router.post("/", auth, async (req, res) => {
    const validate = validateResponse(req.body);
    if (validate) return res.status(400).send(validate);
    
    if (!req.user.permissions.responses) return res.status(403).send("You don't have permissions to submit/edit a response!");

    const post = await Post.findById(req.body.postID);
    if (!post) return res.status(404).send("No thread with given ID has been found");

    post.responses.push({
        body: req.body.body,
        creatorID: req.user.userID        
    })

    await post.save();

    res.send(response);
});

router.patch("/:idPost/:idRes", [auth, objectIdValidator], async (req, res) => { //add auth middleware
    if (!req.user.permissions.responses) return res.status(403).send("You don't have permissions to submit/edit a response!");

    const post = await Post.findById(req.params.idPost);
    if (!post) return res.status(404).send("No post with given ID has been found!");

    if (post.closed) return res.status(403).send("This thread has already been closed");


    const response = post.responses.find((r) => r._id.toString() === req.params.idRes); //to string to match datatype
    if (!response) return res.status(404).send("No response with given ID has been found!");

    if (response.creatorID.toString() !== req.user.userID) return res.status(403).send("This response was not made by you!");

    response.body = req.body.body;

    await post.save();
    
    res.send(response);
});

module.exports = router;