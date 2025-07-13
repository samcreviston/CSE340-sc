const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")

//login page route
router.get("/login", accountController.buildLogin);

//register page route
router.get("/register", accountController.buildRegister);

module.exports = router;