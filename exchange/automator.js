const market = require('./market')
const time = require('../util/time')

function run (minutes) {
  let count = 0
  setInterval(async () => {
    const prices = await market.prices()
    await market.record(prices)
    console.log(`recorded price data | ${count}`)

  }, time.minutes(minutes))
}

run(5)
