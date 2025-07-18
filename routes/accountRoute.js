const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController");
const util = require("../utilities");

// Default account management route
router.get("/", util.checkLogin, accountController.buildAccountManagement);

//login page route
router.get("/login", accountController.buildLogin);

// Process the login request
router.post("/login", accountController.accountLogin);

//register page route
router.get("/register", accountController.buildRegister);

//register creat user route
router.post("/register", accountController.registerAccount);

// Route for update account information
router.get("/update/:id", util.checkLogin, accountController.buildUpdateAccount);

// POST route to process account info update
router.post("/update-account",
  util.checkLogin,
  util.validateAccountUpdate,  // validation middleware to be implemented
  accountController.postUpdateAccount
);

// POST route to process password change
router.post("/change-password",
  util.checkLogin,
  util.validatePasswordChange,  // validation middleware to be implemented
  accountController.postChangePassword
);

// Route for logout
router.get("/logout", accountController.accountLogout);

module.exports = router;
