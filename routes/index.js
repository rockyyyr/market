const router = require('express').Router()

router.get('/', console.log('watching market change...'))

router.use('/market', require('./market'))

module.exports = router

