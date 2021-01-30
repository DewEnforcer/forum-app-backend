const mongoose = require("mongoose");

module.exports = function (req, res, next) {
    let invalidId = Object.keys(req.params).some((k) => {
        if (!k.includes("id")) return false;

        return !mongoose.Types.ObjectId.isValid(req.params[k]);
    })

    if (invalidId) return res.status(404).send("Invalid ID");

    next();
}