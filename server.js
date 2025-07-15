/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const session = require("express-session")
const pool = require('./database/')
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const itemRoute = require("./routes/itemRoute")
const accountRoute = require("./routes/accountRoute")
const errorRoute = require("./routes/errorRoute")
const errorHandler = require("./utilities/errorHandler")
const managementRoute = require("./routes/managementRoute")
const addClassificationRoute = require("./routes/addClassificationRoute")
const cookieParser = require("cookie-parser")
const util = require('./utilities')


/* ***********************
 * View Engine aand Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")


/* ***********************
 * Middleware
 * ************************/
//body parsing middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }))


//session management middleware
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))


// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
//now I can simply model after the below example to add a flash message where <%- messages() %> is located in the view
//req.flash("notice", "This is a flash message.")


//make nav available to all views
app.use(async (req, res, next) => {
  try {
    const nav = await util.getNav()
    res.locals.nav = nav // This makes nav available in all views
    next()
  } catch (err) {
    next(err)
  }
})

/* ***********************
 * Routes
 *************************/
app.use(static)
// Index route
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/account", accountRoute)
app.use("/inv", inventoryRoute)
app.use("/inv", itemRoute)
app.use("/inv", managementRoute)
app.use("/inv", addClassificationRoute)

app.use(errorRoute)
app.use(cookieParser())
//Authenticate JWT tokens on all routes
app.use(util.checkJWTToken)

// Error handling middleware - must be last
app.use(errorHandler)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
