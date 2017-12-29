const market = require('./market')
const time = require('../util/time')

function run (minutes) {
  let count = 0
  setInterval(async () => {
    const prices = await market.prices()
    await market.record(prices)
    console.log(`${(++count).toString().padStart(8)} | recorded price data`)

  }, time.minutes(minutes))
}

run(5)
