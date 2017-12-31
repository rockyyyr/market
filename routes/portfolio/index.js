const { portfolio } = require('../../tools')
const router = require('express').Router()

router.get('/', (req, res) => {
  const currentPortfolio = portfolio.getPortfolio()
  res.json(JSON.stringify(currentPortfolio, null, 2))
})

router.get('/history', (req, res) => {
  const history = portfolio.getHistory()
  res.json(JSON.stringify(history, null, 2))
})

router.get('/blacklist', (req, res) => {
  const blacklist = portfolio.getBlacklist()
  res.json(blacklist)
})

router.get('/account', (req, res) => {
  const account = portfolio.getAccount()
  res.json(JSON.stringify(account, null, 2))
})

module.exports = router
