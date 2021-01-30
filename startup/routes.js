const express = require("express");
const users = require("../routes/users");
const auth = require("../routes/auth");
const responses = require("../routes/responses");
const posts = require("../routes/posts");
const sections = require("../routes/sections");
const errors = require("../middleware/errors");

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    app.use("/api/responses", responses);
    app.use("/api/posts", posts);
    app.use("/api/sections", sections);
    app.use(errors);
}