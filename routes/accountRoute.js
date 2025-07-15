const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")

// Default account management route
router.get("/", accountController.buildAccountManagement);

//login page route
router.get("/login", accountController.buildLogin);

// Process the login request
router.post(
  "/login", accountController.accountLogin);

//register page route
router.get("/register", accountController.buildRegister);

//register creat user route
router.post("/register", accountController.registerAccount);

module.exports = router;
