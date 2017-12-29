const request = require('../util/request')
const db = require('../database/db')
const time = require('../util/time')

const table = 'market'

function prices (){
  return new Promise(async resolve => {
    const prices = await request.get('/api/v1/ticker/allPrices')
    resolve(prices.filter(bySymbol))
  })
}

async function record (prices){
  const data = prices
    .filter(bySymbol)
    .map(timestamp)

  return db.batchInsert(table, data)
}

function history (range){
  return db.selectRange(table, range)
}

function bySymbol(price){
  return price.symbol.endsWith('BTC')
}

function timestamp(item){
  item.time = time.now()
  return item
}

module.exports = {
  prices,
  record,
  history
}
