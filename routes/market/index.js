const router = require('express').Router()
const { market } = require('../../exchange')

router.get('/', async (req, res) => {
  const data = await market.history()
  res.json(data)
})

// router.post('/dump', async (req,res) => {
//   const data = req.body
//   await market.dump(data)
//   res.end('data dumped')
// })

module.exports = router
