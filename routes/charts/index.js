const router = require('express').Router()
const mapper = require('../../charts/mapper')

router.get('/', (req, res) => {
  res.sendFile(__dirname + '../../charts/candlesticks.html')
})

router.get('/data', async (req, res) => {
  res.json(await mapper.map())
})

module.exports = router
