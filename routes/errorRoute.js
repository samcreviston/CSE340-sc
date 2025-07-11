const express = require('express')
const router = express.Router()
const errorController = require('../controllers/errorController')

router.get('/error', errorController.triggerError)

module.exports = router
