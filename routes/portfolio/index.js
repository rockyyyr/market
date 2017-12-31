const { portfolio } = require('../../tools')
const router = require('express').Router()

router.get('/', (req, res) => {
  const currentPortfolio = portfolio.getPortfolio()
  res.json(currentPortfolio)
})

router.get('/history', (req, res) => {
  const history = portfolio.getHistory()
  res.json(history)
})

router.get('/blacklist', (req, res) => {
  const blacklist = portfolio.getBlacklist()
  res.json(blacklist)
})

router.get('/account', (req, res) => {
  const account = portfolio.getAccount()
  res.json(account)
})

module.exports = router
