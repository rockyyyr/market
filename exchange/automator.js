const schedule = require('node-schedule')
const market = require('./market')

const RUN_MINUTES = '0,5,10,15,20,25,30,35,40,45,50,55'

let count = 0

schedule.scheduleJob(`${RUN_MINUTES} * * * *`, async () => {
  const prices = await market.prices()
  await market.record(prices)

  console.log(`recorded price data | ${++count}`)
})
