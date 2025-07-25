const jwt = require("jsonwebtoken")
require("dotenv").config()

const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildItemDetails = async function(data){
  let details = ''
  if(data){
    details += '<section id="item-details">'
    details += '<h2>' + data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model + '</h2>'
    details += '<img src="' + data.inv_thumbnail + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + '" />'
    details += '<p><strong>Description:</strong> ' + data.inv_description + '</p>'
    details += '<p><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
    details += '<p><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>'
    details += '<p><strong>Color:</strong> ' + data.inv_color + '</p>'
    details += '</section>'
  } else {
    details = '<p class="notice">Sorry, no vehicle details could be found.</p>'
  }
  return details
}

/* **************************************
* Build the classification select list HTML
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}


/* ****************************************
* Middleware to Check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Middleware to Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 *  Middleware to Check Employee or Admin
 * ************************************ */
 Util.checkAdminEmployee = (req, res, next) => {
  if (res.locals.loggedin) {
    const accountType = res.locals.accountData.account_type
    if (accountType === "Employee" || accountType === "Admin") {
      next()
    } else {
      req.flash("notice", "You do not have permission to access this page.")
      return res.redirect("/account/login")
    }
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


const { body } = require("express-validator")
const accountModel = require("../models/account-model")

/* ****************************************
 * Validation middleware for account update
 * **************************************** */
Util.validateAccountUpdate = [
  body("account_firstname")
    .trim()
    .notEmpty()
    .withMessage("First name is required."),
  body("account_lastname")
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),
  body("account_email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address."),
]

/* ****************************************
 * Validation middleware for password change
 * **************************************** */
Util.validatePasswordChange = [
  body("new_password")
    .trim()
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number."),
]

module.exports = Util
