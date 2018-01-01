const router = require('express').Router()

router.get('/', (req, res) => res.end(`watching market change`))

router.use('/chart', require('./charts'))
router.use('/market', require('./market'))
router.use('/portfolio', require('./portfolio'))

module.exports = router
