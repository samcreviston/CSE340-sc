function triggerError(req, res, next) {
  const err = new Error('Intentional 500 error triggered')
  err.status = 500
  next(err)
}

module.exports = {
  triggerError,
}
