const itemModel = require('../models/item-model')
const util = require('../utilities')

/**
 * Controller to build item detail page
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function buildItemDetail(req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)
    if (isNaN(inv_id)) {
      res.status(400).send('Invalid inventory ID')
      return
    }
    const data = await itemModel.getItemById(inv_id)
    if (!data) {
      res.status(404).send('Vehicle not found')
      return
    }
    const itemDetailsHTML = await util.buildItemDetails(data)
    const nav = await util.getNav()
    res.render('item/item', {
      title: `${data.inv_make} ${data.inv_model} Details`,
      itemDetails: itemDetailsHTML,
      nav,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildItemDetail,
}
