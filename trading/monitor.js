const portfolio = require('./portfolio')
const { market } = require('../exchange')
const { time } = require('../util')

let running = false

function investments () {
  running = true

  const interval = setInterval(async () => {
    const prices = await market.prices()
    const investments = portfolio.getPortfolio()

    await check(investments, prices)

    if(investments.length === 0) {
      finished(interval)
    }

  }, time.seconds(30))
}

function check (investments, prices) {
  return new Promise(resolve => {
    let index = 0
    investments.forEach(investment => {
      const currency = get(investment.symbol, prices)

      if(currency.price <= investment.abort) {
        portfolio.sell(investment, currency.price)
      }

      if(currency.price >= investment.target){
        portfolio.hold(investment)
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
