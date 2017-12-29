const { market, transaction } = require('../exchange')
const { time } = require('../util')

let running = false

function portfolio () {
  const interval = setInterval(async () => {
    console.log(`monitoring portfolio`)
    const prices = await market.prices()

    await check(transaction.portfolio, prices)

    if(transaction.portfolio.length === 0) {
      finished(interval)
    }

  }, time.seconds(20))
}

function check (portfolio, prices) {
  return new Promise(resolve => {
    let index = 0
    portfolio.forEach(investment => {
      const currency = get(investment.symbol, prices)

      if(currency.price > investment.target || currency.price < investment.abort) {
        const { pool, portfolio } = transaction.sell(investment)
        console.log(`pool: ${pool}`)
        console.log(`portfolio: ${JSON.stringify(portfolio, null, 2)}`)
      }

      if(++index === portfolio.length) {
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

module.exports = {
  running,
  portfolio
}