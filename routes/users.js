const router = require("express").Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {User, validateUser} = require("../models/users");

router.post("/", async (req,res) => {
    const validate = validateUser(req.body);
    if (validate) return res.status(400).send(validate);

    let user = await User.findOne().or([{email: req.body.email}, {username: req.body.username}]);
    if (user) return res.status(400).send("User with given username/email already exists!");
    
    const salt = await bcrypt.genSalt(10);//magic number TODO 
    const hashedPwd = await bcrypt.hash(req.body.password, salt);

    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPwd,
        permissions: User.generatePermissionTree()
    })

    await user.save();

    res.header("x-auth-token", user.generateAuthToken()).header("access-control-expose-headers", "x-auth-token").send(_.pick(user, ["username", "password", "email", "rank", "posts", "permissions"])) //todo refactor
});

module.exports = router;
