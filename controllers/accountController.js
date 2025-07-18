const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver register view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
    })
  }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  } catch (error) {
    console.error("Error during registration:", error)
    req.flash("notice", "Sorry, the registration failed due to an error.")
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  console.log("Login attempt with body:", req.body)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log("Account data retrieved:", accountData)
  if (!accountData) {
    req.flash("notice", "No account found with that email address.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Incorrect password. Please try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


async function buildAccountManagement(req, res, next) {
  let nav = await require("../utilities/").getNav()
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
    messages: req.flash(),
    accountData: res.locals.accountData
  })
}

/* ****************************************
 *  Deliver update account information view
 * *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await require("../utilities/").getNav()
  const accountId = req.params.id
  try {
    const account = await require("../models/account-model").getAccountById(accountId)
    if (!account) {
      req.flash("notice", "Account not found.")
      return res.redirect("/account/")
    }
    res.render("account/updateAccount", {
      title: "Update Account Information",
      nav,
      account,
      errors: null,
      messages: req.flash()
    })
  } catch (error) {
    next(error)
  }
}

// POST handler for account info update
async function postUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  // Validate input
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // Return errors and sticky form data
    try {
      const account = await accountModel.getAccountById(account_id)
      return res.status(400).render("account/updateAccount", {
        title: "Update Account Information",
        nav,
        account,
        errors: errors.array(),
        messages: req.flash(),
        account_firstname,
        account_lastname,
        account_email,
      })
    } catch (error) {
      return next(error)
    }
  }

  try {
    // Check if email is changed and already exists
    const existingAccount = await accountModel.getAccountByEmail(account_email)
    if (existingAccount && existingAccount.account_id != account_id) {
      req.flash("error", "Email address is already in use.")
      const account = await accountModel.getAccountById(account_id)
      return res.status(400).render("account/updateAccount", {
        title: "Update Account Information",
        nav,
        account,
        errors: [{ msg: "Email address is already in use." }],
        messages: req.flash(),
        account_firstname,
        account_lastname,
        account_email,
      })
    }

    // Update account info
    const updateResult = await accountModel.updateAccountInfo(account_id, account_firstname, account_lastname, account_email)
    if (updateResult.rowCount === 1) {
      req.flash("success", "Account information updated successfully.")
    } else {
      req.flash("error", "Failed to update account information.")
    }

    // Get updated account data
    const updatedAccount = await accountModel.getAccountById(account_id)
    res.render("account/account", {
      title: "Account Management",
      nav,
      accountData: updatedAccount,
      errors: null,
      messages: req.flash(),
    })
  } catch (error) {
    next(error)
  }
}

// POST handler for password change
async function postChangePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, new_password } = req.body

  // Validate input
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    try {
      const account = await accountModel.getAccountById(account_id)
      return res.status(400).render("account/updateAccount", {
        title: "Update Account Information",
        nav,
        account,
        errors: errors.array(),
        messages: req.flash(),
      })
    } catch (error) {
      return next(error)
    }
  }

  try {
    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10)
    // Update password in DB
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)
    if (updateResult.rowCount === 1) {
      req.flash("success", "Password updated successfully.")
    } else {
      req.flash("error", "Failed to update password.")
    }

    // Get updated account data
    const updatedAccount = await accountModel.getAccountById(account_id)
    res.render("account/account", {
      title: "Account Management",
      nav,
      accountData: updatedAccount,
      errors: null,
      messages: req.flash(),
    })
  } catch (error) {
    next(error)
  }
}


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver register view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
    })
  }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  } catch (error) {
    console.error("Error during registration:", error)
    req.flash("notice", "Sorry, the registration failed due to an error.")
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  console.log("Login attempt with body:", req.body)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log("Account data retrieved:", accountData)
  if (!accountData) {
    req.flash("notice", "No account found with that email address.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Incorrect password. Please try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


async function buildAccountManagement(req, res, next) {
  let nav = await require("../utilities/").getNav()
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
    messages: req.flash(),
    accountData: res.locals.accountData
  })
}

/* ****************************************
 *  Deliver update account information view
 * *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await require("../utilities/").getNav()
  const accountId = req.params.id
  try {
    const account = await require("../models/account-model").getAccountById(accountId)
    if (!account) {
      req.flash("notice", "Account not found.")
      return res.redirect("/account/")
    }
    res.render("account/updateAccount", {
      title: "Update Account Information",
      nav,
      account,
      errors: null,
      messages: req.flash()
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Process logout request
 * *************************************** */
async function accountLogout(req, res, next) {
  res.clearCookie("jwt")
  res.redirect("/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildUpdateAccount, accountLogout, postUpdateAccount, postChangePassword }