const candle = require('../prediction/candlesticks')
const moment = require('moment')

async function map(){

  const symbol = 'ETHBTC'

  const array = []
  let i

  for(i = 48; i >= 0; i-=4){
    const data = await candle.analyze(i)
    const filter = data.filter(item => item.symbol === symbol)
    // const filter = data
    const {time, high, low, open, close} = filter[0]
    array.push(filter[0])
    // array.push(
    //   [moment.unix(time).format(), parseFloat(open), parseFloat(high), parseFloat(low), parseFloat(close)]
    // )
  }

  console.log(JSON.stringify(array, null, 2))
  return {
    symbol,
    data: array
  }
}

// map()

module.exports = {
  map
}