const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const addClassificationModel = require("../models/add-classification-model")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory list view
 * ************************** */
invCont.buildInventoryList = async function (req, res, next) {
  try {
    const data = await invModel.getAllInventory()
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    res.render("./inventory/inventory", {
      title: "Inventory List",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const classification_name = req.body.classification_name
    const result = await addClassificationModel.addClassification(classification_name)
    if (result) {
      // Flash messages
      res.redirect("/inv")
    } else {
      // Flash messages
      res.redirect("/inv/add-classification")
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const classificationList = await utilities.buildClassificationList()
    let nav = await utilities.getNav()
    res.render("inventory/addInventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      inv_make: "",
      inv_model: "",
      inv_description: "",
      inv_image: "",
      inv_thumbnail: "",
      inv_price: "",
      inv_year: "",
      inv_miles: "",
      inv_color: "",
      classification_id: "",
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Add inventory item to database
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body

    // Validate required fields
    const errors = []
    if (!inv_make) errors.push("Make is required")
    if (!inv_model) errors.push("Model is required")
    if (!inv_description) errors.push("Description is required")
    if (!inv_image) errors.push("Image URL is required")
    if (!inv_thumbnail) errors.push("Thumbnail URL is required")
    if (!inv_price || isNaN(inv_price)) errors.push("Valid price is required")
    if (!inv_year || isNaN(inv_year)) errors.push("Valid year is required")
    if (!inv_miles || isNaN(inv_miles)) errors.push("Valid miles is required")
    if (!inv_color) errors.push("Color is required")
    if (!classification_id) errors.push("Classification is required")

    if (errors.length > 0) {
      const classificationList = await utilities.buildClassificationList(classification_id)
      let nav = await utilities.getNav()
      res.render("inventory/addInventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
      })
      return
    }

    const result = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    if (result) {
      // Redirect to management view with success message
      res.redirect("/inv/management?message=Inventory item added successfully")
    } else {
      const classificationList = await utilities.buildClassificationList(classification_id)
      let nav = await utilities.getNav()
      res.render("inventory/addInventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: ["Failed to add inventory item"],
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const message = req.query.message || null
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
