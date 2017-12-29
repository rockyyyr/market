const router = require('express').Router()

router.get('/', (req, res) => res.end(`watching market change`))

router.use('/market', require('./market'))

module.exports = router

