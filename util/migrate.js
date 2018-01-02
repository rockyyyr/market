const axios = require('axios')
const { market } = require('../exchange')
const moment = require('moment')

async function run () {
  try {
    const response = await axios.get('https://market-change.herokuapp.com/market')
    // await market.dump(response.data.map(item => {
    //   item.time = moment(item.time).unix()
    //   return item
    // }))
    await market.dump(response.data)
    console.log('complete')
    process.exit(0)

  } catch(err) {
    console.error(err.message)
    process.exit(1)
  }
}

async function toUTC(){
  const response = await axios.get('https://market-change.herokuapp.com/market')
  const mapped = response.data.map(item => {
    item.time = moment().unix(item.time)
    return item
  }).slice(0, 5)

  console.log(mapped)
}

run()
// toUTC()
