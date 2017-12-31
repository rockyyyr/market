const axios = require('axios')
const { market } = require('../exchange')

async function run () {
  try {
    const response = await axios.get('https://market-change.herokuapp.com/market')
    await market.dump(response.data)
    console.log('complete')
    process.exit(0)

  } catch(err) {
    console.error(err.message)
    process.exit(1)
  }
}

run()

