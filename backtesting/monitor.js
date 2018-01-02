const { portfolio } = require('../trading')
const { market } = require('../exchange')
const { time } = require('../util')

let running = false

async function investments (time) {
    const investments = portfolio.getPortfolio()

    await check(investments, time)

    if(investments.length === 0) {
      finished(interval)
    }
}

function check (investments, time) {
  return new Promise(resolve => {
    let index = 0
    investments.forEach(async investment => {
      const currency = await market.atTime(time, investment.symbol)

      if(currency.price >= investment.target || currency.price <= investment.abort) {
        portfolio.sell(investment, currency.price)
      }

      if(++index === investments.length) {
        resolve()
      }
    })
  })
}

function get (symbol, prices) {
  return prices.filter(item => item.symbol === symbol)[0]
}

function finished (interval) {
  console.log('shutting down monitor')
  running = false
  clearInterval(interval)
}

function isRunning () {
  return running
}

module.exports = { isRunning, investments }
