const router = require("express").Router();
const bcrypt = require("bcrypt");
const {User} = require("../models/users");

router.post("/", async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if (!user) return res.status(404).send("No user with given username/password has been found!");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(404).send("No user with given username/password has been found!");

    res.send(user.generateAuthToken())
});

module.exports = router;