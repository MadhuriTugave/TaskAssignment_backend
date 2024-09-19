const express = require ("express");
const controller = require("../Controllers/userController");


const UserRouter = express.Router();

UserRouter.post("/Login", controller.login);

module.exports = UserRouter;