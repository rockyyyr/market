const market = require('./market')
const time = require('../util/time')

function run (minutes) {
  let count = 0
  setInterval(async () => {
    console.log('fetching price data')
    const prices = await market.prices()
    await market.record(prices)
    console.log(`${(++count).toString().padStart(8)} | recorded price data`)

  }, 5000)
}

run(5)
